import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ButtonComponentSchema } from "@one-impression/sdk-native-sdui";
import { Button as DSButton, Text as DSText } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

export function ButtonRenderer(node: Node): React.ReactElement {
  const actionEngine = useActionEngine();
  // on_click is forwarded to DSButton.onPress below rather than relying on
  // SduiNode's Clickable wrapper: DSButton renders an inner Pressable that
  // becomes the touch responder, so an outer Pressable never fires. Passing
  // on_click={undefined} to SduiNode also prevents a disabled button's tap
  // from bubbling to the wrapper and dispatching anyway.
  return (
    <SduiNode
      data={node.data}
      schema={ButtonComponentSchema.shape.data}
      id={node.id}
      on_click={undefined}
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
          onPress={
            node.on_click ? () => actionEngine.dispatch(node.on_click!) : undefined
          }
        >
          {v.icon_left && <Interpreter node={v.icon_left} />}
          {/* label is TextSchema ({ text, color?, font_size? }), not a Node —
              ButtonComponentSchema types it that way, so render it directly
              instead of routing through the Interpreter (which requires a
              wire `type` and crashed on every button). */}
          <DSText color={v.label.color} size={v.label.font_size}>
            {v.label.text}
          </DSText>
          {v.icon_right && <Interpreter node={v.icon_right} />}
        </DSButton>
      )}
    </SduiNode>
  );
}
