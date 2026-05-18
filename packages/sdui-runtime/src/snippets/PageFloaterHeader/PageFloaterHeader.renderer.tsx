import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { PageFloaterHeaderSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text, Icon as DSIcon } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function PageFloaterHeaderRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={PageFloaterHeaderSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <Box padding={16}>
          <Stack direction="row" align="center" gap={8}>
            {v.icon && (
              <DSIcon
                name={v.icon.name}
                size={v.icon.size}
                color={v.icon.color}
              />
            )}
            {v.title && (
              <Text
                color={v.title.color}
                size={v.title.font_size}
                weight={v.title.font_weight}
              >
                {v.title.text}
              </Text>
            )}
          </Stack>
        </Box>
      )}
    </SduiNode>
  );
}
