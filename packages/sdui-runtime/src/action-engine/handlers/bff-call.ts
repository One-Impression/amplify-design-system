import { BffCallPayloadSchema, EndpointPaths } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { useLocalStore } from "../../state/useLocalStore.js";
import { bindRequestPayload } from "../cond/resolve-request-refs.js";
import { resolveEndpointUrl, buildBffHeaders } from "./_shared/bff-request.js";

/**
 * bff_call — fetches a BFF endpoint with auth, dispatches on_success/on_error
 * chains, and supports optimistic updates with rollback via on_invalid_optimism.
 */
export async function handleBffCall(
  action: Action,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  // Bind request fields to local request context first: resolve any
  // `{ ref: "$.local.*" }` in query_params / request_body / path_params and
  // string-coerce the URL-bound records. Must happen BEFORE parse — the strict
  // `query_params: Record<string, string>` schema would otherwise reject a
  // ref-object value. This is how filters/tab/cursor/search ride into the call.
  const bound = bindRequestPayload(action.payload, useLocalStore.getState().data);
  const payload = BffCallPayloadSchema.parse(bound);

  // Resolve the endpoint id to a full URL (path lookup + param substitution +
  // query string) and build the standard header set — shared with reload.
  // The id is NOT a path; treating it as one would request "/creator.home.tab"
  // and 404. Throws loudly on an unregistered id or unsubstituted "{param}".
  const endpointPath = EndpointPaths[payload.endpoint];
  const url = resolveEndpointUrl(config, {
    endpoint: payload.endpoint,
    path_params: payload.path_params,
    query_params: payload.query_params,
  });

  const headers = buildBffHeaders(config);
  if (payload.idempotency_key) {
    headers["Idempotency-Key"] = payload.idempotency_key;
  }

  // Fire optimistic on_success before the network call.
  if (payload.optimistic && payload.on_success) {
    try {
      await engine.dispatch(payload.on_success as Action);
    } catch {
      // Optimistic dispatch failure is non-fatal.
    }
  }

  try {
    const res = await fetch(url, {
      method: payload.method,
      headers,
      body: payload.request_body ? JSON.stringify(payload.request_body) : undefined,
    });

    if (!res.ok) {
      throw new Error(`BFF ${payload.method} ${endpointPath} returned ${res.status}`);
    }

    // Server may bundle a follow-up action chain in the response body
    // (e.g. append_items for pagination, navigate after submit).
    // Parse defensively — non-JSON / empty bodies are tolerated.
    const body = await res.json().catch(() => null);
    if (
      body &&
      typeof body === "object" &&
      "action" in body &&
      (body as { action?: unknown }).action
    ) {
      await engine.dispatch((body as { action: Action }).action);
    }

    // Non-optimistic success dispatch (or confirm optimistic).
    // Body-driven action runs first; on_success is the caller-declared chain.
    if (!payload.optimistic && payload.on_success) {
      await engine.dispatch(payload.on_success as Action);
    }
  } catch (err) {
    // If we already dispatched optimistic success, dispatch rollback.
    if (payload.optimistic && payload.on_invalid_optimism) {
      await engine.dispatch(payload.on_invalid_optimism as Action);
    }

    if (payload.on_error) {
      await engine.dispatch(payload.on_error as Action);
    } else if (!payload.optimistic) {
      // Re-throw if no error handler and not optimistic.
      throw err;
    }
  }
}
