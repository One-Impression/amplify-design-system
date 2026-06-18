import React, { useMemo } from "react";
import type { ReactNode } from "react";
import { createActionEngine } from "./action-engine/action-engine.js";
import { ActionEngineContext } from "./action-engine/useActionEngine.js";
import { BffConfigContext } from "./action-engine/useBffConfig.js";
import type { BffConfigValue } from "./action-engine/useBffConfig.js";
import { TelemetryContext } from "./telemetry/useTelemetry.js";
import type { TelemetryEmitter } from "./telemetry/useTelemetry.js";
import type { ActionEngineConfig } from "./action-engine/types.js";
import { setResolveRendererWarnSink } from "./registries/node-registry.js";

interface BffConfig {
  baseUrl: string;
  iconsManifestUrl?: string;
}

interface AuthConfig {
  getToken: () => string | null;
}

interface TelemetryConfig {
  emitter: TelemetryEmitter;
}

interface SduiRuntimeProviderProps {
  bffConfig: BffConfig;
  authConfig: AuthConfig;
  telemetryConfig: TelemetryConfig;
  defaultLoader?: ReactNode;
  onNavigate: (op: string, target: string, params?: Record<string, unknown>) => void;
  onToast: (level: string, message: string) => void;
  onDeeplink: (url: string) => void;
  children: ReactNode;
}

/**
 * Root provider for the SDUI runtime.
 * Wires action engine, telemetry, and BFF config for the entire render tree.
 * Mount once in app/_layout.tsx.
 */
export function SduiRuntimeProvider({
  bffConfig,
  authConfig,
  telemetryConfig,
  onNavigate,
  onToast,
  onDeeplink,
  children,
}: SduiRuntimeProviderProps): React.ReactElement {
  const actionEngine = useMemo(() => {
    const config: ActionEngineConfig = {
      bffBaseUrl: bffConfig.baseUrl,
      authToken: authConfig.getToken,
      onNavigate,
      onToast,
      onDeeplink,
    };
    return createActionEngine(config);
  }, [bffConfig.baseUrl, authConfig.getToken, onNavigate, onToast, onDeeplink]);

  // Mirror the two BFF connection facts a path-direct screen-level document
  // fetch needs (addressable sheet content, reload-by-name refetch) into
  // context — handlers get the config by argument, screens get it here.
  const bffConfigValue = useMemo<BffConfigValue>(
    () => ({ bffBaseUrl: bffConfig.baseUrl, authToken: authConfig.getToken }),
    [bffConfig.baseUrl, authConfig.getToken],
  );

  // Route unknown-type warnings from the renderer registry through the
  // same telemetry emitter as the rest of the runtime. Memoised on the
  // emitter so swapping it (e.g. test rigs) re-wires the sink.
  useMemo(() => {
    setResolveRendererWarnSink((type: string) => {
      telemetryConfig.emitter.emit("sdui.renderer.unknown_type", { type });
    });
  }, [telemetryConfig.emitter]);

  return (
    <TelemetryContext.Provider value={telemetryConfig.emitter}>
      <BffConfigContext.Provider value={bffConfigValue}>
        <ActionEngineContext.Provider value={actionEngine}>
          {children}
        </ActionEngineContext.Provider>
      </BffConfigContext.Provider>
    </TelemetryContext.Provider>
  );
}
