import { SetLocalPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * set_local — mutates a value in a local Zustand store.
 * Supports operations: set, merge, toggle, increment, remove.
 */
export async function handleSetLocal(
  action: Action,
  _config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = SetLocalPayloadSchema.parse(action.payload);

  const { useLocalStore } = await import("../../stores/local-store.js");
  const store = useLocalStore.getState();

  switch (payload.op) {
    case "set":
      store.set(payload.key, payload.value);
      break;
    case "merge":
      store.merge(payload.key, payload.value as Record<string, unknown>);
      break;
    case "toggle":
      store.toggle(payload.key);
      break;
    case "increment":
      store.increment(payload.key, typeof payload.value === "number" ? payload.value : 1);
      break;
    case "remove":
      store.remove(payload.key);
      break;
  }
}
