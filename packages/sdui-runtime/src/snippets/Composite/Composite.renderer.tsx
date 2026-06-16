import React, { useState } from "react";
import { View, StyleSheet, type LayoutChangeEvent } from "react-native";
import type { Node } from "@one-impression/sdk-native-sdui";
import { CompositeSchema } from "@one-impression/sdk-native-sdui";
import { Box, Card as DSCard } from "@one-impression/ui-native";
import { sdui } from "@one-impression/tokens-creator/react-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

/**
 * composite — ONE composing snippet. `data.layout` is a discriminant naming a
 * slot-set + placement; the slots hold arbitrary child Nodes the BFF chooses.
 * The composite owns ARRANGEMENT (gutter, full-bleed, overlap, gaps) — never
 * CONTENTS. New arrangements are new `layout` values, never new snippet types.
 *
 * Validated against the typed discriminated-union `CompositeSchema.shape.data`
 * from `@one-impression/sdk-native-sdui`; SduiNode handles the
 * clickable / viewable / trigger wiring.
 *
 * Implemented layouts:
 *   - "cover"        media (full-bleed) + overlay chips + float (edge-overlap)
 *                    + body (gutter-inset rows) + footer (full-width strip)
 *   - "stack"/"row"  generic linear arrangement (supersedes group_config)
 */

// Internal rhythm — owned by the composite, sourced from tokens (same discipline
// as the page gutter). Not declared per-instance on the wire.
const GUTTER = sdui.spacing.md; // horizontal inset for body / banner (12)
const PART_GAP = sdui.spacing.sm; // vertical gap between stacked parts (8)
// The float (e.g. a brand logo) straddles the media's bottom edge. 0.5 = its
// center sits on the edge (half over the cover, half over the body) — the
// balanced convention. Raising it past 0.5 starts covering the cover content.
const FLOAT_OVERLAP_RATIO = 0.5;
// Pre-measure fallback (≈ half a typical 72px logo + the content gap), used for
// the first paint before onLayout reports the real height.
const FLOAT_OVERLAP_FALLBACK = 44;

interface Surface {
  bg_color?: string;
  border_color?: string;
  radius?: string | number;
  elevation?: string;
}

/**
 * Optional styled, corner-clipping container. A composite MAY have a surface —
 * it is NOT "a card". Uses the Card primitive's two-layer clip (outer shadow /
 * inner overflow:hidden) with `padding:0` so a full-bleed media slot and a
 * full-width banner sit flush and clip to the rounded corners.
 */
function Surfaced({
  surface,
  children,
}: {
  surface?: Surface;
  children: React.ReactNode;
}): React.ReactElement {
  if (!surface) return <>{children}</>;
  return (
    <DSCard
      bg={surface.bg_color}
      borderColor={surface.border_color}
      rounded={surface.radius as never}
      elevation={(surface.elevation ?? "none") as never}
      padding={0 as never}
    >
      {children}
    </DSCard>
  );
}

function CoverLayout({ v }: { v: Record<string, unknown> }): React.ReactElement {
  const header = v.header as Node | undefined; // full-width strip ABOVE the media
  const headerBg = v.header_bg as string | undefined;
  const media = v.media as Node | undefined;
  const overlay = (v.overlay as Node[] | undefined) ?? [];
  const overlayAnchorEnd = v.overlay_anchor === "end"; // pin overlay chips to the right
  const float = v.float as Node | undefined; // straddle-row START element (e.g. logo)
  const floatAnchorEnd = v.float_anchor === "end";
  const floatEndNodes = (v.float_end as Node[] | undefined) ?? []; // straddle-row END group (e.g. status tags)
  const hasStraddle = !!float || floatEndNodes.length > 0;
  const body = (v.body as Node[] | undefined) ?? [];
  const footer = v.footer as Node | undefined; // full-width strip BELOW the body
  const footerBg = (v.footer_bg as string | undefined) ?? "sdui.color.primary-weak";

  // Measure the float so it overlaps the media edge by a true fraction of its
  // own height (proportional, not a brittle fixed pixel pull). +PART_GAP cancels
  // the content area's top padding so the ratio is measured from the media edge.
  const [floatH, setFloatH] = useState(0);
  const onFloatLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h && h !== floatH) setFloatH(h);
  };
  const floatMarginTop =
    floatH > 0 ? -(floatH * FLOAT_OVERLAP_RATIO) - PART_GAP : -FLOAT_OVERLAP_FALLBACK;

  return (
    <Surfaced surface={v.surface as Surface | undefined}>
      {/* Header strip — full-width, above the media (e.g. a status / notice
          ribbon). Symmetric with the footer strip. */}
      {header ? (
        <Box bg={headerBg} px={GUTTER} py={PART_GAP}>
          <Interpreter node={header} />
        </Box>
      ) : null}

      {/* Media area — full-bleed, clipped by the surface. Overlay chips sit
          on top, pinned to the top corners. */}
      {media ? (
        <View>
          <Interpreter node={media} />
          {overlay.length > 0 ? (
            <View
              style={[
                styles.overlay,
                { justifyContent: overlayAnchorEnd ? "flex-end" : "flex-start" },
              ]}
              pointerEvents="box-none"
            >
              {overlay.map((n, i) => (
                <Interpreter key={n.id ?? i} node={n} />
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Content area sits below the media. The straddle row pokes UP into the
          media's bottom edge via a negative top margin; body rows flow below it. */}
      {hasStraddle || body.length > 0 ? (
        <View style={styles.content}>
          {hasStraddle ? (
            // One row straddling the media edge: START element (logo) + END group
            // (tags). `alignItems: center` puts EVERY child's center on the row's
            // axis, and the row's center is pulled onto the media edge — so a tall
            // logo and short tags each overlap the cover by 50% of their own height.
            <View
              onLayout={onFloatLayout}
              style={[
                styles.floatRow,
                {
                  marginTop: floatMarginTop,
                  justifyContent:
                    float && floatEndNodes.length
                      ? "space-between"
                      : floatAnchorEnd || (!float && floatEndNodes.length)
                        ? "flex-end"
                        : "flex-start",
                },
              ]}
            >
              {float ? <Interpreter node={float} /> : null}
              {floatEndNodes.length ? (
                <View style={styles.floatEndGroup}>
                  {floatEndNodes.map((n, i) => (
                    <Interpreter key={n.id ?? i} node={n} />
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
          {body.map((n, i) => (
            <View key={n.id ?? i} style={i > 0 ? styles.bodyGap : undefined}>
              <Interpreter node={n} />
            </View>
          ))}
        </View>
      ) : null}

      {/* Footer strip — full-width, below the body. Symmetric with the header. */}
      {footer ? (
        <Box bg={footerBg} px={GUTTER} py={PART_GAP}>
          <Interpreter node={footer} />
        </Box>
      ) : null}
    </Surfaced>
  );
}

const ALIGN: Record<string, "flex-start" | "center" | "flex-end" | "stretch"> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};
const JUSTIFY: Record<
  string,
  "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"
> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

function LinearLayout({
  v,
  horizontal,
}: {
  v: Record<string, unknown>;
  horizontal: boolean;
}): React.ReactElement {
  const children = (v.children as Node[] | undefined) ?? [];
  const equal = v.item_flex === "equal";
  const content = (
    <Box
      direction={horizontal ? "row" : "column"}
      gap={(v.gap as never) ?? "sm"}
      align={v.align ? ALIGN[v.align as string] : undefined}
      justify={v.justify ? JUSTIFY[v.justify as string] : undefined}
    >
      {children.map((n, i) =>
        equal ? (
          <Box key={n.id ?? i} flex={1}>
            <Interpreter node={n} />
          </Box>
        ) : (
          <Interpreter key={n.id ?? i} node={n} />
        ),
      )}
    </Box>
  );
  return <Surfaced surface={v.surface as Surface | undefined}>{content}</Surfaced>;
}

export function CompositeRenderer(node: Node): React.ReactElement | null {
  const layout = (node.data as { layout?: string } | undefined)?.layout;
  return (
    <SduiNode
      data={node.data}
      schema={CompositeSchema.shape.data}
      id={node.id}
      type={node.type}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(validated) => {
        // The slot components read fields defensively off a loose record; the
        // discriminated union is already validated by SduiNode above.
        const v = validated as Record<string, unknown>;
        switch (layout) {
          case "cover":
            return <CoverLayout v={v} />;
          case "row":
            return <LinearLayout v={v} horizontal />;
          case "stack":
            return <LinearLayout v={v} horizontal={false} />;
          default:
            return null;
        }
      }}
    </SduiNode>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: GUTTER,
    left: GUTTER,
    right: GUTTER,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: PART_GAP,
  },
  content: {
    paddingHorizontal: GUTTER,
    paddingTop: PART_GAP,
    paddingBottom: PART_GAP,
  },
  floatRow: {
    flexDirection: "row",
    // Center-align so a tall logo and short tags share one axis (the media edge).
    alignItems: "center",
    // marginTop is applied dynamically (proportional to the measured row height)
    // so the overlap is a true fraction of the row, not a fixed pull.
    marginBottom: PART_GAP,
  },
  floatEndGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flexShrink: 1,
    gap: PART_GAP,
  },
  bodyGap: {
    marginTop: PART_GAP,
  },
});
