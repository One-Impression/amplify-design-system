import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { EmptySpaceSchema } from "@one-impression/sdk-native-sdui";
import { Box } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function EmptySpaceRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={EmptySpaceSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => <Box height={v.height ?? 16} />}
    </SduiNode>
  );
}
