import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { GroupConfigSchema } from "@one-impression/sdk-native-sdui";
import { Box, Card as DSCard } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";
import { GroupGutterItem } from "../../layout/page-gutter.js";

/** Friendly wire alignment values → RN flex values. */
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

/**
 * group_config — recursive layout group. `stacking` sets the axis; the extra
 * config below is read raw (wire extension, not yet in the schema):
 *   - `gap`       spacing token ("sm"/"md"/…) or number between items. VERTICAL
 *                 groups inherit the page's per-item vertical rhythm by default
 *                 (so a plain group spaces like inlined page items); `gap` here
 *                 re-spaces every child group-wide, and a child node's own `gap`
 *                 overrides it per-child. HORIZONTAL groups use this as a uniform
 *                 between-child gap (default `sm`).
 *   - `align`     cross-axis: start | center | end | stretch
 *   - `justify`   main-axis: start | center | end | between | around | evenly
 *   - `item_flex` "equal" → each item flexes to fill the axis evenly
 *                 (so horizontal cards split the width instead of hugging left)
 *   - `card`      wrap the WHOLE group in one card (children stay plain) — same
 *                 shape as info_row's card: { bg_color?, border_color?, elevation? }
 */
export function GroupConfigRenderer(node: Node): React.ReactElement {
  const cfg = node.data as
    | {
        gap?: string | number;
        align?: string;
        justify?: string;
        item_flex?: string;
        card?: { bg_color?: string; border_color?: string; elevation?: string };
      }
    | undefined;

  return (
    <SduiNode
      data={node.data}
      schema={GroupConfigSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => {
        const horizontal = v.stacking === "horizontal";
        const equal = cfg?.item_flex === "equal";
        const items = v.items ?? [];
        const content = (
          <Box
            direction={horizontal ? "row" : "column"}
            // Horizontal groups use the Box's uniform gap (vertical margin is
            // meaningless on a row). Vertical groups inherit the page's per-item
            // rhythm via GroupGutterItem instead — so spacing is overridable
            // per-child and a plain group stays spacing-transparent.
            gap={horizontal ? (cfg?.gap ?? "sm") : undefined}
            align={cfg?.align ? ALIGN[cfg.align] : undefined}
            justify={cfg?.justify ? JUSTIFY[cfg.justify] : undefined}
          >
            {items.map((item: Node, i: number) => {
              const key = item.id || i;
              const inner = equal ? (
                <Box flex={1}>
                  <Interpreter node={item} />
                </Box>
              ) : (
                <Interpreter node={item} />
              );
              return horizontal ? (
                <React.Fragment key={key}>{inner}</React.Fragment>
              ) : (
                <GroupGutterItem
                  key={key}
                  node={item}
                  index={i}
                  count={items.length}
                  groupGap={cfg?.gap}
                >
                  {inner}
                </GroupGutterItem>
              );
            })}
          </Box>
        );
        // One card around the whole group (children stay plain).
        return cfg?.card ? (
          <DSCard
            bg={cfg.card.bg_color}
            borderColor={cfg.card.border_color}
            elevation={cfg.card.elevation as never}
          >
            {content}
          </DSCard>
        ) : (
          content
        );
      }}
    </SduiNode>
  );
}
