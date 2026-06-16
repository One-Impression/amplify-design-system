import React, { useMemo } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Node } from "@one-impression/sdk-native-sdui";
import { PageHeaderSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text, Icon as DSIcon } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";
import { Gradient } from "../../gradient/index.js";
import { goBack } from "../../navigation/navigationRef.js";
import { useIconStore } from "../../icon-store/index.js";
import { parseSvg } from "../../icon-store/parseSvg.js";

interface HeaderIconProps {
  name: string;
  color?: string;
  size?: string | number;
}

/**
 * Resolves a named glyph from the icon store and renders it inside the sized
 * `DSIcon` box. The ui-native `Icon` is only a sized/colored container — the
 * actual SVG must be supplied as children, so a bare `<DSIcon name=.../>`
 * renders an empty box. Same pattern as the `IconRenderer` ui_component.
 */
function HeaderIcon({ name, color, size }: HeaderIconProps): React.ReactElement {
  const { getIcon } = useIconStore();
  const SvgIcon = useMemo(() => parseSvg(name, getIcon(name)), [name, getIcon]);
  return (
    <DSIcon name={name} color={color} size={size}>
      <SvgIcon />
    </DSIcon>
  );
}

/**
 * page_header — the top header SLOT snippet (sibling to the footer slot). Owns
 * its own background (solid color or gradient) and clears the status bar via the
 * top safe-area inset, so it can REPLACE the native nav header. `left_icon`, if
 * present, is the back affordance (taps → navigation goBack).
 *
 * `background` is a wire extension read raw (not yet in the schema):
 *   - a color string → solid background
 *   - `{ gradient: { colors, angle? } }` → gradient background (fills the bar,
 *     including under the status bar)
 */
export function PageHeaderRenderer(node: Node): React.ReactElement {
  const insets = useSafeAreaInsets();
  const cfg = node.data as
    | { background?: string | { gradient?: { colors: string[]; angle?: number } } }
    | undefined;
  const gradient =
    cfg?.background && typeof cfg.background === "object"
      ? cfg.background.gradient
      : undefined;
  const solidBg = typeof cfg?.background === "string" ? cfg.background : undefined;

  return (
    <SduiNode
      data={node.data}
      schema={PageHeaderSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <View
          style={[
            styles.header,
            { paddingTop: insets.top },
            solidBg ? { backgroundColor: solidBg } : null,
          ]}
        >
          {gradient ? (
            <Gradient item={{ colors: gradient.colors, angle: gradient.angle ?? 90 }} />
          ) : null}
          <Box px={16} py={12}>
            <Stack direction="row" align="center" justify="space-between">
              <Stack direction="row" align="center" gap={8}>
                {v.left_icon && (
                  <Pressable onPress={goBack} hitSlop={8}>
                    <HeaderIcon
                      name={v.left_icon.name}
                      size={v.left_icon.size}
                      color={v.left_icon.color}
                    />
                  </Pressable>
                )}
                {v.icon && (
                  <HeaderIcon name={v.icon.name} size={v.icon.size} color={v.icon.color} />
                )}
                <Stack direction="column" gap={2}>
                  <Text color={v.title.color} size={v.title.font_size} weight={v.title.font_weight}>
                    {v.title.text}
                  </Text>
                  {v.subtitle && (
                    <Text
                      color={v.subtitle.color}
                      size={v.subtitle.font_size}
                      weight={v.subtitle.font_weight}
                    >
                      {v.subtitle.text}
                    </Text>
                  )}
                </Stack>
              </Stack>
              <Stack direction="row" align="center" gap={8}>
                {v.right_icon && (
                  <HeaderIcon
                    name={v.right_icon.name}
                    size={v.right_icon.size}
                    color={v.right_icon.color}
                  />
                )}
                {v.right_button && <Interpreter node={v.right_button} />}
              </Stack>
            </Stack>
          </Box>
          {v.sub_row && v.sub_row.length > 0 ? (
            <View style={styles.subRow}>
              {v.sub_row.map((n: Node, i: number) => (
                <Interpreter key={n.id || i} node={n} />
              ))}
            </View>
          ) : null}
        </View>
      )}
    </SduiNode>
  );
}

const styles = StyleSheet.create({
  // Soft bottom-edge elevation so the header lifts off the content below it
  // (the symmetric counterpart to TabsFooter's top-edge shadow). Intrinsic to
  // the snippet — no wire flag needed.
  header: {
    backgroundColor: "transparent",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  subRow: {
    paddingBottom: 8,
  },
});
