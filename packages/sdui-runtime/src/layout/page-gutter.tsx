import React from "react";
import { StyleSheet, View } from "react-native";
import { resolveSpacing, type SpacingToken } from "@one-impression/ui-native";
import type { Node } from "@one-impression/sdk-native-sdui";

/**
 * Page layout rhythm — the horizontal gutter and the vertical inter-item gap that
 * every top-level page/sheet item sits within, so rows, headers, and card boxes
 * align on one line and stack with consistent spacing.
 *
 * The *values* come from tokens (gutter = `md` spacing = 12; default row gap is
 * half the gutter = 6). The *container* (page layout / bottom sheet) owns applying
 * them via `GutterItem`; snippets stay layout-agnostic — they keep their own
 * INTERNAL padding but never add their own outer gutter or inter-item margin.
 *
 * Per item, each axis is controllable by the same two mechanisms:
 *   - snippet-definition default — a type in FULL_BLEED_TYPES (horizontal on/off)
 *     or in GAP_OVERRIDES (vertical value, e.g. a header wants more space above)
 *   - backend per-instance override — a node `full_bleed` boolean / `gap`
 *     value (base-node schema fields, Phase 2; read here already, win over the
 *     type default)
 *
 * Horizontal is binary (gutter or edge-to-edge — the only cases that occur).
 * Vertical is a *value*, because rhythm legitimately varies (a section header
 * wants more breathing room above it than a plain row).
 */
export const PAGE_GUTTER_TOKEN = "md" as const;

const GUTTER_PX = resolveSpacing(PAGE_GUTTER_TOKEN) ?? 12;
// Half the gutter, applied to BOTH top and bottom of every item. React Native
// does not collapse margins (unlike CSS), so adjacent items' margins sum: two
// default items sit a full gutter (6 + 6 = 12) apart, and the page's top/bottom
// edges get the half (6).
const DEFAULT_ROW_GAP_PX = GUTTER_PX / 2; // 6

const styles = StyleSheet.create({
  gutter: { paddingHorizontal: GUTTER_PX },
});

/** Types that render edge-to-edge by default (no horizontal gutter). */
export const FULL_BLEED_TYPES = new Set<string>([]);

/**
 * Per-type vertical-gap overrides, as spacing TOKENS. Lets a snippet type ask
 * for more (or zero) space above it than the default — e.g. a section header
 * breathing more. Use `'none'` to butt against the previous item.
 */
export const GAP_OVERRIDES: Record<string, SpacingToken> = {
  // Section headers break sections — give them a clearly larger gap per side
  // (xl = 24, so ~30px once an adjacent item's default 6 is added) than the
  // default 6, so a section reads as a distinct break. This is the single,
  // page-owned source of section-header spacing now that the snippet no longer
  // carries its own bottom margin.
  "sdui.snippet.section_header": "xl",
};

/** Should this node bleed to the container edges (skip the horizontal gutter)? */
export function isFullBleed(node: Node): boolean {
  const flag = (node as { full_bleed?: unknown }).full_bleed;
  if (typeof flag === "boolean") return flag; // backend per-instance override (Phase 2)
  return FULL_BLEED_TYPES.has(node.type); // snippet-definition default
}

/**
 * The vertical margin (px) on EACH side (top and bottom) of this item, resolved
 * from spacing TOKENS. Because RN sums adjacent margins, two items with the
 * default sit a full gutter apart (6 + 6 = 12). Resolution order: backend `gap`
 * token → per-type override token → default (half the gutter = 6). A raw px
 * number is accepted only as `resolveSpacing`'s standard escape hatch.
 */
export function resolveRowGap(node: Node): number {
  const flag = (node as { gap?: unknown }).gap;
  if (typeof flag === "string" || typeof flag === "number") {
    // backend per-instance override — a spacing token (raw px tolerated)
    return resolveSpacing(flag as SpacingToken | number) ?? DEFAULT_ROW_GAP_PX;
  }
  const override = GAP_OVERRIDES[node.type];
  if (override !== undefined) return resolveSpacing(override) ?? DEFAULT_ROW_GAP_PX; // per-type token
  return DEFAULT_ROW_GAP_PX;
}

/**
 * Wrap one top-level item in the page's horizontal gutter + symmetric vertical
 * margin (both sides). Gutter is dropped for full-bleed items. Adjacent items'
 * margins sum (RN doesn't collapse), so default items sit a full gutter apart
 * and the page edges get the half. Page layouts / the sheet call this per item.
 */
export function GutterItem({
  node,
  children,
}: {
  node: Node;
  children: React.ReactNode;
}): React.ReactElement {
  const gutter = !isFullBleed(node) && styles.gutter;
  const v = resolveRowGap(node);
  return <View style={[gutter, { marginTop: v, marginBottom: v }]}>{children}</View>;
}
