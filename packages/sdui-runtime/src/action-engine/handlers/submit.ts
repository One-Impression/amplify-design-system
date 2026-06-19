import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { useFormStore, selectFormIsValid } from "../../state/useFormStore.js";
import { resolveRequestUrl, buildBffHeaders } from "./_shared/bff-request.js";

/**
 * `submit` action payload (a runtime wire extension — promote to the SDK with
 * the rest of the form contract, D11).
 */
interface SubmitPayload {
  /** Which form's values to collect (keyed in useFormStore). */
  form_id: string;
  /**
   * Path-direct request target — the concrete BFF path the handler emits (e.g.
   * `/v1/creator/kyc/verify`), fetched as `bffBaseUrl + path`. Shares the
   * `bff_call` / `reload` plumbing; there is NO client-side endpoint registry.
   */
  path: string;
  /** `{param}` / `:param` substitutions for the path. */
  path_params?: Record<string, string>;
  /** Query-string params appended to the path. */
  query_params?: Record<string, string>;
  /** HTTP method; defaults to POST. */
  method?: string;
  /** Server-known constants merged UNDER the form values (design D3/D4). */
  request_body?: Record<string, unknown>;
  /** Dispatched on a 2xx response. */
  on_success?: Action;
  /** Dispatched on a non-2xx / network failure (server field errors are also
   *  written into the form's error map first — design D10). */
  on_error?: Action;
}

/**
 * submit — collect a form's values, gate on validity, POST, and route the
 * result. A thin sibling of `bff_call` specialised for forms:
 *
 *  1. **Gate (validate-on-submit, D9 default):** mark every field touched so all
 *     errors surface, then abort if the form is invalid — no request, and
 *     neither on_success nor on_error fire (the user just sees what to fix).
 *  2. **Merge (D4):** body = `{ ...request_body, ...forms[form_id].values }` —
 *     form values win; server-known constants ride along via request_body.
 *  3. **Route:** 2xx → on_success; non-2xx → write any server field errors into
 *     the SAME error map (D10) then on_error.
 *
 * on_success / on_error live in `payload` (not at the action top level) so the
 * engine's generic chaining doesn't fire them — this handler owns success vs.
 * error vs. abort.
 */
export async function handleSubmit(
  action: Action,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  const payload = (action.payload ?? {}) as unknown as SubmitPayload;
  const formId = payload.form_id;
  if (!formId || !payload.path) {
    config.logger?.warn("submit: missing form_id or path");
    return;
  }

  const store = useFormStore.getState();

  // 1. Validate-on-submit gate: reveal all errors, then abort if invalid.
  store.touchAll(formId);
  if (!selectFormIsValid(useFormStore.getState(), formId)) {
    return; // invalid — errors now visible; do not submit, do not chain.
  }

  // 2. Merge: server constants first, form values win.
  const values = store.getForm(formId)?.values ?? {};
  const body = { ...(payload.request_body ?? {}), ...values };

  // 3. Path-direct URL + the shared BFF header set (auth + dev identity +
  //    active-social), identical to bff_call / reload — keeps form submits on
  //    the same plumbing rather than a bespoke, header-light path.
  const url = resolveRequestUrl(config, {
    path: payload.path,
    path_params: payload.path_params,
    query_params: payload.query_params,
  });
  const headers = buildBffHeaders(config);

  try {
    const res = await fetch(url, {
      method: payload.method ?? "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // Server-authoritative field errors (D10): write into the same error map
      // the client rules use, mark touched so they show, then run on_error.
      const errBody = (await res.json().catch(() => null)) as
        | { errors?: Record<string, string | null> }
        | null;
      if (errBody?.errors && typeof errBody.errors === "object") {
        useFormStore.getState().setErrors(formId, errBody.errors);
        useFormStore.getState().touchAll(formId);
      }
      if (payload.on_error) await engine.dispatch(payload.on_error);
      return;
    }

    // Success. The server may bundle a follow-up action (e.g. navigate).
    const okBody = (await res.json().catch(() => null)) as
      | { action?: Action }
      | null;
    if (okBody?.action) await engine.dispatch(okBody.action);
    if (payload.on_success) await engine.dispatch(payload.on_success);
  } catch (err) {
    if (payload.on_error) await engine.dispatch(payload.on_error);
    else config.logger?.warn("submit: request failed", { err: String(err) });
  }
}
