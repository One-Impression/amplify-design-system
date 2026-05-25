import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ImageStackSnippetSchema } from "@one-impression/sdk-native-sdui";
import { ImageStack as DSImageStack } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function ImageStackRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={ImageStackSnippetSchema.shape.data}
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
          images={v.images?.map((img: { src: string }) => ({ uri: img.src }))}
          maxVisible={v.max_visible}
          overflowCount={v.overflow_count}
        />
      )}
    </SduiNode>
  );
}
