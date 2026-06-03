import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { BottomSheetInputSectionSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text, Icon as DSIcon } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function BottomSheetInputSectionRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={BottomSheetInputSectionSchema.shape.data}
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
          <Stack direction="column" gap={4}>
            <Text
              color={v.label.color}
              size={v.label.font_size}
              weight={v.label.font_weight}
            >
              {v.label.text}
            </Text>
            <Stack direction="row" align="center" justify="space-between">
              {v.input_value && (
                <Text
                  color={v.input_value.color}
                  size={v.input_value.font_size}
                  weight={v.input_value.font_weight}
                >
                  {v.input_value.text}
                </Text>
              )}
              {v.right_icon && (
                <DSIcon
                  name={v.right_icon.name}
                  size={v.right_icon.size}
                  color={v.right_icon.color}
                />
              )}
            </Stack>
            {v.sub_text && (
              <Text
                color={v.sub_text.color}
                size={v.sub_text.font_size}
                weight={v.sub_text.font_weight}
              >
                {v.sub_text.text}
              </Text>
            )}
          </Stack>
        </Box>
      )}
    </SduiNode>
  );
}
