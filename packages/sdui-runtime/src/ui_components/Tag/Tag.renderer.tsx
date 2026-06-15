import React, { useMemo } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { TagComponentSchema } from "@one-impression/sdk-native-sdui";
import { Tag as DSTag, Icon as DSIcon } from "@one-impression/ui-native";
import { sdui } from "@one-impression/tokens-creator/react-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Gradient } from "../../gradient/index.js";
import { useIconStore } from "../../icon-store/index.js";
import { parseSvg } from "../../icon-store/parseSvg.js";

interface TagIconProps {
  name: string;
  color?: string;
  size?: string | number;
}

/**
 * Resolves a glyph from the icon store and renders it sized for a tag (the
 * ui-native Icon is only a sized container — the SVG must be supplied as
 * children). Same pattern as the IconRenderer / PageHeader icons.
 */
function TagIcon({ name, color, size }: TagIconProps): React.ReactElement {
  const { getIcon } = useIconStore();
  const SvgIcon = useMemo(() => parseSvg(name, getIcon(name)), [name, getIcon]);
  // A tag's icon tracks its label size (inline-glyph convention) rather than a
  // fixed icon-size token, so it never dwarfs the 12px label.
  return (
    <DSIcon name={name} color={color} size={size ?? sdui.component.tag.fontSize}>
      <SvgIcon />
    </DSIcon>
  );
}

export function TagRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={TagComponentSchema.shape.data}
      id={node.id}
      type={node.type}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSTag
          label={v.label.text}
          bgColor={v.bg_color}
          textColor={v.text_color ?? v.label.color}
          background={
            v.gradient ? (
              <Gradient item={{ colors: v.gradient.colors, angle: v.gradient.angle }} />
            ) : undefined
          }
          icon={
            v.icon ? (
              <TagIcon name={v.icon.name} color={v.icon.color} size={v.icon.size} />
            ) : undefined
          }
        />
      )}
    </SduiNode>
  );
}
