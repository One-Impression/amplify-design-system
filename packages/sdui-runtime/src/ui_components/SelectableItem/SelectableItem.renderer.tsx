import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { SelectableItemComponentSchema } from "@one-impression/sdk-native-sdui";
import { SelectableItem as DSSelectableItem } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function SelectableItemRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={SelectableItemComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSSelectableItem
          label={v.label.data.text}
          description={v.subtitle ? v.subtitle.data.text : undefined}
          selected={v.selected}
          disabled={v.disabled}
          leading={
            v.icon ? (
              <Interpreter node={v.icon} />
            ) : v.image ? (
              <Interpreter node={v.image} />
            ) : undefined
          }
        />
      )}
    </SduiNode>
  );
}
