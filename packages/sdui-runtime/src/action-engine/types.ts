import type { Action } from "@one-impression/sdk-native-sdui";

export interface ActionEngineConfig {
  bffBaseUrl: string;
  authToken: () => string | null;
  onNavigate: (op: string, target: string, params?: Record<string, unknown>) => void;
  onToast: (level: string, message: string) => void;
  onDeeplink: (url: string) => void;
}

export interface ActionHandler {
  (action: Action, config: ActionEngineConfig): void | Promise<void>;
}

export interface ActionEngine {
  dispatch(action: Action): void;
}
