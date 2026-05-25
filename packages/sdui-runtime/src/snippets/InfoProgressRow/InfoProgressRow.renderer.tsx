import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { InfoProgressRowSchema } from "@one-impression/sdk-native-sdui";
import {
  Box,
  Stack,
  Text,
  ProgressIndicator as DSProgressIndicator,
} from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function InfoProgressRowRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={InfoProgressRowSchema.shape.data}
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
          <Stack direction="column" gap={4}>
            <Stack direction="row" align="center" justify="space-between">
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
            <DSProgressIndicator
              value={v.progress.value}
              trackColor={v.progress.track_color}
              fillColor={v.progress.fill_color}
              height={v.progress.height}
            />
          </Stack>
        </Box>
      )}
    </SduiNode>
  );
}
