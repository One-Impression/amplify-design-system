import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { InfoIconRowSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text, Icon as DSIcon, Card as DSCard } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function InfoIconRowRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={InfoIconRowSchema.shape.data}
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
            {v.icon && (
              <DSIcon
                name={v.icon.name}
                size={v.icon.size}
                color={v.icon.color}
              />
            )}
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
              </Stack>
            </Box>
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
