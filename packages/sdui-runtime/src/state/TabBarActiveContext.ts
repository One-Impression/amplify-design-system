/**
 * Optimistic tab-bar active state.
 *
 * Tab bars (e.g. `sdui.snippet.tabs_footer`) are inherently mutually-
 * exclusive selectables: the user taps one, the indicator should follow
 * the finger *immediately* — not after a BFF round-trip. If the
 * `active_index` only updated on a server response, the highlight would
 * lag every load of the new tab's content.
 *
 * This context lets the **parent tab bar** own a local, optimistic
 * "which tab was just tapped" value, and lets the **Tab renderer** both
 * report a tap (so the parent re-renders all sibling tabs) and read the
 * current value (so its `active` flag follows local state instead of
 * waiting for the server).
 *
 * Semantics:
 *
 * - The parent provides the context with its `setActiveTabId` mutator.
 *   It seeds `activeTabId` to `null`; on first tap it becomes the
 *   tapped node's id and overrides the server-driven `data.active_index`
 *   until the next tap.
 * - A child `Tab` calls `setActiveTabId(node.id)` *before* dispatching
 *   its `on_click` action. The state update is synchronous; the BFF
 *   call is fire-and-forget from the indicator's perspective.
 * - If a child Tab is rendered outside a tab bar (no provider), the
 *   context is `null` and the Tab falls back to the BFF-supplied
 *   `data.active` flag — no behaviour change for non-tab-bar usage.
 * - The server can still drive selection by re-rendering the tab bar
 *   with a new `data.active_index`; the parent's `useState` resets to
 *   `null` on mount, so an authoritative server update is honoured on
 *   the first render and any subsequent tap overrides it again.
 *
 * Generic over any tab bar shape (footer, top tabs, etc.) so future
 * tab-bar snippets can reuse it without duplicating the pattern.
 */
import { createContext } from "react";

export interface TabBarActiveContextValue {
  /**
   * Locally-overridden active tab node id. `null` until the user
   * interacts; once set, takes priority over the BFF's
   * `data.active_index` so the indicator does not wait on a
   * round-trip.
   */
  activeTabId: string | null;
  /** Mutator the child Tab calls in its `onPress`. */
  setActiveTabId: (id: string) => void;
}

export const TabBarActiveContext =
  createContext<TabBarActiveContextValue | null>(null);
