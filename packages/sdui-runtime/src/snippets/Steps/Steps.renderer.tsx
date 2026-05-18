import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { StepsSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function StepsRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={StepsSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <Stack direction="row" gap={4} align="center">
          {Array.from({ length: v.total }, (_, i) => (
            <Box key={i} flex={1}>
              <Box
                height={4}
                rounded={2}
                bg={i < v.current ? "#6531FF" : "#E0E0E0"}
              />
              {v.labels?.[i] && (
                <Text
                  color={v.labels[i].color}
                  size={v.labels[i].font_size ?? 10}
                  weight={v.labels[i].font_weight}
                >
                  {v.labels[i].text}
                </Text>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </SduiNode>
  );
}
