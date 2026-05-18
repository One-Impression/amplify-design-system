/**
 * Action engine types — shared by handlers, registries, and the engine itself.
 *
 * Task 11 defines the base interfaces; Task 23 re-exports them here unchanged
 * so that handler files can import from a single location.
 */
import type { Action } from "@one-impression/sdk-native-sdui";

export interface ActionEngineConfig {
  bffBaseUrl: string;
  authToken: () => string | null;
  onNavigate: (
    op: string,
    target: string,
    params?: Record<string, unknown>,
  ) => void;
  onToast: (level: string, message: string) => void;
  onDeeplink: (url: string) => void;
}

export interface ActionEngine {
  dispatch(action: Action): void | Promise<void>;
}

export type ActionHandler = (
  action: Action,
  config: ActionEngineConfig,
  engine: ActionEngine,
) => void | Promise<void>;

export type CapabilityHandler = (
  action: Action,
  config: ActionEngineConfig,
) => Promise<{ success?: unknown; error?: string }>;
