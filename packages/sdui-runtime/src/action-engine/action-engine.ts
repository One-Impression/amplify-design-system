/**
 * Enhanced Action Engine — the central dispatcher for all SDUI actions.
 *
 * Responsibilities:
 * - Routes action verbs to their registered handlers
 * - Routes "capability:*" types to the capability dispatcher
 * - Handles async chains (on_success / on_error)
 * - Provides the ActionEngine interface to handlers for recursive dispatch
 */
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine, ActionHandler } from "./types.js";
import { actionHandlerMap } from "./handlers/index.js";
import { handleCapability } from "./handlers/capability.js";

/**
 * Pending debounce timers, keyed by logical action identity (verb + target +
 * endpoint). A rapid burst of "the same" action (e.g. a filter toggled several
 * times) collapses onto the trailing dispatch — only the last run executes,
 * after the window elapses. Module-level so a timer survives across the
 * separate dispatch() calls a burst produces.
 */
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

/** Stable key for coalescing repeat dispatches of "the same" action. */
function debounceKey(action: Action): string {
  const payload = action.payload as
    | { endpoint?: string; target?: string }
    | undefined;
  const target = action.target ?? payload?.target ?? "";
  const endpoint = payload?.endpoint ?? "";
  return `${action.type}|${target}|${endpoint}`;
}

/**
 * Creates an ActionEngine instance bound to the given config.
 *
 * The engine exposes a single `dispatch` method that handlers use
 * for recursive/chained dispatch (compound, on_success, on_error).
 */
export function createActionEngine(config: ActionEngineConfig): ActionEngine {
  const engine: ActionEngine = {
    dispatch: async (action: Action): Promise<void> => {
      await dispatchAction(action, config, engine);
    },
  };

  return engine;
}

/**
 * Core dispatch logic.
 *
 * 1. If the action type starts with "capability:", route to the capability dispatcher.
 * 2. Otherwise look up the verb handler from the registry.
 * 3. On success, dispatch on_success if present.
 * 4. On error, dispatch on_error if present; otherwise re-throw.
 */
async function dispatchAction(
  action: Action,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  const { type } = action;

  // Backend-controlled debounce. When debounce_ms > 0, coalesce a rapid burst
  // of this action onto the trailing dispatch: cancel any pending timer for
  // this key and schedule the run after the window. The scheduled dispatch
  // strips debounce_ms so it executes immediately (no re-debounce loop) and is
  // fire-and-forget — the caller's promise resolves now, which is the intended
  // debounce semantics. Errors in the detached run route through on_error (in
  // the recursive dispatch) or are logged rather than left as unhandled.
  const debounceMs = action.debounce_ms;
  if (typeof debounceMs === "number" && debounceMs > 0) {
    const key = debounceKey(action);
    const existing = debounceTimers.get(key);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      debounceTimers.delete(key);
      void dispatchAction({ ...action, debounce_ms: 0 }, config, engine).catch(
        (err) => {
          console.warn(`action-engine: debounced "${type}" failed`, err);
        },
      );
    }, debounceMs);
    debounceTimers.set(key, timer);
    return;
  }

  // Immediate dispatch supersedes any pending debounced run of the same key:
  // e.g. a tab switch (reload, no debounce) cancels an in-flight filter
  // reload so a stale filtered page can't land on top of the new tab.
  const pending = debounceTimers.get(debounceKey(action));
  if (pending) {
    clearTimeout(pending);
    debounceTimers.delete(debounceKey(action));
  }

  // Route capability:* actions to the capability dispatcher.
  if (type.startsWith("capability:")) {
    await handleCapability(action, config, engine);
    return;
  }

  // Look up the verb handler.
  const handler: ActionHandler | undefined = actionHandlerMap[type];
  if (!handler) {
    console.warn(`action-engine: unknown action type "${type}"`);
    return;
  }

  try {
    await handler(action, config, engine);

    // The handler executed successfully.
    // For most handlers, on_success chaining is handled inside the handler
    // itself (e.g., bff_call). For simple handlers that don't manage their
    // own chains, we dispatch on_success here as a fallback.
    // bff_call and capability already handle their own on_success internally,
    // so they won't have on_success remaining at this level unless the
    // handler explicitly leaves it to the engine.
    if (action.on_success && type !== "bff_call") {
      await engine.dispatch(action.on_success as Action);
    }
  } catch (err) {
    if (action.on_error) {
      await engine.dispatch(action.on_error as Action);
    } else {
      throw err;
    }
  }
}
