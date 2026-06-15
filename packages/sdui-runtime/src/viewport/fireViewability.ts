import type { Action, Node } from "@one-impression/sdk-native-sdui";

interface ViewTrigger {
  action: Action;
  policy?: "once" | "every";
  id?: string;
}

interface ViewabilityBlock {
  on_view?: ViewTrigger[];
  on_exit?: ViewTrigger[];
}

interface TrackEvent {
  name: string;
  params?: Record<string, unknown>;
}

export interface FireViewabilityDeps {
  /** Fire-once memory across re-entries, keyed `${nodeId}::${phase}::${triggerKey}`. */
  fired: Set<string>;
  dispatch: (action: Action) => void;
  emit: (name: string, params?: Record<string, unknown>) => void;
}

/**
 * Fire a node's viewport triggers for a phase, honoring per-trigger policy.
 *
 * Phase `view` runs: the scalar `on_view` sugar (once) + every `viewability.on_view`
 * trigger (per its policy) + `view_events` telemetry (once). Phase `exit` runs the
 * `viewability.on_exit` triggers (per policy). `once` triggers dedup against
 * `fired` (so they don't re-run when the node re-enters); `every` always fires.
 *
 * Called by a surface that owns real viewport detection (see PageFeed) — NOT by
 * SduiNode's onLayout proxy, which fires on render rather than on visibility.
 */
export function fireViewability(
  node: Node,
  phase: "view" | "exit",
  deps: FireViewabilityDeps,
): void {
  const nodeId = node.id ?? "";
  const v = (node as { viewability?: ViewabilityBlock }).viewability;

  const triggers: ViewTrigger[] = [];
  if (phase === "view") {
    // Scalar `on_view` is sugar for a single once-trigger.
    if (node.on_view) triggers.push({ action: node.on_view, policy: "once", id: "__scalar" });
    if (v?.on_view) triggers.push(...v.on_view);
  } else if (v?.on_exit) {
    triggers.push(...v.on_exit);
  }

  triggers.forEach((t, i) => {
    if ((t.policy ?? "once") === "once") {
      const key = `${nodeId}::${phase}::${t.id ?? i}`;
      if (deps.fired.has(key)) return;
      deps.fired.add(key);
    }
    deps.dispatch(t.action);
  });

  // Impression telemetry — one-shot per node, on first view.
  if (phase === "view") {
    const events = (node as { view_events?: TrackEvent[] }).view_events;
    if (events && events.length) {
      const key = `${nodeId}::__view_events`;
      if (!deps.fired.has(key)) {
        deps.fired.add(key);
        for (const e of events) deps.emit(e.name, e.params);
      }
    }
  }
}
