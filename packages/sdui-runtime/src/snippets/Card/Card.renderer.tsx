import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { CardSnippetSchema } from "@one-impression/sdk-native-sdui";
import { Card as DSCard } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function CardRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={CardSnippetSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSCard
          bg={v.bg_color}
          borderColor={v.border_color}
          rounded={v.border_radius}
          elevation={v.elevation}
        >
          {v.items?.map((item: Node, i: number) => (
            <Interpreter key={item.id || i} node={item} />
          ))}
        </DSCard>
      )}
    </SduiNode>
  );
}
