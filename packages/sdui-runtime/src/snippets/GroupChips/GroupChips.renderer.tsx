import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { resolveSpacing } from "@one-impression/ui-native";
import type { Node } from "@one-impression/sdk-native-sdui";
import { GroupChipsSchema } from "@one-impression/sdk-native-sdui";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";
import { PAGE_GUTTER_TOKEN } from "../../layout/page-gutter.js";

// A full-bleed scroll row opts out of the page's GutterItem, so it must supply
// its own leading/trailing inset — but at the SAME value the page gutter uses,
// so the first chip aligns with every other (gutter-wrapped) snippet. Source it
// from the shared page-gutter token rather than a standalone number.
const PAGE_GUTTER_PX = resolveSpacing(PAGE_GUTTER_TOKEN) ?? 12;

export function GroupChipsRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={GroupChipsSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => {
        const chips = v.items?.map((item: Node, i: number) => (
          <Interpreter key={item.id || i} node={item} />
        ));
        // No horizontal padding here — the caller's layout (the feed content
        // gutter, an enclosing section, etc.) owns horizontal inset. Adding it
        // here double-pads the chip row.
        if (v.layout === "scroll") {
          // A single row that scrolls horizontally. A horizontal ScrollView's
          // height is content-driven (it does NOT collapse the way a vertical
          // `flex: 1` ScrollView did in a no-height column), so chips stay
          // visible.
          return (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollRow}
            >
              {chips}
            </ScrollView>
          );
        }
        return <View style={styles.wrapRow}>{chips}</View>;
      }}
    </SduiNode>
  );
}

const styles = StyleSheet.create({
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 8,
  },
  scrollRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 8,
    // Leading/trailing inset so the first/last chip don't sit flush against the
    // screen edge. A horizontal scroll row is typically caller-gutter-less (it
    // scrolls edge-to-edge), so the inset lives on the scroll content itself —
    // at the page gutter value so it aligns with gutter-wrapped snippets.
    paddingHorizontal: PAGE_GUTTER_PX,
  },
});
