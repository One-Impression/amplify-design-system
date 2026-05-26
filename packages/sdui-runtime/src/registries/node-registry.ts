import type { ComponentType } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { uiComponentRegistry } from "./ui-components.js";
import { snippetRegistry } from "./snippets.js";

/**
 * Tracks unknown node types we've already warned about so a single
 * recurring bad node in a feed doesn't spam telemetry every frame.
 *
 * Exported for tests only — production callers should treat this as
 * an implementation detail.
 */
export const _unknownTypesWarned = new Set<string>();

/**
 * Optional sink for unknown-type warnings. The Interpreter wires this
 * to `useTelemetry().emit` at startup; tests can swap it for a spy.
 * Default is a noop so resolution stays a pure lookup with no side
 * effects when telemetry isn't configured.
 */
let warnSink: (type: string) => void = () => {};

/**
 * Register the warning sink. Idempotent — last writer wins. Called by
 * the SduiRuntimeProvider so the warning is routed through the same
 * telemetry hook as the rest of the runtime.
 */
export function setResolveRendererWarnSink(
  sink: (type: string) => void,
): void {
  warnSink = sink;
}

/**
 * Reset the warned-set + sink — test helper, not part of the public
 * runtime surface.
 */
export function _resetResolveRendererState(): void {
  _unknownTypesWarned.clear();
  warnSink = () => {};
}

/**
 * Composed registry the Interpreter consults.
 *
 * Resolves a wire `type` string to the correct renderer. Returns
 * `null` (not `undefined`, not a throw) when the type is unknown so
 * the page degrades gracefully — one bad node should never crash the
 * whole tree. The first time an unknown type is seen, a warning is
 * routed through the registered sink (see {@link setResolveRendererWarnSink}).
 * Subsequent occurrences of the same type are silenced to avoid
 * flooding telemetry.
 *
 * This is the sibling pattern to `SduiNode`'s defensive `ZodError`
 * handling: surface the problem, keep the page alive.
 */
export function resolveRenderer(
  type: string,
): ComponentType<Node> | null {
  let renderer: ComponentType<Node> | undefined;

  if (type.startsWith("creator.ui_component.")) {
    renderer = uiComponentRegistry[type];
  } else if (type.startsWith("creator.snippet.")) {
    renderer = snippetRegistry[type];
  }

  if (renderer) {
    return renderer;
  }

  if (!_unknownTypesWarned.has(type)) {
    _unknownTypesWarned.add(type);
    warnSink(type);
  }

  return null;
}
