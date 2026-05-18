import { createContext, useContext } from "react";

export interface TelemetryEmitter {
  emit(event: string, params?: Record<string, unknown>): void;
}

const noopEmitter: TelemetryEmitter = {
  emit: () => {},
};

export const TelemetryContext = createContext<TelemetryEmitter>(noopEmitter);

export function useTelemetry(): TelemetryEmitter {
  return useContext(TelemetryContext);
}
