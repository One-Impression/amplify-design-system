import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { CardSnippetSchema } from "@one-impression/sdk-native-sdui";
import { Card as DSCard, Box } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

/**
 * CardRenderer — renders a `creator.snippet.card` node.
 *
 * Composition mirrors the legacy `CardSnippetType1` shape: an optional
 * header Node, the array of body items, and an optional footer Node. The
 * footer slot may opt into its own background color via the sibling
 * `config.footer_bg_color` token — this is how the Explore listing draws
 * the state banner inside a Card without inheriting the body bg.
 *
 * Interaction:
 * - `on_click` / `on_view` on the Card node itself are dispatched by the
 *   surrounding SduiNode wrapper (Clickable + Viewable). The header and
 *   footer Nodes carry their own actions and are rendered via Interpreter,
 *   so any clicks/views on those slots dispatch independently.
 */
export function CardRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={CardSnippetSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => {
        // `config` lives as a sibling of `data` on the node itself, not
        // inside `data`. Reach through the original Node for it.
        const footerBgColor = (
          node as Node & { config?: { footer_bg_color?: string } }
        ).config?.footer_bg_color;

        return (
          <DSCard
            bg={v.bg_color}
            borderColor={v.border_color}
            rounded={v.border_radius}
          >
            {v.header ? (
              <Interpreter node={v.header as unknown as Node} />
            ) : null}
            {v.items?.map((item, i) => (
              <Interpreter
                key={item.id || i}
                node={item as unknown as Node}
              />
            ))}
            {v.footer ? (
              footerBgColor ? (
                <Box bg={footerBgColor}>
                  <Interpreter node={v.footer as unknown as Node} />
                </Box>
              ) : (
                <Interpreter node={v.footer as unknown as Node} />
              )
            ) : null}
          </DSCard>
        );
      }}
    </SduiNode>
  );
}
