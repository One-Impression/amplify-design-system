import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { CardComponentSchema } from "@one-impression/sdk-native-sdui";
import { Card as DSCard } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function CardRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={CardComponentSchema.shape.data}
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
          padding={v.padding}
          rounded={v.border_radius}
          borderColor={v.border_color}
          elevation={v.elevation}
        >
          {v.items?.map((item, i) => (
            <Interpreter key={item.id || i} node={item} />
          ))}
        </DSCard>
      )}
    </SduiNode>
  );
}
