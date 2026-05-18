import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ProgressIndicatorComponentSchema } from "@one-impression/sdk-native-sdui";
import { ProgressIndicator as DSProgressIndicator } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function ProgressIndicatorRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={ProgressIndicatorComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSProgressIndicator
          value={v.value}
          trackColor={v.track_color}
          fillColor={v.fill_color}
          height={v.height}
        />
      )}
    </SduiNode>
  );
}
