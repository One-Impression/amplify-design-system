// Page state
export { usePageStore } from './usePageStore.js';
export type { PageSection, PageStoreState, PageStoreActions } from './usePageStore.js';

// Bottom sheet data (separate from Task 11's useBottomSheetStore stack manager)
export { useBottomSheetDataStore } from './useBottomSheetDataStore.js';
export type {
  BottomSheetDataState,
  BottomSheetDataActions,
} from './useBottomSheetDataStore.js';

// Bottom sheet form
export { useBottomSheetFormStore } from './useBottomSheetFormStore.js';
export type {
  FieldValidationError,
  BottomSheetFormState,
  BottomSheetFormActions,
} from './useBottomSheetFormStore.js';

// Navigation stack
export { useNavigationStackStore } from './useNavigationStackStore.js';
export type {
  NavigationEntry,
  NavigationStackState,
  NavigationStackActions,
} from './useNavigationStackStore.js';

// Search params
export { useSearchParamsStore } from './useSearchParamsStore.js';
export type {
  FilterSelection,
  SearchParamsState,
  SearchParamsActions,
} from './useSearchParamsStore.js';

// Aerobar
export { useAeroBarStore } from './useAeroBarStore.js';
export type {
  AeroBarVariant,
  AeroBarAction,
  AeroBarState,
  AeroBarActions,
} from './useAeroBarStore.js';

// File upload
export { useFileUploadStore } from './useFileUploadStore.js';
export type {
  UploadStatus,
  UploadEntry,
  FileUploadState,
  FileUploadActions,
} from './useFileUploadStore.js';

// Auth
export { useAuthStore } from './useAuthStore.js';
export type { AuthUser, AuthState, AuthActions } from './useAuthStore.js';

// Telemetry (Zustand bridge for action handlers — delegates to TelemetryEmitter)
export { useTelemetryStore } from './useTelemetryStore.js';
export type {
  TelemetryStoreState,
  TelemetryStoreActions,
} from './useTelemetryStore.js';

// Local (ephemeral key-value state for set_local / compound branch conditions)
export { useLocalStore } from './useLocalStore.js';
export type { LocalStoreState, LocalStoreActions } from './useLocalStore.js';

// Tooltip (imperative tooltip display for ui.show_tooltip capability)
export { useTooltipStore } from './useTooltipStore.js';
export type {
  TooltipRequest,
  TooltipStoreState,
  TooltipStoreActions,
} from './useTooltipStore.js';

// Dev config (localhost-only request augmentation, e.g. X-Dev-Identity header)
export { useDevConfigStore } from './useDevConfigStore.js';
export type { DevConfigState, DevConfigActions } from './useDevConfigStore.js';

// Active social context (scopes every BFF read via X-Active-Influencer-Id)
export { useActiveSocialStore } from './useActiveSocialStore.js';
export type {
  ActiveSocialState,
  ActiveSocialActions,
} from './useActiveSocialStore.js';

// Tab-bar optimistic active state (lets the indicator follow user taps
// without waiting for the BFF round-trip).
export { TabBarActiveContext } from './TabBarActiveContext.js';
export type { TabBarActiveContextValue } from './TabBarActiveContext.js';
