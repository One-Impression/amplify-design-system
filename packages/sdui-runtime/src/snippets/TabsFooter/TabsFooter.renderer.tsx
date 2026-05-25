import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { TabsFooterSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function TabsFooterRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={TabsFooterSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <Box borderTopWidth={1} borderColor="#E0E0E0">
          <Stack direction="row" justify="space-around">
            {v.items?.map((item: Node, i: number) => (
              <Interpreter key={item.id || i} node={item} />
            ))}
          </Stack>
        </Box>
      )}
    </SduiNode>
  );
}
