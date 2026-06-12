// @one-impression/sdui-runtime — SDUI runtime for Amplify Creator App
// Renderers + runtime + state + action engine + bottom-sheet manager + loaders.
// React Native code — NOT Node-safe. Backend consumers use @one-impression/sdk-native-sdui instead.

// ── Provider ──
export { SduiRuntimeProvider } from "./SduiRuntimeProvider.js";

// ── SduiNode base wrapper ──
export { SduiNode } from "./sdui-node/index.js";
export { SduiErrorBoundary } from "./sdui-node/index.js";
export { SduiFallback } from "./sdui-node/index.js";

// ── Interpreter ──
export { Interpreter } from "./interpreter/index.js";
export { PageRoot } from "./interpreter/index.js";
export { Fallback } from "./interpreter/index.js";

// ── HOCs ──
export { Clickable } from "./clickable/index.js";
export { Viewable } from "./viewable/index.js";
export { Gradient } from "./gradient/index.js";
export type { GradientItem } from "./gradient/index.js";

// ── Action engine ──
export { createActionEngine, useActionEngine, ActionEngineContext } from "./action-engine/index.js";
export type { ActionEngine, ActionEngineConfig, ActionHandler } from "./action-engine/index.js";

// ── Telemetry ──
export { useTelemetry, TelemetryContext } from "./telemetry/index.js";
export type { TelemetryEmitter } from "./telemetry/index.js";

// ── Bottom sheet ──
export { useBottomSheetStore, BottomSheetContext, useInsideSheet, BottomSheetHost } from "./bottom-sheet/index.js";

// ── Hooks ──
export {
  useAppStateSession,
  useBottomSheetData,
  useBottomSheetFormSync,
  useFormSubmissionLoading,
  useHydrateParams,
  useKeyboardStatus,
  usePageRefresh,
} from "./hooks/index.js";

// ── Loaders ──
export {
  DefaultPageSkeleton,
  FeedSkeleton,
  StandardWithHeroSkeleton,
  ListRowsSkeleton,
  FormSkeleton,
  WebViewSkeleton,
  ContainerLoader,
  skeletonRegistry,
  resolveLoader,
} from "./loaders/index.js";

// ── Snippets ──
export { renderMedia } from "./snippets/_shared/index.js";
export { FormContext, useFormContext } from "./snippets/Form/index.js";

// ── Registries ──
export {
  uiComponentRegistry,
  snippetRegistry,
  pageContainerRegistry,
  actionHandlerRegistry,
  capabilityHandlerRegistry,
  resolveRenderer,
} from "./registries/index.js";

// ── State stores (selected) ──
// The runtime owns several Zustand stores; most are internal. These two
// are intentionally part of the public surface because consuming apps
// need to set them at boot:
//   - useDevConfigStore: localhost-only X-Dev-Identity header
//   - useActiveSocialStore: production X-Active-Influencer-Id header
export { useDevConfigStore, useActiveSocialStore, useLocalStore } from "./state/index.js";
export type {
  DevConfigState,
  DevConfigActions,
  ActiveSocialState,
  ActiveSocialActions,
  LocalStoreState,
  LocalStoreActions,
} from "./state/index.js";

// ── Icon store (manifest fetch/persist + name→SVG glyph resolution) ──
export {
  IconStoreProvider,
  IconGlyph,
  useIconStore,
  parseSvg,
} from "./icon-store/index.js";
export type {
  IconStoreProviderProps,
  IconGlyphProps,
} from "./icon-store/index.js";

// ── Navigation (runtime-owned native-stack + unified page/sheet back) ──
// See ./navigation/README.md. Uses the react-navigation + screens peer deps.
export {
  SduiNavigationHost,
  SduiSheetScreen,
  navigationRef,
  applyNavigate,
  goBack,
  pushSheet,
  popSheet,
  presentSheet,
  dismissSheet,
  setSheetPresenter,
  SDUI_PAGE_ROUTE,
  SDUI_SHEET_ROUTE,
} from "./navigation/index.js";
export type {
  SduiNavigationHostProps,
  ResolvePage,
  SduiRootParamList,
  SheetPresenter,
  SheetDismisser,
} from "./navigation/index.js";
