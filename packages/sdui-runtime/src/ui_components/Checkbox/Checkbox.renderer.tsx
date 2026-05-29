import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { CheckboxComponentSchema } from "@one-impression/sdk-native-sdui";
import { Checkbox as DSCheckbox } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

export function CheckboxRenderer(node: Node): React.ReactElement {
  const actionEngine = useActionEngine();
  // DSCheckbox is itself a Pressable — a wrapping <Clickable> in SduiNode
  // would be swallowed by the inner Pressable. Dispatch on_click here and
  // pass it directly as DSCheckbox.onPress; do NOT forward on_click to
  // SduiNode. Same shape as the TabRenderer / ChipRenderer fix.
  const handlePress = useCallback(() => {
    if (node.on_click) actionEngine.dispatch(node.on_click);
  }, [node.on_click, actionEngine]);
  const onPress = node.on_click ? handlePress : undefined;
  return (
    <SduiNode
      data={node.data}
      schema={CheckboxComponentSchema.shape.data}
      id={node.id}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSCheckbox
          checked={v.checked}
          disabled={v.disabled}
          label={v.label ? v.label.text : undefined}
          onPress={onPress}
        />
      )}
    </SduiNode>
  );
}
