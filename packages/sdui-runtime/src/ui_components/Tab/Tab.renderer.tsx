import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { TabComponentSchema } from "@one-impression/sdk-native-sdui";
import { Tab as DSTab } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function TabRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={TabComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSTab
          label={v.label.text}
          active={v.active}
          icon={v.icon ? <Interpreter node={v.icon} /> : undefined}
        />
      )}
    </SduiNode>
  );
}
