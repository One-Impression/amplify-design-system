import React, { useEffect } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { BottomSheetSnippetSchema } from "@one-impression/sdk-native-sdui";
import { SduiNode } from "../../sdui-node/index.js";
import { useBottomSheetStore } from "../../bottom-sheet/useBottomSheetStore.js";

/**
 * BottomSheet snippet renderer.
 *
 * This renderer does NOT render children inline. Instead, it registers
 * the bottom-sheet configuration with the BottomSheetStore on mount.
 * The BottomSheetHost (rendered at the app root) picks up the entry
 * from the store and renders the actual sheet overlay.
 */
export function BottomSheetRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={BottomSheetSnippetSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <BottomSheetRegistrar
          id={node.id}
          size={v.size}
          title={v.header?.data?.title?.text}
          header={v.header}
          footer={v.footer}
          items={v.items}
          apiEndpoint={v.api_endpoint}
        />
      )}
    </SduiNode>
  );
}

function BottomSheetRegistrar({
  id,
  size,
  title,
  header,
  footer,
  items,
  apiEndpoint,
}: {
  id: string;
  size: string;
  title?: string;
  header?: unknown;
  footer?: unknown;
  items: unknown[];
  apiEndpoint?: string;
}): React.ReactElement | null {
  const register = useBottomSheetStore((s) => s.register);

  useEffect(() => {
    register(id, {
      id,
      title,
      size,
      items: items as Node[],
    });
    // No teardown: registry persists until the page unmounts and replaces it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This renderer does not render inline — the BottomSheetHost handles display.
  return null;
}
