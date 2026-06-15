import React, { useEffect, useCallback, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import type { z } from "zod";
import type { Action } from "@one-impression/sdk-native-sdui";
import { SduiErrorBoundary } from "./SduiErrorBoundary.js";
import { SduiFallback } from "./SduiFallback.js";
import { Clickable } from "../clickable/Clickable.js";
import { Viewable } from "../viewable/Viewable.js";
import { useViewportManaged } from "../viewport/index.js";
import { useActionEngine } from "../action-engine/useActionEngine.js";
import { useTelemetry } from "../telemetry/useTelemetry.js";
import { parseNodeData } from "./parseNodeData.js";
import { useShallow } from "zustand/react/shallow";
import { useLocalStore } from "../state/useLocalStore.js";
import { resolveRenderBindings } from "../action-engine/cond/resolve-render-bindings.js";

interface TrackEvent {
  name: string;
  params?: Record<string, unknown>;
}

interface SduiNodeProps<TSchema extends z.ZodTypeAny> {
  data: unknown;
  schema: TSchema;
  id: string;
  /** Optional node type, used for telemetry + the dev-mode fallback label. */
  type?: string;
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
  const actionEngine = useActionEngine();
  const telemetry = useTelemetry();
  // When an ancestor surface (e.g. a feed FlatList) manages viewport detection,
  // it fires the view lifecycle centrally via real visibility — so we must NOT
  // also fire on_view here through the onLayout proxy (which fires on render).
  const viewportManaged = useViewportManaged();

  // Resolve render-time bindings reactively: any `data` field that is a
  // `{ ref: "$.local.*" }` (e.g. a chip's `selected`, a tab's `active`) is read
  // from the local store, so the node reflects local state the instant
  // set_local runs — no reload. Non-binding nodes get back the SAME `data`
  // reference, so this subscription never re-renders them on unrelated writes.
  const boundData = useLocalStore(
    useShallow((s) =>
      resolveRenderBindings(
        props.data as Record<string, unknown> | undefined,
        s.data,
      ),
    ),
  );

  // Parse defensively. A naked `schema.parse(...)` call would throw on
  // malformed or stale wire payloads and crash the entire page. During
  // the SDUI migration window, that's a real risk every time a handler
  // ships before its renderer (or vice versa) — so we fall back to a
  // discreet placeholder and emit telemetry instead.
  const parsed = useMemo(
    () => parseNodeData(props.schema, boundData),
    [props.schema, boundData],
  );

  useEffect(() => {
    if (parsed.ok) {
      telemetry.emit("sdui.node.rendered", { id: props.id, type: props.type });
      if (props.on_load) {
        actionEngine.dispatch(props.on_load);
      }
      if (props.load_events) {
        for (const e of props.load_events) {
          telemetry.emit(e.name, e.params);
        }
      }
    } else {
      telemetry.emit("sdui.node.parse_error", {
        id: props.id,
        type: props.type,
        error: parsed.error.message,
      });
    }

    return () => {
      if (parsed.ok && props.on_dismount) {
        actionEngine.dispatch(props.on_dismount);
      }
    };
    // Intentionally run only on mount/unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // on_view is ONE-SHOT per Node instance — Viewable may fire its callback
  // every time the node re-enters the viewport (e.g. when the user scrolls
  // back up over a feed item), but the wire contract treats on_view as a
  // single impression signal. We gate dispatch + analytics on a ref so the
  // very first viewable signal wins and subsequent triggers are dropped.
  // New Node instances (e.g. items appended via `append_items` pagination)
  // get their own ref, so they fire their own on_view when scrolled to.
  const firedRef = useRef(false);
  const handleViewed = useCallback(() => {
    if (!parsed.ok) return;
    if (firedRef.current) return;
    firedRef.current = true;
    if (props.on_view) {
      actionEngine.dispatch(props.on_view);
    }
    if (props.view_events) {
      for (const e of props.view_events) {
        telemetry.emit(e.name, e.params);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed.ok]);

  if (!parsed.ok) {
    return (
      <SduiFallback
        nodeId={props.id}
        nodeType={props.type}
        error={parsed.error}
      />
    );
  }

  return (
    <SduiErrorBoundary
      nodeId={props.id}
      fallback={<SduiFallback nodeId={props.id} nodeType={props.type} />}
    >
      {viewportManaged ? (
        // Managed surface owns the view lifecycle (real visibility) — render the
        // clickable content directly, no onLayout-based Viewable.
        <Clickable
          onPress={
            props.on_click
              ? () => actionEngine.dispatch(props.on_click!)
              : undefined
          }
        >
          {props.children(parsed.value)}
        </Clickable>
      ) : (
        <Viewable onView={handleViewed}>
          <Clickable
            onPress={
              props.on_click
                ? () => actionEngine.dispatch(props.on_click!)
                : undefined
            }
          >
            {props.children(parsed.value)}
          </Clickable>
        </Viewable>
      )}
    </SduiErrorBoundary>
  );
}
