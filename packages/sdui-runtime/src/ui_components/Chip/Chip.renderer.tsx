import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ChipComponentSchema } from "@one-impression/sdk-native-sdui";
import { Chip as DSChip } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function ChipRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={ChipComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSChip
          label={v.label.text}
          selected={v.selected}
          disabled={v.disabled}
          icon={v.icon ? <Interpreter node={v.icon} /> : undefined}
        />
      )}
    </SduiNode>
  );
}
