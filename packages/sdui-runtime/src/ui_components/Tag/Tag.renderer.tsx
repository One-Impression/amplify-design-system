import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { TagComponentSchema } from "@one-impression/sdk-native-sdui";
import { Tag as DSTag } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function TagRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={TagComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSTag
          label={v.label.text}
          variant={v.variant ?? "default"}
          icon={v.icon ? <Interpreter node={v.icon} /> : undefined}
        />
      )}
    </SduiNode>
  );
}
