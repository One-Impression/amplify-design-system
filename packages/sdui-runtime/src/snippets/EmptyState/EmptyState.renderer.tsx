import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { EmptyStateSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text, Icon as DSIcon, Image as DSImage } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function EmptyStateRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={EmptyStateSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <Box padding={24} alignItems="center">
          <Stack direction="column" align="center" gap={12}>
            {v.icon && (
              <DSIcon
                name={v.icon.name}
                size={v.icon.size ?? 48}
                color={v.icon.color}
              />
            )}
            {v.image && (
              <DSImage
                source={{ uri: v.image.src }}
                resizeMode={v.image.resize_mode ?? "contain"}
                width={120}
                height={120}
              />
            )}
            {v.title && (
              <Text
                color={v.title.color}
                size={v.title.font_size}
                weight={v.title.font_weight}
                align="center"
              >
                {v.title.text}
              </Text>
            )}
            {v.subtitle && (
              <Text
                color={v.subtitle.color}
                size={v.subtitle.font_size}
                weight={v.subtitle.font_weight}
                align="center"
              >
                {v.subtitle.text}
              </Text>
            )}
            {v.action && <Interpreter node={v.action} />}
          </Stack>
        </Box>
      )}
    </SduiNode>
  );
}
