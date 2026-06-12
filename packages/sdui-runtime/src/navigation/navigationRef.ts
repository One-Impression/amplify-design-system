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
  };
  SduiSheet: {
    sheetId: string;
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

/** Push a bottom sheet as a `transparentModal` route. */
export function pushSheet(sheetId: string): void {
  if (!navigationRef.isReady()) return;
  navigationRef.dispatch(StackActions.push(SDUI_SHEET_ROUTE, { sheetId }));
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
