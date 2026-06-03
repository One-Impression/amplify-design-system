import { SetLocalPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { isRefObject, resolveValue } from "../cond/resolve-ref.js";

/**
 * set_local — mutates a value in the local Zustand store.
 *
 * Operations: set, merge, toggle, increment, remove.
 *
 * `value` accepts either a literal JSON value OR a ref-object resolved at
 * dispatch time:
 *
 *   { ref: "$.now" }                          — current epoch ms
 *   { ref: "$.now_minus_seconds", n: number } — past epoch ms
 *   { ref: "$.response.<path>" }              — value plucked from a chaining
 *                                               bff_call's response
 *   { ref: "$.payload.<path>" }               — value plucked from the
 *                                               triggering Action's payload
 *
 * Unresolved refs (unknown form, missing path, no resolver context) resolve
 * to `null` rather than throwing — the BFF reviewer rule
 * `bff-set-local-ref-resolvable` is the gate that BLOCKs statically
 * determinable misses; the runtime fails open on dynamic ones.
 */
export async function handleSetLocal(
  action: Action,
  _config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = SetLocalPayloadSchema.parse(action.payload);

  const { useLocalStore } = await import("../../state/useLocalStore.js");
  const store = useLocalStore.getState();

  // Resolve ref-shape values; pass through literals unchanged.
  // No response/payload context is wired at the action-engine level today;
  // refs that need response chaining resolve to `null` and the BFF reviewer
  // catches that statically.
  const resolvedValue = isRefObject(payload.value)
    ? resolveValue(payload.value)
    : payload.value;

  switch (payload.op) {
    case "set":
      store.set(payload.key, resolvedValue);
      break;
    case "merge":
      // Merge requires an object value; non-object resolves are a no-op
      // rather than a throw — keeps the dispatcher resilient to upstream
      // ref-resolution misses.
      if (
        resolvedValue &&
        typeof resolvedValue === "object" &&
        !Array.isArray(resolvedValue)
      ) {
        store.merge(payload.key, resolvedValue as Record<string, unknown>);
      }
      break;
    case "toggle":
      store.toggle(payload.key);
      break;
    case "increment":
      store.increment(
        payload.key,
        typeof resolvedValue === "number" ? resolvedValue : 1,
      );
      break;
    case "remove":
      store.remove(payload.key);
      break;
  }
}
