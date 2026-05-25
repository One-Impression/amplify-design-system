import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { GroupChipsSchema } from "@one-impression/sdk-native-sdui";
import { ScrollView } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function GroupChipsRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={GroupChipsSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {v.items?.map((item: Node, i: number) => (
            <Interpreter key={item.id || i} node={item} />
          ))}
        </ScrollView>
      )}
    </SduiNode>
  );
}
