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
  // Section headers break sections — give them a full gutter (md = 12) per side
  // instead of the default 6, so they separate more strongly. This is the single,
  // page-owned source of section-header spacing now that the snippet no longer
  // carries its own bottom margin.
  "sdui.snippet.section_header": "md",
};

/**
 * Per-type EXTRA top margin, ADDED on top of `resolveRowGap` (so the margin is
 * asymmetric). For types that should separate more strongly from what precedes
 * them than from their own content below — a section header gets an extra sm
 * above, so a new section reads as a stronger break while the header→content gap
 * below stays the row gap.
 */
export const GAP_TOP_OVERRIDES: Record<string, SpacingToken> = {
  "sdui.snippet.section_header": "sm",
};

/**
 * Per-type bottom-margin REDUCTION, SUBTRACTED from `resolveRowGap` (floored at
 * 0). For types that should hug the content directly below them — a section
 * header trims its bottom gap by sm so it sits closer to its own section's
 * content, complementing the extra space GAP_TOP_OVERRIDES gives it above.
 */
export const GAP_BOTTOM_REDUCTIONS: Record<string, SpacingToken> = {
  "sdui.snippet.section_header": "sm",
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
 * The TOP margin (px) for this item: the row gap (`resolveRowGap`) plus any
 * per-type extra-top override (`GAP_TOP_OVERRIDES`). The bottom margin stays
 * `resolveRowGap`, so types like the section header sit asymmetrically — more
 * space above than below.
 */
export function resolveRowGapTop(node: Node): number {
  const extra = GAP_TOP_OVERRIDES[node.type];
  const extraPx = extra !== undefined ? (resolveSpacing(extra) ?? 0) : 0;
  return resolveRowGap(node) + extraPx;
}

/**
 * The BOTTOM margin (px): the row gap minus any per-type bottom reduction
 * (`GAP_BOTTOM_REDUCTIONS`), floored at 0.
 */
export function resolveRowGapBottom(node: Node): number {
  const reduce = GAP_BOTTOM_REDUCTIONS[node.type];
  const reducePx = reduce !== undefined ? (resolveSpacing(reduce) ?? 0) : 0;
  return Math.max(0, resolveRowGap(node) - reducePx);
}

/** Banner snippet type — the first-item flush-top rule keys off this. */
const BANNER_SNIPPET_TYPE = "sdui.snippet.banner_image";
// First-item top inset — a standard md gap when the first item isn't a flush
// full-bleed banner (which gets 0).
const FIRST_ITEM_TOP = resolveSpacing("md") ?? 12;

/**
 * Top margin for an item given its position. The FIRST item (index 0) is
 * special:
 *  - a full-bleed banner sits FLUSH against the top (0) — a cover image meets
 *    the screen / nav-header edge with no gap;
 *  - any other first item gets a standard `md` top inset.
 * Non-first items use the normal row-gap-top (incl. per-type extra-top override).
 */
export function resolveTopMargin(node: Node, index?: number): number {
  if (index === 0) {
    if (node.type === BANNER_SNIPPET_TYPE && isFullBleed(node)) return 0;
    return FIRST_ITEM_TOP;
  }
  return resolveRowGapTop(node);
}

/**
 * Wrap one top-level item in the page's horizontal gutter + vertical margin.
 * Bottom = row gap (minus any per-type reduction); top = `resolveTopMargin`,
 * which applies the first-item rule when `index` is 0 and otherwise the row-gap
 * top (incl. per-type extra-top). Gutter is dropped for full-bleed items.
 * Adjacent items' margins sum (RN doesn't collapse). Page layouts / the sheet
 * call this per item, passing the item's `index`.
 */
export function GutterItem({
  node,
  index,
  children,
}: {
  node: Node;
  index?: number;
  children: React.ReactNode;
}): React.ReactElement {
  const gutter = !isFullBleed(node) && styles.gutter;
  const bottom = resolveRowGapBottom(node);
  const top = resolveTopMargin(node, index);
  return (
    <View style={[gutter, { marginTop: top, marginBottom: bottom }]}>
      {children}
    </View>
  );
}

/**
 * Per-side vertical margin (px) for a child INSIDE a vertical group_config — the
 * same page rhythm a top-level item gets, but with the group's own `gap` slotted
 * in as the MIDDLE fallback so a group can re-space all its children at once.
 * Resolution order:
 *   (1) child node `gap`   — backend per-instance override, on the child
 *   (2) group `gap`        — backend override, on the group_config node
 *   (3) per-type override / default — the inherited page rhythm (half-gutter = 6)
 * Applied symmetrically (top + bottom) by `GroupGutterItem`, matching the page's
 * per-side model so two default children sit a full gutter apart (6 + 6 = 12).
 */
export function resolveGroupRowGap(
  node: Node,
  groupGap?: string | number,
): number {
  const flag = (node as { gap?: unknown }).gap;
  if (typeof flag === "string" || typeof flag === "number") {
    // (1) per-child override — a spacing token (raw px tolerated)
    return resolveSpacing(flag as SpacingToken | number) ?? DEFAULT_ROW_GAP_PX;
  }
  if (groupGap !== undefined) {
    // (2) group-level override — applies to every child that doesn't set its own
    return resolveSpacing(groupGap as SpacingToken | number) ?? DEFAULT_ROW_GAP_PX;
  }
  const override = GAP_OVERRIDES[node.type];
  if (override !== undefined) return resolveSpacing(override) ?? DEFAULT_ROW_GAP_PX; // (3) per-type
  return DEFAULT_ROW_GAP_PX; // (3) page default — inherited rhythm
}

/**
 * Wrap one VERTICAL group_config child in the page's vertical rhythm. Margin is
 * symmetric per side (top + bottom = `resolveGroupRowGap`), mirroring `GutterItem`,
 * so children stack on the same rhythm as top-level page items. The FIRST child's
 * top and the LAST child's bottom are zeroed: the group node itself sits inside a
 * page `GutterItem` that owns the group's OUTER spacing, so a plain (cardless)
 * group is spacing-transparent — its children space exactly as if inlined at the
 * page level, with no doubled gutter at the group's edges. No horizontal gutter:
 * the group owns horizontal layout (Box `direction` / `align` / `justify`).
 */
export function GroupGutterItem({
  node,
  index,
  count,
  groupGap,
  children,
}: {
  node: Node;
  index: number;
  count: number;
  groupGap?: string | number;
  children: React.ReactNode;
}): React.ReactElement {
  const gap = resolveGroupRowGap(node, groupGap);
  return (
    <View
      style={{
        marginTop: index === 0 ? 0 : gap,
        marginBottom: index === count - 1 ? 0 : gap,
      }}
    >
      {children}
    </View>
  );
}
