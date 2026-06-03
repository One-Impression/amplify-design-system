import React, { useMemo } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { IconComponentSchema } from "@one-impression/sdk-native-sdui";
import { Icon as DSIcon } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useIconStore } from "../../icon-store/index.js";
import { parseSvg } from "../../icon-store/parseSvg.js";

interface IconBodyProps {
  name: string;
  color?: string;
  size?: string | number;
}

/**
 * Subcomponent so hooks (useIconStore, useMemo) can be called per React's
 * rules — render-prop callbacks aren't a valid hook scope, but a normal
 * function component is. Memoizing the resolved SVG component on `name`
 * prevents per-render unmount/remount of the SVG subtree (a new component
 * reference on every render would force React to treat it as a new type).
 */
function IconBody({ name, color, size }: IconBodyProps): React.ReactElement {
  const { getIcon } = useIconStore();
  const SvgIcon = useMemo(() => parseSvg(name, getIcon(name)), [name, getIcon]);
  return (
    <DSIcon name={name} color={color} size={size}>
      <SvgIcon />
    </DSIcon>
  );
}

export function IconRenderer(node: Node): React.ReactElement {
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
      {(v) => <IconBody name={v.name} color={v.color} size={v.size} />}
    </SduiNode>
  );
}
