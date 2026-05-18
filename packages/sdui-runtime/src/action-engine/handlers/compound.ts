import {
  CompoundPayloadSchema,
  type CompoundNode,
} from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * compound — recursively interprets a compound action AST.
 *
 * Node types:
 *   sequence — runs children in order, awaiting each
 *   parallel  — runs children concurrently via Promise.all
 *   branch    — evaluates a condition string against local state, picks then/else
 *   catch     — runs try child, falls back to catch child on error
 *   delay     — waits delay_ms, then runs child
 */
export async function handleCompound(
  action: Action,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  const payload = CompoundPayloadSchema.parse(action.payload);
  await interpretNode(payload.root, config, engine);
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
    const { useLocalStore } = await import("../../stores/local-store.js");
    const value = useLocalStore.getState().get(key);
    const result = Boolean(value);
    return negate ? !result : result;
  } catch {
    // If local store is unavailable, condition evaluates to false.
    return negate;
  }
}
