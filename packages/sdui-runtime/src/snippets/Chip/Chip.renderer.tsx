import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ChipSnippetSchema } from "@one-impression/sdk-native-sdui";
import { Chip as DSChip } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { IconGlyph } from "../../icon-store/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

export function ChipRenderer(node: Node): React.ReactElement {
  const actionEngine = useActionEngine();
  // DSChip is itself a Pressable, so a wrapping <Clickable> in SduiNode would be
  // swallowed by the inner Pressable (taps land on the deepest Pressable first).
  // Dispatch on_click here and pass it directly as DSChip.onPress; intentionally
  // do NOT forward on_click to SduiNode so the dead outer wrap is skipped.
  // on_load / on_view / on_dismount still go through SduiNode. Same pattern as
  // the Tab renderer — any snippet whose ui-native component is itself pressable
  // must wire onPress directly rather than rely on SduiNode's Clickable.
  const handlePress = useCallback(() => {
    if (node.on_click) actionEngine.dispatch(node.on_click);
  }, [node.on_click, actionEngine]);
  const onPress = node.on_click ? handlePress : undefined;
  return (
    <SduiNode
      data={node.data}
      schema={ChipSnippetSchema.shape.data}
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
          bg={v.selected ? v.selected_bg_color : v.bg_color}
          onPress={onPress}
          // Leading icon (if the chip declares one). IconGlyph resolves the
          // named glyph from the icon store — bare DSIcon is only a sized
          // container and renders nothing without a glyph child.
          icon={
            v.icon ? (
              <IconGlyph name={v.icon.name} size={v.icon.size} color={v.icon.color} />
            ) : undefined
          }
          // A selected (multi-select) chip shows a remove × as a TRAILING icon
          // (right side, the conventional remove affordance). Reactive because
          // `selected` is local-bound, so the × appears/disappears the instant
          // the chip toggles, with no reload.
          trailingIcon={v.selected ? <IconGlyph name="close" size={14} /> : undefined}
        />
      )}
    </SduiNode>
  );
}
