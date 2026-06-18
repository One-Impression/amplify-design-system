import { SheetPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { presentSheet } from "../../navigation/sheetPresenter.js";

/**
 * sheet — opens a bottom sheet by id.
 *
 * Two flavours, decided by whether the action carries a `content_path`:
 *  - **Static (legacy):** the page renderer registers `page.bottom_sheets[]`
 *    entries on mount; this handler opens the sheet by id (lookup pattern) — it
 *    does NOT stamp a new sheet definition. Content comes from
 *    `useBottomSheetStore.registry[sheet_id]`.
 *  - **Addressable (new):** the action carries `content_path` — a path-direct
 *    URL the sheet fetches its own document from on open (`on_load`-style),
 *    fresh every time. The parent only opens a shell; the sheet owns its content
 *    and reload-by-name refetches it.
 *
 * `presentSheet` routes to the native-stack sheet route when `SduiNavigationHost`
 * is mounted, else to the legacy store-based host. `content_path` is read off
 * the raw payload (the schema's strip mode drops unknown keys, so it never
 * reaches the parsed value — and a schema bump isn't required to thread it).
 */
export async function handleSheet(
  action: Action,
  _config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = SheetPayloadSchema.parse(action.payload);
  const raw = action.payload as
    | { content_path?: unknown; content_title?: unknown; content_subtitle?: unknown }
    | undefined;
  const contentPath =
    typeof raw?.content_path === "string" ? raw.content_path : undefined;
  // Loading-phase header chrome (read off the raw payload alongside
  // content_path — the schema strips unknown keys, so no schema bump needed):
  // rendered above the shimmer while the sheet fetches its document.
  const title =
    typeof raw?.content_title === "string" ? raw.content_title : undefined;
  const subtitle =
    typeof raw?.content_subtitle === "string" ? raw.content_subtitle : undefined;
  presentSheet(payload.sheet_id, contentPath, { title, subtitle });
}
