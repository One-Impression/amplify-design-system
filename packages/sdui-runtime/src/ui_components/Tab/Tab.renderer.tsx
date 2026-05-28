import React, { useContext, useMemo } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { TabComponentSchema } from "@one-impression/sdk-native-sdui";
import { Tab as DSTab, Icon as DSIcon } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { TabBarActiveContext } from "../../state/TabBarActiveContext.js";

export function TabRenderer(node: Node): React.ReactElement {
  const actionEngine = useActionEngine();
  // Optional parent tab bar (e.g. TabsFooter). When present, taps update
  // its optimistic active state synchronously so the indicator follows
  // the finger without waiting for the BFF round-trip; the BFF call then
  // proceeds and loads the new tab's content. When absent, the Tab still
  // works standalone — only the `on_click` dispatch happens.
  const tabBar = useContext(TabBarActiveContext);
  // DSTab is itself a Pressable, so a wrapping <Clickable> in SduiNode would
  // be swallowed by the inner Pressable (taps land on the deepest Pressable
  // first). Dispatch on_click here and pass it directly as DSTab.onPress;
  // intentionally do NOT forward on_click to SduiNode so the outer wrap is
  // skipped. on_load / on_view / on_dismount still go through SduiNode.
  // Memoize the handler so DSTab receives a stable reference across
  // re-renders — important for any future React.memo on DSTab and for
  // keeping the Pressable's internal gesture state from churning. The
  // handler is `undefined` when there's nothing for it to do, so the
  // memo returns the value (not a function); useMemo (not useCallback)
  // is the right hook here.
  const onPress = useMemo<(() => void) | undefined>(() => {
    if (!node.on_click && !tabBar) return undefined;
    return () => {
      // 1. Optimistic visual: parent tab bar updates active state
      //    synchronously (no-op if not inside one).
      tabBar?.setActiveTabId(node.id);
      // 2. Server-driven content: fire the BFF action.
      if (node.on_click) actionEngine.dispatch(node.on_click);
    };
  }, [node.id, node.on_click, tabBar, actionEngine]);
  return (
    <SduiNode
      data={node.data}
      schema={TabComponentSchema.shape.data}
      id={node.id}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DSTab
          label={v.label.text}
          active={v.active}
          onPress={onPress}
          icon={
            v.icon ? (
              <DSIcon
                name={v.icon.name}
                size={v.icon.size}
                color={v.icon.color}
              />
            ) : undefined
          }
        />
      )}
    </SduiNode>
  );
}
