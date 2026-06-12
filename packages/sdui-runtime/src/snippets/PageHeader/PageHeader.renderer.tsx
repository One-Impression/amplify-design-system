import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { PageHeaderSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text, Icon as DSIcon } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function PageHeaderRenderer(node: Node): React.ReactElement {
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
        <Box>
          <Stack direction="row" align="center" justify="space-between">
            <Stack direction="row" align="center" gap={8}>
              {v.left_icon && (
                <DSIcon
                  name={v.left_icon.name}
                  size={v.left_icon.size}
                  color={v.left_icon.color}
                />
              )}
              {v.icon && (
                <DSIcon
                  name={v.icon.name}
                  size={v.icon.size}
                  color={v.icon.color}
                />
              )}
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
            </Stack>
            <Stack direction="row" align="center" gap={8}>
              {v.right_icon && (
                <DSIcon
                  name={v.right_icon.name}
                  size={v.right_icon.size}
                  color={v.right_icon.color}
                />
              )}
              {v.right_button && <Interpreter node={v.right_button} />}
            </Stack>
          </Stack>
        </Box>
      )}
    </SduiNode>
  );
}
