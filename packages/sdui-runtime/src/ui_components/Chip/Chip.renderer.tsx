import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ChipComponentSchema } from "@one-impression/sdk-native-sdui";
import { Chip as DSChip, Icon as DSIcon } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

export function ChipRenderer(node: Node): React.ReactElement {
  const actionEngine = useActionEngine();
  // DSChip is itself a Pressable, so a wrapping <Clickable> in SduiNode would
  // be swallowed by the inner Pressable (taps land on the deepest Pressable
  // first). Dispatch on_click here and pass it directly as DSChip.onPress;
  // intentionally do NOT forward on_click to SduiNode so the outer wrap is
  // skipped. on_load / on_view / on_dismount still go through SduiNode.
  // Same shape as the TabRenderer fix.
  const handlePress = useCallback(() => {
    if (node.on_click) actionEngine.dispatch(node.on_click);
  }, [node.on_click, actionEngine]);
  const onPress = node.on_click ? handlePress : undefined;
  return (
    <SduiNode
      data={node.data}
      schema={ChipComponentSchema.shape.data}
      id={node.id}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSChip
          label={v.label.text}
          selected={v.selected}
          disabled={v.disabled}
          onPress={onPress}
          icon={
            v.icon ? (
              <DSIcon name={v.icon.name} size={v.icon.size} color={v.icon.color} />
            ) : undefined
          }
        />
      )}
    </SduiNode>
  );
}
