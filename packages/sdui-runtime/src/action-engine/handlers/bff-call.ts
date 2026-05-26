import { BffCallPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { useDevConfigStore } from "../../state/useDevConfigStore.js";

/**
 * Returns true if the given BFF base URL targets a local development
 * gateway (localhost / 127.0.0.1). Used to gate dev-only request
 * augmentation such as the X-Dev-Identity header.
 */
function isLocalhostBffUrl(bffBaseUrl: string): boolean {
  return bffBaseUrl.includes("localhost") || bffBaseUrl.includes("127.0.0.1");
}

/**
 * bff_call — fetches a BFF endpoint with auth, dispatches on_success/on_error
 * chains, and supports optimistic updates with rollback via on_invalid_optimism.
 */
export async function handleBffCall(
  action: Action,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  const payload = BffCallPayloadSchema.parse(action.payload);

  // Build the URL, substituting path params.
  let endpointPath = payload.endpoint as string;
  if (payload.path_params) {
    for (const [key, value] of Object.entries(payload.path_params)) {
      endpointPath = endpointPath.replace(`{${key}}`, encodeURIComponent(value));
    }
  }

  // Build query string.
  let url = `${config.bffBaseUrl}/${endpointPath}`;
  if (payload.query_params) {
    const qs = new URLSearchParams(payload.query_params).toString();
    if (qs) url += `?${qs}`;
  }

  // Build headers.
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = config.authToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (payload.idempotency_key) {
    headers["Idempotency-Key"] = payload.idempotency_key;
  }

  // Dev-only: inject X-Dev-Identity header for requests against a local
  // BFF (localhost / 127.0.0.1). The creator-app sets this via
  // useDevConfigStore.setDevIdentity(...) at boot when running against
  // a mocked / locally-running gateway. Silently skipped when unset
  // or when the URL is non-localhost — production traffic is never
  // augmented even if the value happens to be populated.
  if (isLocalhostBffUrl(config.bffBaseUrl)) {
    const devIdentity = useDevConfigStore.getState().devIdentity;
    if (devIdentity) {
      headers["X-Dev-Identity"] = devIdentity;
    }
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
