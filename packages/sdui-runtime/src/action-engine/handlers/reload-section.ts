import { ReloadSectionPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * reload_section — fetches a fresh node from the BFF and replaces the
 * target section in the current page store by its ID.
 */
export async function handleReloadSection(
  action: Action,
  config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = ReloadSectionPayloadSchema.parse(action.payload);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = config.authToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${config.bffBaseUrl}/${payload.endpoint}`;
  const res = await fetch(url, {
    method: payload.payload ? "POST" : "GET",
    headers,
    body: payload.payload ? JSON.stringify(payload.payload) : undefined,
  });

  if (!res.ok) {
    throw new Error(
      `reload_section: BFF ${payload.endpoint} returned ${res.status}`,
    );
  }

  const node = await res.json();

  const { usePageStore } = await import("../../state/usePageStore.js");
  usePageStore.getState().replaceNode(payload.target, node);
}
