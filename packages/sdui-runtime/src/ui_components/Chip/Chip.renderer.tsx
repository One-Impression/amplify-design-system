import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ChipComponentSchema } from "@one-impression/sdk-native-sdui";
import { Chip as DSChip } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { IconGlyph } from "../../icon-store/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

export function ChipRenderer(node: Node): React.ReactElement {
  const actionEngine = useActionEngine();
  // DSChip is itself a Pressable, so a wrapping Clickable in SduiNode would be
  // swallowed by the inner Pressable (taps land on the deepest Pressable
  // first). Dispatch on_click here and pass it directly as DSChip.onPress;
  // intentionally do NOT forward on_click to SduiNode so the outer wrap is
  // skipped. on_load / on_view / on_dismount still go through SduiNode.
  // (Mirrors TabRenderer / the snippet Chip — without this a chip's on_click
  // never fired.)
  const onClick = node.on_click;
  const onPress = onClick ? () => actionEngine.dispatch(onClick) : undefined;
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
          // `selected` may be a render-binding ref in the wire contract; the
          // runtime resolves it to a boolean before this renderer sees it.
          selected={v.selected as boolean | undefined}
          disabled={v.disabled}
          onPress={onPress}
          icon={
            v.icon ? (
              <IconGlyph name={v.icon.name} size={v.icon.size} color={v.icon.color} />
            ) : undefined
          }
        />
      )}
    </SduiNode>
  );
}
