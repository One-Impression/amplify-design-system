import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { TextComponentSchema } from "@one-impression/sdk-native-sdui";
import { Text as DSText } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function TextRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={TextComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSText
          variant={v.variant}
          color={v.color}
          size={v.font_size}
          weight={v.font_weight}
          align={v.alignment}
          numberOfLines={v.max_lines}
        >
          {v.text}
        </DSText>
      )}
    </SduiNode>
  );
}
