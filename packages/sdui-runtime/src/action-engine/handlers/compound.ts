import {
  CompoundPayloadSchema,
  type CompoundNode,
} from "@one-impression/sdk-native-sdui";
import { CompoundActionPayloadSchema } from "@one-impression/sdk-native-sdui/actions";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * compound — runs a list of child actions in sequence or parallel.
 *
 * Two payload shapes are accepted:
 *
 *   1. Flat shape (preferred):
 *      `{ mode: "sequence" | "parallel", actions: Action[], wait: "all" | "first" }`
 *      `mode` defaults to "sequence", `wait` defaults to "all".
 *      `wait: "first"` resolves on the first child to settle; remaining
 *      children become fire-and-forget.
 *
 *   2. Legacy AST shape (deprecated, retained for in-flight consumers):
 *      `{ root: CompoundNode }` with `node_type` of sequence / parallel /
 *      branch / catch / delay. New emitters should use the top-level
 *      `action:branch` verb plus the flat compound shape; `catch` and
 *      `delay` have no locked replacement yet.
 *
 * The handler discriminates by payload shape — presence of `actions` (array)
 * routes to the flat path; presence of `root` routes to the legacy AST path.
 */
export async function handleCompound(
  action: Action,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  const raw = (action.payload ?? {}) as Record<string, unknown>;

  if (Array.isArray(raw.actions)) {
    const payload = CompoundActionPayloadSchema.parse(action.payload);
    if (payload.mode === "parallel") {
      await runParallel(payload.actions, payload.wait, engine);
    } else {
      await runSequence(payload.actions, payload.wait, engine);
    }
    return;
  }

  // Fall through to legacy AST interpretation.
  const legacy = CompoundPayloadSchema.parse(action.payload);
  await interpretNode(legacy.root, config, engine);
}

/**
 * Sequential dispatch.
 *
 * - `wait: "all"` (default) — awaits every child in declared order; an error
 *   propagates up and skips the remainder.
 * - `wait: "first"` — awaits the first child only; the rest are kicked off
 *   without `await` and any rejection is swallowed (matches the documented
 *   "fire-and-forget" contract).
 */
async function runSequence(
  actions: Action[],
  wait: "all" | "first",
  engine: ActionEngine,
): Promise<void> {
  if (!actions.length) return;

  if (wait === "first") {
    const [head, ...tail] = actions;
    await engine.dispatch(head);
    for (const a of tail) {
      // Fire-and-forget — swallow rejection so a late failure doesn't crash
      // the caller's microtask queue.
      void Promise.resolve(engine.dispatch(a)).catch(() => undefined);
    }
    return;
  }

  for (const a of actions) {
    await engine.dispatch(a);
  }
}

/**
 * Parallel dispatch.
 *
 * - `wait: "all"` — `Promise.allSettled` so one failure doesn't abort the
 *   siblings; an aggregate error surfaces only if all rejected.
 * - `wait: "first"` — race; the winning child decides resolution and the
 *   rest become fire-and-forget.
 */
async function runParallel(
  actions: Action[],
  wait: "all" | "first",
  engine: ActionEngine,
): Promise<void> {
  if (!actions.length) return;

  const promises = actions.map((a) =>
    Promise.resolve(engine.dispatch(a)),
  );

  if (wait === "first") {
    // Race for resolution; orphan rejections are swallowed so an unawaited
    // rejection doesn't surface as an unhandled-promise warning.
    for (const p of promises) {
      p.catch(() => undefined);
    }
    await Promise.race(promises);
    return;
  }

  const results = await Promise.allSettled(promises);
  const firstReject = results.find(
    (r): r is PromiseRejectedResult => r.status === "rejected",
  );
  // Surface failures only when every sibling failed — partial success is
  // common for analytics-style fan-out and should not abort the caller.
  if (firstReject && results.every((r) => r.status === "rejected")) {
    throw firstReject.reason;
  }
}

/**
 * Determines whether a node in the compound AST is itself a CompoundNode
 * (has node_type) vs a plain Action (has type).
 */
function isCompoundNode(
  node: Action | CompoundNode,
): node is CompoundNode {
  return "node_type" in node && !("type" in node);
}

/**
 * Dispatches either a plain Action or recursively interprets a CompoundNode.
 */
async function dispatchOrInterpret(
  node: Action | CompoundNode,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  if (isCompoundNode(node)) {
    await interpretNode(node, config, engine);
  } else {
    await engine.dispatch(node as Action);
  }
}

/**
 * Core recursive interpreter for compound AST nodes.
 */
async function interpretNode(
  node: CompoundNode,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  switch (node.node_type) {
    case "sequence":
      await interpretSequence(node, config, engine);
      break;
    case "parallel":
      await interpretParallel(node, config, engine);
      break;
    case "branch":
      await interpretBranch(node, config, engine);
      break;
    case "catch":
      await interpretCatch(node, config, engine);
      break;
    case "delay":
      await interpretDelay(node, config, engine);
      break;
    default:
      throw new Error(`compound: unknown node_type "${(node as CompoundNode).node_type}"`);
  }
}

/** sequence — runs children in order, awaiting each. */
async function interpretSequence(
  node: CompoundNode,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  if (!node.children?.length) return;
  for (const child of node.children) {
    await dispatchOrInterpret(child, config, engine);
  }
}

/** parallel — runs children concurrently via Promise.all. */
async function interpretParallel(
  node: CompoundNode,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  if (!node.children?.length) return;
  await Promise.all(
    node.children.map((child) => dispatchOrInterpret(child, config, engine)),
  );
}

/**
 * branch — evaluates a condition string against local state.
 * Condition format: simple key lookups that are truthy/falsy.
 * If condition resolves truthy, runs `then`; otherwise runs `else`.
 */
async function interpretBranch(
  node: CompoundNode,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  const conditionResult = await evaluateCondition(node.condition ?? "");

  if (conditionResult) {
    if (node.then) {
      await dispatchOrInterpret(node.then, config, engine);
    }
  } else {
    if (node.else) {
      await dispatchOrInterpret(node.else, config, engine);
    }
  }
}

/** catch — runs try child, falls back to catch child on error. */
async function interpretCatch(
  node: CompoundNode,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  try {
    if (node.try) {
      await dispatchOrInterpret(node.try, config, engine);
    }
  } catch {
    if (node.catch) {
      await dispatchOrInterpret(node.catch, config, engine);
    }
  }
}

/** delay — waits delay_ms milliseconds, then runs child. */
async function interpretDelay(
  node: CompoundNode,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  const ms = node.delay_ms ?? 0;
  if (ms > 0) {
    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  }
  if (node.child) {
    await dispatchOrInterpret(node.child, config, engine);
  }
}

/**
 * Evaluates a condition string against the local store.
 *
 * Simple conditions are treated as dot-path lookups into the local store.
 * A "!" prefix negates the result. Returns the truthiness of the value.
 *
 * Examples:
 *   "user.isLoggedIn"  -> local.get("user.isLoggedIn") is truthy
 *   "!form.submitted"  -> local.get("form.submitted") is falsy
 */
async function evaluateCondition(condition: string): Promise<boolean> {
  if (!condition) return false;

  let negate = false;
  let key = condition.trim();
  if (key.startsWith("!")) {
    negate = true;
    key = key.slice(1).trim();
  }

  try {
    const { useLocalStore } = await import("../../state/useLocalStore.js");
    const value = useLocalStore.getState().get(key);
    const result = Boolean(value);
    return negate ? !result : result;
  } catch {
    // If local store is unavailable, condition evaluates to false.
    return negate;
  }
}
