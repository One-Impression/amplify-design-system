import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ChipSnippetSchema } from "@one-impression/sdk-native-sdui";
import { Chip as DSChip, Icon as DSIcon } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function ChipRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={ChipSnippetSchema.shape.data}
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
          bg={v.selected ? v.selected_bg_color : v.bg_color}
          icon={
            v.icon ? (
              <DSIcon
                name={v.icon.name}
                size={v.icon.size}
                color={v.icon.color}
              />
            ) : undefined
          }
        />
      )}
    </SduiNode>
  );
}
