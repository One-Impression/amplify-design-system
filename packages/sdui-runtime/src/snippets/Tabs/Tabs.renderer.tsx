import React, { useState } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { TabsSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function TabsRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={TabsSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => <TabsInner items={v.items} activeIndex={v.active_index} content={v.content} />}
    </SduiNode>
  );
}

function TabsInner({
  items,
  activeIndex,
  content,
}: {
  items: Node[];
  activeIndex?: number;
  content?: Node[][];
}): React.ReactElement {
  const [selectedIndex] = useState(activeIndex ?? 0);

  return (
    <Box>
      <Stack direction="row">
        {items?.map((item: Node, i: number) => (
          <Interpreter key={item.id || i} node={item} />
        ))}
      </Stack>
      {content && content[selectedIndex] && (
        <Box>
          {content[selectedIndex].map((item: Node, i: number) => (
            <Interpreter key={item.id || i} node={item} />
          ))}
        </Box>
      )}
    </Box>
  );
}
