import { useCallback, useEffect } from "react";
import { BackHandler } from "react-native";
import { useShallow } from "zustand/react/shallow";
import type { Page, Node, Action } from "@one-impression/sdk-native-sdui";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useAppStateSession } from "../../hooks/useAppStateSession.js";
import { usePageRefresh } from "../../hooks/usePageRefresh.js";
import { useBottomSheetStore } from "../../bottom-sheet/useBottomSheetStore.js";
import { usePageStore } from "../../state/usePageStore.js";

/** Normalize a UI-zone slot (single node, array, or absent) to a node array. */
function toNodeArray(value: unknown): Node[] {
  if (Array.isArray(value)) return value.filter(Boolean) as Node[];
  return value ? [value as Node] : [];
}

export interface PageScaffold {
  /** The live page tree (store-backed once an action mutates it; prop until then). */
  page: Page;
  /**
   * Resolve a UI zone to the nodes to render: its content, or its skeleton while
   * the zone is reloading / not yet loaded. Convention: zone `"content"` maps to
   * top-level `items`; any other zone `X` maps to `data.X`, with its placeholder
   * at `data.X_skeleton`. Always returns an array the layout maps over.
   */
  getUiZone: (name: string) => Node[];
  /** True while a `reload` naming this UI zone is in flight. */
  isUiZoneLoading: (name: string) => boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

/**
 * Base page scaffold — owns every cross-cutting page concern so a layout
 * renderer is reduced to pure zone geometry (where each UI zone sits, what pins
 * vs scrolls). Shared by all page layouts:
 *
 * - lifecycle: `on_load` (once) / `on_dismount` / hardware back / app fg-bg
 * - live-page subscription + the `reload` partial-merge (via usePageStore)
 * - per-zone loading → skeleton selection (`getUiZone`)
 * - inline bottom-sheet registration
 * - pull-to-refresh
 *
 * A layout calls this and places `getUiZone("header" | "content" | "footer" | …)`
 * in its zones; the zone/skeleton/reload capability is uniform and dormant for
 * pages that declare no UI zones/skeletons.
 */
export function usePageScaffold(page: Page): PageScaffold {
  const actionEngine = useActionEngine();
  const register = useBottomSheetStore((s) => s.register);
  const unregister = useBottomSheetStore((s) => s.unregister);

  // Live page: store-backed for THIS screen (so reload/append/replace flow back
  // in), prop fallback before the mount-sync commits or during a nav transition.
  const livePage = usePageStore(
    useShallow((s): Page => (s.pageId === page.id && s.page ? s.page : page)),
  );
  const loadingUiZones = usePageStore((s) => s.loadingUiZones);

  const { refreshing, onRefresh } = usePageRefresh(livePage.on_refresh);

  // Sync the server page into the store on mount / prop change, so action
  // handlers (reload merge, append_items, replace_node) flow back to the layout.
  useEffect(() => {
    usePageStore.getState().setPageTree(page);
  }, [page]);

  // Page lifecycle: on_load (once) / on_dismount (unmount).
  useEffect(() => {
    if (page.on_load) actionEngine.dispatch(page.on_load);
    return () => {
      if (page.on_dismount) actionEngine.dispatch(page.on_dismount);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useAppStateSession(page.on_app_foreground, page.on_app_background);

  // Hardware back (Android).
  useEffect(() => {
    if (!page.on_back_press) return;
    const handler = () => {
      actionEngine.dispatch(page.on_back_press as Action);
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", handler);
    return () => sub.remove();
  }, [actionEngine, page.on_back_press]);

  // Register inline bottom sheets (do not open).
  useEffect(() => {
    if (!page.bottom_sheets) return;
    for (const sheet of page.bottom_sheets) {
      register(sheet.id, {
        id: sheet.id,
        title: sheet.title,
        size: sheet.size ?? "medium",
        items: sheet.items ?? [],
        header: (sheet as { header?: Node }).header,
        footer: (sheet as { footer?: Node }).footer,
        on_dismiss: sheet.on_dismiss,
        on_open: sheet.on_open,
        overlay_on_click: (sheet as { overlay_on_click?: unknown }).overlay_on_click,
      });
    }
    return () => {
      if (!page.bottom_sheets) return;
      for (const sheet of page.bottom_sheets) unregister(sheet.id);
    };
  }, [page.bottom_sheets, register, unregister]);

  const isUiZoneLoading = useCallback(
    (name: string) => !!loadingUiZones[name],
    [loadingUiZones],
  );

  const getUiZone = useCallback(
    (name: string): Node[] => {
      const data = (livePage.data ?? {}) as Record<string, unknown>;
      const isContent = name === "content";
      const content = isContent ? livePage.items : data[name];
      const skeleton = isContent ? data.content_skeleton : data[`${name}_skeleton`];
      const contentArr = toNodeArray(content);
      // Show the skeleton while the zone is reloading OR before it has any
      // content (the shell case, before on_load's reload fills it).
      if (skeleton && (loadingUiZones[name] || contentArr.length === 0)) {
        return toNodeArray(skeleton);
      }
      return contentArr;
    },
    [livePage, loadingUiZones],
  );

  return { page: livePage, getUiZone, isUiZoneLoading, refreshing, onRefresh };
}
