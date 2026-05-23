import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { IconComponentSchema } from "@one-impression/sdk-native-sdui";
import { Icon as DSIcon } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useIconStore } from "../../icon-store/index.js";
import { parseSvg } from "../../icon-store/parseSvg.js";

export function IconRenderer(node: Node): React.ReactElement {
  const { getIcon } = useIconStore();

  return (
    <SduiNode
      data={node.data}
      schema={IconComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => {
        const SvgIcon = parseSvg(v.name, getIcon(v.name));
        return (
          <DSIcon
            name={v.name}
            color={v.color}
            size={v.size}
          >
            <SvgIcon />
          </DSIcon>
        );
      }}
    </SduiNode>
  );
}
