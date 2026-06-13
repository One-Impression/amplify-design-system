import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Node } from "@one-impression/sdk-native-sdui";
import { PageFooterSchema } from "@one-impression/sdk-native-sdui";
import { resolveColor } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

const GUTTER = 16;

const styles = StyleSheet.create({
  // Secondary action floats above the bar, on the page background (no surface).
  secondary: {
    paddingHorizontal: GUTTER,
    paddingTop: GUTTER,
    paddingBottom: 12,
  },
  // The pinned bar wraps the primary CTA. The horizontal gutter always
  // applies; vertical padding + shadow apply only when the bar has a visible
  // surface (a transparent footer has no bar, so that padding is dead space).
  bar: {
    paddingHorizontal: GUTTER,
  },
  barSurface: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
});

export function PageFooterRenderer(node: Node): React.ReactElement {
  const insets = useSafeAreaInsets();
  // Surface color is read from the raw node data (the validated `v` below
  // strips unknown fields), defaulting to a neutral contrasting surface.
  const surface =
    resolveColor((node.data as { background?: string })?.background ?? "neutralInverse") ??
    "#FFFFFF";
  // A transparent footer has no visible bar, so its decorative vertical padding
  // and shadow collapse — only the horizontal gutter and safe-area inset remain.
  const hasSurface = surface !== "transparent";

  return (
    <SduiNode
      data={node.data}
      schema={PageFooterSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <View>
          {/* Secondary action floats just above the bar, outside the surface. */}
          {v.secondary_button && (
            <View style={styles.secondary}>
              <Interpreter node={v.secondary_button} />
            </View>
          )}
          {/* Pinned surface bar wrapping the primary CTA. */}
          <View
            style={[
              styles.bar,
              hasSurface && styles.barSurface,
              {
                backgroundColor: surface,
                paddingTop: hasSurface ? GUTTER : 0,
                paddingBottom: (hasSurface ? GUTTER : 0) + insets.bottom,
              },
            ]}
          >
            {v.primary_button && <Interpreter node={v.primary_button} />}
          </View>
        </View>
      )}
    </SduiNode>
  );
}
