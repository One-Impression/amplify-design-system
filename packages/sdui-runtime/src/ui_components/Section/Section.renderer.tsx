import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { SectionComponentSchema } from "@one-impression/sdk-native-sdui";
import { Section as DSSection } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function SectionRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={SectionComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSSection bg={v.bg_color}>
          {v.items.map((item, i) => (
            <Interpreter key={item.id || i} node={item} />
          ))}
        </DSSection>
      )}
    </SduiNode>
  );
}
