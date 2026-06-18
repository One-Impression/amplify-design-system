import {
  createNavigationContainerRef,
  StackActions,
} from "@react-navigation/native";

// Two dynamic screens pushed repeatedly with different params:
//  - "SduiPage"  — a page layout, pushed with a screenId (+ optional transition).
//  - "SduiSheet" — a bottom sheet, pushed `transparentModal` with a sheet id.
// The native-stack owns both page transitions and sheet presence; this ref +
// applyNavigate / pushSheet translate SDUI actions onto it.
export type SduiRootParamList = {
  SduiPage: {
    screenId: string;
    // Optional per-navigation transition, carried in the navigate action's
    // params. animation: slide_from_right | slide_from_bottom | fade | flip |
    // simple_push | none. presentation: card | modal | transparentModal | formSheet.
    transition?: string;
    presentation?: string;
    // Path the surface was fetched with (addressable, path-direct surfaces).
    // Carried so reload-by-name can reuse it to refetch this exact instance.
    contentPath?: string;
    // Header chrome the navigate action supplies for the LOADING phase: shown in
    // the native header synchronously (before the page document is fetched), so
    // the shimmer screen reads a proper title/subtitle instead of the raw route
    // name. The loaded page's own title / wire header reconciles in afterward.
    title?: string;
    subtitle?: string;
  };
  SduiSheet: {
    sheetId: string;
    // When set, the sheet fetches its own document from this path on open
    // (`on_load`-style) instead of reading the static `useBottomSheetStore`
    // registry. Also the refetch handle for reload-by-name on the sheet.
    contentPath?: string;
    // Header chrome the sheet action supplies for the LOADING phase: rendered
    // above the shimmer rows while the sheet fetches its document, so an opening
    // sheet reads a proper title/subtitle. The fetched doc's own header/title
    // takes over once it arrives.
    title?: string;
    subtitle?: string;
  };
};

export const navigationRef = createNavigationContainerRef<SduiRootParamList>();

export const SDUI_PAGE_ROUTE = "SduiPage" as const;
export const SDUI_SHEET_ROUTE = "SduiSheet" as const;

/**
 * Pop the topmost route off the native stack. Because bottom sheets are routes
 * (see SduiSheetScreen), this uniformly handles both "back from a page" and
 * "dismiss the open sheet" — there is no separate sheet-open state to consult.
 * Wired to any custom back affordance and safe to call when nothing can pop.
 */
export function goBack(): void {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

/**
 * Push a bottom sheet as a `transparentModal` route. `contentPath` (optional)
 * makes this an ADDRESSABLE sheet that fetches its own document from that path
 * on open instead of reading the static registry — see `SduiSheetScreen`.
 */
export function pushSheet(
  sheetId: string,
  contentPath?: string,
  chrome?: { title?: string; subtitle?: string },
): void {
  if (!navigationRef.isReady()) return;
  navigationRef.dispatch(
    StackActions.push(SDUI_SHEET_ROUTE, {
      sheetId,
      contentPath,
      title: chrome?.title,
      subtitle: chrome?.subtitle,
    }),
  );
}

/**
 * Dismiss a sheet. Sheets are routes, so this simply pops the top — the
 * `sheetId` is accepted for signature parity with the legacy store dismisser
 * but the native stack only ever dismisses its top route.
 */
export function popSheet(_sheetId?: string): void {
  goBack();
}

/**
 * Maps an SDUI `navigate` action onto the native stack. Pass this as
 * `SduiRuntimeProvider`'s `onNavigate` so the runtime owns navigation.
 */
export function applyNavigate(
  op: string,
  target: string,
  params?: Record<string, unknown>,
): void {
  if (!navigationRef.isReady()) return;
  // Per-navigation transition hints (server-driven): the navigate action can
  // carry `transition` (native-stack animation) and/or `presentation`.
  const routeParams = {
    screenId: target,
    transition: params?.transition as string | undefined,
    presentation: params?.presentation as string | undefined,
    // Path-direct surfaces carry the path they were fetched with so
    // reload-by-name can refetch this exact instance.
    contentPath: params?.path as string | undefined,
    // Loading-phase header chrome (server-driven): shown during the shimmer
    // before the page document resolves. See SduiRootParamList.SduiPage.
    title: params?.title as string | undefined,
    subtitle: params?.subtitle as string | undefined,
  };
  switch (op) {
    case "pop":
    case "modal_dismiss":
      goBack();
      break;
    case "pop_to_root":
      navigationRef.dispatch(StackActions.popToTop());
      break;
    case "replace":
      if (target) {
        navigationRef.dispatch(StackActions.replace(SDUI_PAGE_ROUTE, routeParams));
      }
      break;
    case "push":
    case "modal_open":
    default:
      if (target) {
        navigationRef.dispatch(StackActions.push(SDUI_PAGE_ROUTE, routeParams));
      }
      break;
  }
}
