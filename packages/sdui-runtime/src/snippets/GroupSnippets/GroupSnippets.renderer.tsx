import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { GroupSnippetsSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function GroupSnippetsRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={GroupSnippetsSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <Box borderColor={v.border_color}>
          {v.top_section && <Interpreter node={v.top_section} />}
          <Stack direction="column">
            {v.items?.map((item: Node, i: number) => (
              <Interpreter key={item.id || i} node={item} />
            ))}
          </Stack>
          {v.bottom_section && <Interpreter node={v.bottom_section} />}
        </Box>
      )}
    </SduiNode>
  );
}
