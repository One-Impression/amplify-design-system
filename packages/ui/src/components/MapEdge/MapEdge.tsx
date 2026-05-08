import React from 'react';
import { cn } from '../../lib/cn';

/**
 * MapEdge — variant-graph edge primitive for Studio v2 Map mode.
 *
 * Renders a single SVG `<path>` (only) connecting two map points. The consumer
 * is responsible for wrapping it in their own `<svg>` layer that sits beneath
 * the `MapNode` siblings — this keeps geometry math centralised in one place
 * while leaving the consumer free to choose the SVG viewport, transforms, and
 * z-ordering of the layer.
 *
 * The shape is a smooth horizontal cubic Bézier so two horizontally-separated
 * nodes connect with a left-to-right S-curve that hugs the top/bottom of the
 * canvas without crossing other nodes. For vertically-separated points the
 * curve flattens automatically (control points scale with horizontal delta).
 *
 * Visual behaviour:
 *  - `dashed` (default `true`) renders a 6 / 4 dash pattern.
 *  - `active` highlights the edge with the accent border colour and a thicker
 *    stroke; otherwise the edge sits in the subtle border colour.
 *
 * NB: This component renders an SVG element node (`<path>`). It MUST be a
 * descendant of an `<svg>` element provided by the consumer — wrapping it in
 * any HTML element (e.g. `<div>`) will produce invalid markup.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MapEdgeProps {
  /** Source point X (in the parent SVG's user-space coordinates). */
  fromX: number;
  /** Source point Y. */
  fromY: number;
  /** Target point X. */
  toX: number;
  /** Target point Y. */
  toY: number;
  /** Highlight as the active / focused edge. */
  active?: boolean;
  /** Render with a dashed stroke. Default `true`. */
  dashed?: boolean;
  /** Optional class for the path element. */
  className?: string;
}

// ─── Path math ───────────────────────────────────────────────────────────────

/**
 * Build a smooth cubic Bézier path between two points. Control points are
 * placed along the horizontal axis so the curve hugs the source/target Y as
 * the X delta increases. Exposed for tests so we can assert geometry without
 * depending on rendered DOM.
 */
export function buildEdgePath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): string {
  // Place both control points on the horizontal midpoint between source and
  // target. This makes the curve hug each endpoint's Y for half the run, then
  // sweep across — symmetric for both left-to-right and right-to-left edges.
  const midX = (fromX + toX) / 2;
  const c1x = midX;
  const c1y = fromY;
  const c2x = midX;
  const c2y = toY;
  return `M ${fromX} ${fromY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${toX} ${toY}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const MapEdge = React.forwardRef<SVGPathElement, MapEdgeProps>(
  ({ fromX, fromY, toX, toY, active = false, dashed = true, className }, ref) => {
    const d = buildEdgePath(fromX, fromY, toX, toY);
    return (
      <path
        ref={ref}
        d={d}
        fill="none"
        // Stroke colour comes from token-driven CSS variables — dynamic so the
        // consumer's surrounding theme cascades through. Active edges use the
        // accent border colour; idle edges use the subtle border colour.
        stroke={
          active
            ? 'var(--amp-semantic-border-accent)'
            : 'var(--amp-semantic-border-subtle)'
        }
        strokeWidth={active ? 1.75 : 1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? '6 4' : undefined}
        data-active={active}
        data-dashed={dashed}
        className={cn(
          'transition-[stroke,stroke-width] duration-150',
          className,
        )}
      />
    );
  },
);

MapEdge.displayName = 'MapEdge';
