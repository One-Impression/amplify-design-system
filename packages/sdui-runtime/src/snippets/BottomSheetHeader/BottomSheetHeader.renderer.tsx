import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { BottomSheetHeaderSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text, Icon as DSIcon } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function BottomSheetHeaderRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={BottomSheetHeaderSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <Box padding={16} borderBottomWidth={1} borderColor="#E0E0E0">
          <Stack direction="row" align="center" justify="space-between">
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
            {v.icon && (
              <DSIcon
                name={v.icon.name}
                size={v.icon.size}
                color={v.icon.color}
              />
            )}
          </Stack>
        </Box>
      )}
    </SduiNode>
  );
}
