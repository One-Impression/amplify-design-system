import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ImageStackComponentSchema } from "@one-impression/sdk-native-sdui";
import { ImageStack as DSImageStack } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function ImageStackRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={ImageStackComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSImageStack
          images={v.images.map((img) => ({ uri: img.data.src }))}
          max={v.max_visible}
          size={v.size}
          overlap={v.overlap}
        />
      )}
    </SduiNode>
  );
}
