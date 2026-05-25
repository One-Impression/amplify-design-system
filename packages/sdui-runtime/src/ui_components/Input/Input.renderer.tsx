import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { InputComponentSchema } from "@one-impression/sdk-native-sdui";
import { Input as DSInput } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function InputRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={InputComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSInput
          placeholder={v.placeholder}
          value={v.value}
          label={v.label ? v.label.data.text : undefined}
          disabled={v.disabled}
          maxLength={v.max_length}
          multiline={v.multiline}
        />
      )}
    </SduiNode>
  );
}
