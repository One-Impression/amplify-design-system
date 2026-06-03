import { BranchPayloadSchema } from "@one-impression/sdk-native-sdui/actions";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { evaluateCond } from "../cond/eval-cond.js";

/**
 * branch — conditional action dispatcher.
 *
 * Evaluates a `Cond` guard against local state and dispatches `then` on truthy
 * results or `else` on falsy. When the guard is falsy and no `else` is set,
 * the verb resolves as a no-op.
 */
export async function handleBranch(
  action: Action,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  const payload = BranchPayloadSchema.parse(action.payload);

  const read = await loadLocalReader(config);
  const condResult = evaluateCond(payload.if, read);

  if (condResult) {
    await engine.dispatch(payload.then);
    return;
  }

  if (payload.else) {
    await engine.dispatch(payload.else);
  }
}

/**
 * Lazily resolves the local-state reader. Dynamic import keeps the action
 * engine module-graph free of state imports (matches the established pattern
 * in `set-local.ts` / `compound.ts`).
 */
async function loadLocalReader(
  config: ActionEngineConfig,
): Promise<(key: string) => unknown> {
  try {
    const { useLocalStore } = await import("../../state/useLocalStore.js");
    return (key: string) => useLocalStore.getState().get(key);
  } catch (error) {
    // Local store unavailable (bundler misconfig, missing peer, etc.) — surface
    // the failure so it's diagnosable rather than silently producing falsy
    // branch evaluations. Prefer the host's structured logger (visible to log
    // aggregation pipelines like CloudWatch / Sentry) when supplied; otherwise
    // fall back to `console.warn` for dev-console visibility. Reader still
    // returns undefined so callers degrade gracefully (cond:local evaluates as
    // falsy, else-branch fires).
    const message =
      "[sdui-runtime] cond:local store unavailable — all keys will read as undefined";
    if (config.logger) {
      config.logger.warn(message, { error });
    } else {
      console.warn(message, error);
    }
    return () => undefined;
  }
}
