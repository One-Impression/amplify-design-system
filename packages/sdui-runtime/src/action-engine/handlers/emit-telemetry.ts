import { EmitTelemetryPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * emit_telemetry — emits one or more tracking events via the telemetry service.
 */
export async function handleEmitTelemetry(
  action: Action,
  _config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = EmitTelemetryPayloadSchema.parse(action.payload);

  const { useTelemetryStore } = await import("../../state/useTelemetryStore.js");
  const telemetry = useTelemetryStore.getState();

  for (const event of payload.events) {
    telemetry.track(event.name, event.params, event.platforms);
  }
}
