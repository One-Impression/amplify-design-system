import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { SectionHeaderSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function SectionHeaderRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={SectionHeaderSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <Box mb="md">
          <Stack direction="row" align="center" justify="space-between">
            <Stack direction="column" gap={2}>
              <Text
                color={v.title.color}
                size={v.title.font_size ?? "lg"}
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
            {v.right_action && <Interpreter node={v.right_action} />}
          </Stack>
        </Box>
      )}
    </SduiNode>
  );
}
