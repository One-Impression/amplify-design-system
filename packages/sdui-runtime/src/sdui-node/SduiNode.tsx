import React, { useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { z } from "zod";
import type { Action } from "@one-impression/sdk-native-sdui";
import { SduiErrorBoundary } from "./SduiErrorBoundary.js";
import { SduiFallback } from "./SduiFallback.js";
import { Clickable } from "../clickable/Clickable.js";
import { Viewable } from "../viewable/Viewable.js";
import { useActionEngine } from "../action-engine/useActionEngine.js";
import { useTelemetry } from "../telemetry/useTelemetry.js";

interface TrackEvent {
  name: string;
  params?: Record<string, unknown>;
}

interface SduiNodeProps<TSchema extends z.ZodTypeAny> {
  data: unknown;
  schema: TSchema;
  id: string;
  on_click?: Action;
  on_load?: Action;
  on_view?: Action;
  on_dismount?: Action;
  view_events?: TrackEvent[];
  load_events?: TrackEvent[];
  children: (validated: z.infer<TSchema>) => ReactNode;
}

export function SduiNode<TSchema extends z.ZodTypeAny>(
  props: SduiNodeProps<TSchema>,
): React.ReactElement {
  const validated = props.schema.parse(props.data);
  const actionEngine = useActionEngine();
  const telemetry = useTelemetry();

  useEffect(() => {
    telemetry.emit("sdui.node.rendered", { id: props.id });

    if (props.on_load) {
      actionEngine.dispatch(props.on_load);
    }
    if (props.load_events) {
      for (const e of props.load_events) {
        telemetry.emit(e.name, e.params);
      }
    }

    return () => {
      if (props.on_dismount) {
        actionEngine.dispatch(props.on_dismount);
      }
    };
    // Intentionally run only on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewed = useCallback(() => {
    if (props.on_view) {
      actionEngine.dispatch(props.on_view);
    }
    if (props.view_events) {
      for (const e of props.view_events) {
        telemetry.emit(e.name, e.params);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SduiErrorBoundary nodeId={props.id} fallback={<SduiFallback />}>
      <Viewable onView={handleViewed}>
        <Clickable
          onPress={
            props.on_click
              ? () => actionEngine.dispatch(props.on_click!)
              : undefined
          }
        >
          {props.children(validated)}
        </Clickable>
      </Viewable>
    </SduiErrorBoundary>
  );
}
