import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { SearchBarComponentSchema } from "@one-impression/sdk-native-sdui";
import { SearchBar as DSSearchBar } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function SearchBarRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={SearchBarComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSSearchBar
          placeholder={v.placeholder}
          value={v.value}
        />
      )}
    </SduiNode>
  );
}
