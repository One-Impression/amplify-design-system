import { BffCallPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

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

    // Non-optimistic success dispatch (or confirm optimistic).
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
