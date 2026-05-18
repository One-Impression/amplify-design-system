import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ButtonComponentSchema } from "@one-impression/sdk-native-sdui";
import { Button as DSButton } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function ButtonRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={ButtonComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSButton
          variant={v.variant}
          size={v.size}
          loading={v.loading}
          disabled={v.disabled}
        >
          {v.icon_left && <Interpreter node={v.icon_left} />}
          <Interpreter node={v.label} />
          {v.icon_right && <Interpreter node={v.icon_right} />}
        </DSButton>
      )}
    </SduiNode>
  );
}
