import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { BottomSheetFooterSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function BottomSheetFooterRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={BottomSheetFooterSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <Box padding={16} borderTopWidth={1} borderColor="#E0E0E0">
          <Stack direction="row" gap={12} justify="flex-end">
            {v.secondary_button && <Interpreter node={v.secondary_button} />}
            {v.primary_button && <Interpreter node={v.primary_button} />}
          </Stack>
        </Box>
      )}
    </SduiNode>
  );
}
