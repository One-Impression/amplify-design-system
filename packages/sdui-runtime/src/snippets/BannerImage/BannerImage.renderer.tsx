import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { BannerImageSchema } from "@one-impression/sdk-native-sdui";
import { Image as DSImage } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";

export function BannerImageRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={BannerImageSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSImage
          source={{ uri: v.image.src }}
          accessibilityLabel={v.image.alt}
          resizeMode={v.image.resize_mode ?? "cover"}
          width="100%"
          aspectRatio={v.image.aspect_ratio}
        />
      )}
    </SduiNode>
  );
}
