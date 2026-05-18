import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { InfoMediaRowSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { renderMedia } from "../_shared/render-media.js";

export function InfoMediaRowRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={InfoMediaRowSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <Box padding={12}>
          <Stack direction="row" align="center" gap={12}>
            {v.media && renderMedia(v.media)}
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
        </Box>
      )}
    </SduiNode>
  );
}
