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
  _config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  const payload = BranchPayloadSchema.parse(action.payload);

  const read = await loadLocalReader();
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
async function loadLocalReader(): Promise<(key: string) => unknown> {
  try {
    const { useLocalStore } = await import("../../state/useLocalStore.js");
    return (key: string) => useLocalStore.getState().get(key);
  } catch {
    // Local store unavailable — every key reads as undefined.
    return () => undefined;
  }
}
