import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { RadioComponentSchema } from "@one-impression/sdk-native-sdui";
import { Radio as DSRadio } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function RadioRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={RadioComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSRadio
          selected={v.selected}
          disabled={v.disabled}
          label={v.label ? v.label.data.text : undefined}
        />
      )}
    </SduiNode>
  );
}
