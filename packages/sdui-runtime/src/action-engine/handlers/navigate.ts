import { NavigatePayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * navigate — delegates to config.onNavigate with the parsed op, target, and params.
 *
 * Target resolution order (matches the gradual migration off the
 * legacy emit shape — see amplify-schemas#172):
 *
 *  1. `payload.target` — the new, schema-canonical location.
 *  2. `action.target`  — legacy fallback. Cached / third-party / pre-#172
 *                        emits put the destination one level up at the
 *                        action level. When this branch fires, emit a
 *                        deprecation warning through `config.logger` so
 *                        the stale source is easy to identify.
 *
 * If neither is present we still call `onNavigate` with an empty string
 * so existing call sites get the same behaviour as before.
 */
export async function handleNavigate(
  action: Action,
  config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = NavigatePayloadSchema.parse(action.payload);

  // Probe the action for the legacy action-level `target` without
  // widening the schema-typed `Action`.
  const legacyTarget = (action as Action & { target?: unknown }).target;
  const legacyTargetIsString = typeof legacyTarget === "string";

  let target: string;
  if (payload.target !== undefined && payload.target !== null) {
    // New-style emit wins — never log a deprecation when the payload
    // already provides the canonical field, even if the legacy field
    // also happens to be set.
    target = payload.target;
  } else if (legacyTargetIsString) {
    target = legacyTarget;
    const warn =
      config.logger?.warn ??
      ((message: string, context?: Record<string, unknown>) => {
        // eslint-disable-next-line no-console
        console.warn(message, context);
      });
    warn(
      "[sdui-runtime] navigate action used legacy action.target — move target into payload (schemas#172)",
      { op: payload.op, target: legacyTarget },
    );
  } else {
    target = "";
  }

  config.onNavigate(payload.op, target, payload.params);
}
