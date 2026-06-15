import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Node } from "@one-impression/sdk-native-sdui";
import { TabsFooterSchema } from "@one-impression/sdk-native-sdui";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";
import { applyActiveIndex } from "./applyActiveIndex.js";
import { TabBarActiveContext } from "../../state/TabBarActiveContext.js";

const styles = StyleSheet.create({
  /**
   * Top-level container — pinned-bottom row of tabs with a hairline top
   * border and a soft top-edge shadow (matches legacy
   * `TabsFooterSnippetType1.styles.ts` box shadow).
   */
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  /**
   * Each tab gets equal share of the row, matching legacy
   * `styles.flexGrow: { flexGrow: 1 }`.
   */
  tabSlot: {
    flex: 1,
  },
});

/**
 * TabsFooter — bottom navigation row.
 *
 * Renders an array of tab Nodes (each `creator.ui_component.tab`) as a
 * horizontal flex row, with equal-width slots. Each tab Node is recursed
 * through `<Interpreter />`, which means:
 *
 * - The tab's own `on_click` is dispatched via the Tab renderer's `SduiNode`
 *   wrapper — no extra Clickable layer here.
 * - The active-index tab is marked by overriding the child Node's
 *   `data.active = true` (see {@link applyActiveIndex}). The Tab renderer
 *   reads `data.active` and applies primary-color tint to icon + label.
 *
 * Legacy reference: `TabsFooterSnippetType1` in one_club_app. Legacy uses
 * `useNavigationState` to discover the active tab from route params; we use
 * the SDUI-native `active_index` field instead so layouts stay declarative.
 */
export function TabsFooterRenderer(node: Node): React.ReactElement {
  // Optimistic active state. `null` until the user taps; once set, takes
  // priority over the BFF's `data.active_index` so the underline indicator
  // follows the finger instead of waiting for the BFF round-trip that
  // loads the new tab's content. The server can still seed selection at
  // mount via `data.active_index` (used until the first tap).
  const [localActiveTabId, setLocalActiveTabId] = useState<string | null>(null);
  const ctxValue = useMemo(
    () => ({ activeTabId: localActiveTabId, setActiveTabId: setLocalActiveTabId }),
    [localActiveTabId],
  );
  // Bottom safe-area inset so the bar clears the home indicator / gesture bar.
  // Applied as paddingBottom on the bar itself (not an outer gap) so the white
  // background extends to the device edge, with the tabs sitting above it.
  const insets = useSafeAreaInsets();

  return (
    <SduiNode
      data={node.data}
      schema={TabsFooterSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => {
        const rawItems = v.items ?? [];
        // Resolve effective active index: a local tap wins, otherwise fall
        // back to the BFF-supplied `active_index`.
        const localIndex =
          localActiveTabId != null
            ? rawItems.findIndex((it) => it.id === localActiveTabId)
            : -1;
        const effectiveActiveIndex =
          localIndex >= 0 ? localIndex : v.active_index;
        const items = applyActiveIndex(rawItems, effectiveActiveIndex);

        return (
          <TabBarActiveContext.Provider value={ctxValue}>
            <View style={[styles.container, { paddingBottom: 12 + insets.bottom }]}>
              {items.map((item, i) => (
                <View key={item.id || `tab-${i}`} style={styles.tabSlot}>
                  <Interpreter node={item} />
                </View>
              ))}
            </View>
          </TabBarActiveContext.Provider>
        );
      }}
    </SduiNode>
  );
}
