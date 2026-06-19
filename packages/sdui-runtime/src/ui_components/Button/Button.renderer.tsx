import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ButtonComponentSchema } from "@one-impression/sdk-native-sdui";
import {
  Button as DSButton,
  Text as DSText,
  buttonVariantColors,
} from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { IconGlyph } from "../../icon-store/IconGlyph.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

/**
 * The wire button-size enum (`small|medium|large`, ButtonSizeSchema) differs
 * from ui-native's `sm|md|lg`. Map it here — the renderer is the adapter.
 * Without this, any explicit wire size crashes ui-native's sizeStyles lookup.
 */
const SIZE_MAP: Record<string, "sm" | "md" | "lg"> = {
  small: "sm",
  medium: "md",
  large: "lg",
};

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
      {(v) => {
        const dsSize = v.size ? SIZE_MAP[v.size] : undefined;
        return (
        <DSButton
          variant={v.variant}
          size={dsSize}
          loading={v.loading}
          disabled={v.disabled}
          onPress={
            node.on_click ? () => actionEngine.dispatch(node.on_click!) : undefined
          }
        >
          {/* icon_left / icon_right are bare { name, color?, size? } specs, NOT
              nodes — render them with IconGlyph directly (the same icon-store
              path InfoRow uses), which resolves a default size/colour and feeds
              the parsed SVG concrete dimensions. Routing the bare spec through
              the Interpreter crashed resolveRenderer (`type.includes(...)` on an
              absent `type`); routing it through the node IconRenderer left the
              glyph dimensionless. */}
          {v.icon_left && (
            <IconGlyph
              name={v.icon_left.name}
              color={v.icon_left.color}
              size={v.icon_left.size}
            />
          )}
          {/* label is TextSchema ({ text, color?, font_size? }), not a Node —
              ButtonComponentSchema types it that way, so render it directly
              instead of routing through the Interpreter (which requires a
              wire `type` and crashed on every button). */}
          {/* Default the label color to the variant's text color (e.g. white
              on a primary/purple button) unless the contract overrides it. */}
          {/* Label typography is intrinsic to the button, not required from
              the backend: size follows the button's `size` (falling back to a
              comfortable default) and weight is semibold. The contract only
              overrides via label.color / label.font_size. The renderer owns
              this because it renders the label directly, bypassing the
              Button's own string-label styling. */}
          <DSText
            color={
              v.label.color ?? buttonVariantColors[v.variant ?? "primary"]?.text
            }
            size={v.label.font_size ?? "md"}
            weight="semibold"
          >
            {v.label.text}
          </DSText>
          {v.icon_right && (
            <IconGlyph
              name={v.icon_right.name}
              color={v.icon_right.color}
              size={v.icon_right.size}
            />
          )}
        </DSButton>
        );
      }}
    </SduiNode>
  );
}
