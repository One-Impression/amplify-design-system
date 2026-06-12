import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { InfoRowSchema } from "@one-impression/sdk-native-sdui";
import {
  Box,
  Stack,
  Text,
  Card as DSCard,
  Tag as DSTag,
  ProgressIndicator as DSProgressIndicator,
} from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { IconGlyph } from "../../icon-store/IconGlyph.js";
import { renderMedia } from "../_shared/render-media.js";

export function InfoRowRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={InfoRowSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => {
        const content = (
          <Stack direction="row" align="center" gap={12}>
            {v.left_media && renderMedia(v.left_media)}
            <Box flex={1}>
              <Stack direction="column" gap={2}>
                <Text
                  color={v.title.color}
                  size={v.title.font_size}
                  weight={v.title.font_weight}
                >
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
                {v.progress && (
                  <DSProgressIndicator
                    value={v.progress.value}
                    trackColor={v.progress.track_color}
                    fillColor={v.progress.fill_color}
                    height={v.progress.height}
                  />
                )}
              </Stack>
            </Box>
            <Stack direction="row" align="center" gap={8}>
              {v.tag && <DSTag label={v.tag.label.text} />}
              {v.badge &&
                (v.badge.dot ? (
                  // count/dot indicator (BadgeSchema = { count, dot, color }) —
                  // a labelled pill is a `tag`, not a badge.
                  <Box bg={v.badge.color ?? "#E5484D"} rounded={5} width={10} height={10} />
                ) : v.badge.count != null ? (
                  <Box
                    bg={v.badge.color ?? "#E5484D"}
                    rounded={999}
                    paddingHorizontal={6}
                    paddingVertical={2}
                  >
                    <Text color="#FFFFFF" size={12}>
                      {String(v.badge.count)}
                    </Text>
                  </Box>
                ) : null)}
              {v.right_media && renderMedia(v.right_media)}
              {v.right_icon && (
                <IconGlyph
                  name={v.right_icon.name}
                  size={v.right_icon.size}
                  color={v.right_icon.color}
                />
              )}
            </Stack>
          </Stack>
        );

        if (v.card) {
          return (
            <DSCard bg={v.card.bg_color} borderColor={v.card.border_color}>
              {content}
            </DSCard>
          );
        }

        return <Box>{content}</Box>;
      }}
    </SduiNode>
  );
}
