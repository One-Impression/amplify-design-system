import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { SelectableItemComponentSchema } from "@one-impression/sdk-native-sdui";
import { SelectableItem as DSSelectableItem } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

export function SelectableItemRenderer(node: Node): React.ReactElement {
  const actionEngine = useActionEngine();
  // DSSelectableItem is itself a Pressable — a wrapping <Clickable> in
  // SduiNode would be swallowed by the inner Pressable. Dispatch on_click
  // here and pass it directly as DSSelectableItem.onPress; do NOT forward
  // on_click to SduiNode. Same shape as the TabRenderer / ChipRenderer fix.
  const handlePress = useCallback(() => {
    if (node.on_click) actionEngine.dispatch(node.on_click);
  }, [node.on_click, actionEngine]);
  const onPress = node.on_click ? handlePress : undefined;
  return (
    <SduiNode
      data={node.data}
      schema={SelectableItemComponentSchema.shape.data}
      id={node.id}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSSelectableItem
          label={v.label.text}
          description={v.subtitle ? v.subtitle.text : undefined}
          selected={v.selected}
          disabled={v.disabled}
          onPress={onPress}
          leading={
            v.icon ? (
              <Interpreter node={v.icon} />
            ) : v.image ? (
              <Interpreter node={v.image} />
            ) : undefined
          }
        />
      )}
    </SduiNode>
  );
}
