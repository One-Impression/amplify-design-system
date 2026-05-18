import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { InfoRowSchema } from "@one-impression/sdk-native-sdui";
import {
  Box,
  Stack,
  Text,
  Icon as DSIcon,
  Card as DSCard,
  Tag as DSTag,
  ProgressIndicator as DSProgressIndicator,
} from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
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
              {v.status_tag && (
                <DSTag
                  label={v.status_tag.label}
                  variant={v.status_tag.variant}
                  color={v.status_tag.color}
                />
              )}
              {v.badge && (
                <Box
                  bg={v.badge.bg_color}
                  rounded={v.badge.border_radius ?? 12}
                  paddingHorizontal={8}
                  paddingVertical={2}
                >
                  <Text
                    color={v.badge.color}
                    size={v.badge.font_size ?? 12}
                  >
                    {v.badge.text}
                  </Text>
                </Box>
              )}
              {v.right_media && renderMedia(v.right_media)}
              {v.right_icon && (
                <DSIcon
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

        return <Box padding={12}>{content}</Box>;
      }}
    </SduiNode>
  );
}
