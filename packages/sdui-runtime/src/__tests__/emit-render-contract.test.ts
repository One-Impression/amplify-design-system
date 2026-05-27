/**
 * Emit→render contract test (CR-WF3).
 *
 * Catches builder↔renderer drift in CI instead of on the simulator. The gateway
 * BFF builds SDUI wire payloads with `@one-impression/sdk-native-sdui` builders;
 * the runtime renderers in this package read fields off those built shapes. When
 * the two disagree (e.g. a renderer reads `data.label.data.text` while the schema
 * declares `data.label` as a flat `TextSchema`), the home page crashes on-device.
 *
 * Scope (pragmatic — the SDUI node types the home page uses): for each home node
 * type we (a) build a node via the sdk-native-sdui builder, (b) assert it parses
 * against its sdk-native-sdui schema (round-trip), and (c) for the label-bearing
 * components assert the exact field the renderer reads exists on the built shape —
 * specifically that `data.label` is a flat `TextSchema` (`data.label.text` is a
 * string) and NOT a nested node (`data.label.data` must be undefined).
 *
 * NOTE: this is intentionally a contract/shape test, not a full render harness.
 * The renderers import `@one-impression/ui-native` (React Native), which the
 * `node:test` + esbuild runner cannot transform, so we cannot mount renderers
 * here. This test should expand to per-renderer field coverage (e.g. via a
 * jsdom/RN preset) for the remaining node types; today it locks the label-shape
 * regression (FIX 1) plus a schema round-trip for the full home node set.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  // builders
  tab,
  chip,
  tagComponent,
  card,
  section,
  loader,
  pageHeader,
  groupChips,
  infoRow,
  bannerImage,
  infoBreakdownRow,
  emptyState,
  tabsFooter,
  pageFeed,
  // schemas
  TabComponentSchema,
  ChipComponentSchema,
  TagComponentSchema,
  CardComponentSchema,
  SectionComponentSchema,
  LoaderSchema,
  PageHeaderSchema,
  GroupChipsSchema,
  InfoRowSchema,
  BannerImageSchema,
  InfoBreakdownRowSchema,
  EmptyStateSchema,
  TabsFooterSchema,
  PageSchema,
} from "@one-impression/sdk-native-sdui";

// ---------------------------------------------------------------------------
// (b) Schema round-trip — every home node builder emits a shape that parses
// against its own schema. If a builder drifts from its schema, this fails.
// ---------------------------------------------------------------------------

test("contract: home node builders round-trip through their schemas", () => {
  const builtTab = tab({ label: { text: "Explore" } });
  assert.equal(TabComponentSchema.safeParse(builtTab).success, true);

  const builtChip = chip({ label: { text: "All" } });
  assert.equal(ChipComponentSchema.safeParse(builtChip).success, true);

  const builtTag = tagComponent({ label: { text: "New" } });
  assert.equal(TagComponentSchema.safeParse(builtTag).success, true);

  const builtSection = section({ items: [builtChip] });
  assert.equal(SectionComponentSchema.safeParse(builtSection).success, true);

  const builtCard = card({ items: [builtTag] });
  assert.equal(CardComponentSchema.safeParse(builtCard).success, true);

  const builtLoader = loader({ variant: "circular" });
  assert.equal(LoaderSchema.safeParse(builtLoader).success, true);

  const builtHeader = pageHeader({ title: { text: "Home" } });
  assert.equal(PageHeaderSchema.safeParse(builtHeader).success, true);

  const builtGroupChips = groupChips({ items: [builtChip] });
  assert.equal(GroupChipsSchema.safeParse(builtGroupChips).success, true);

  const builtInfoRow = infoRow({ title: { text: "Earnings" } });
  assert.equal(InfoRowSchema.safeParse(builtInfoRow).success, true);

  const builtBanner = bannerImage({ image: { src: "https://x/y.png" } });
  assert.equal(BannerImageSchema.safeParse(builtBanner).success, true);

  const builtBreakdown = infoBreakdownRow({
    label: { text: "Total" },
    value: { text: "$100" },
  });
  assert.equal(InfoBreakdownRowSchema.safeParse(builtBreakdown).success, true);

  const builtEmpty = emptyState({ title: { text: "Nothing here" } });
  assert.equal(EmptyStateSchema.safeParse(builtEmpty).success, true);

  const builtTabsFooter = tabsFooter({ items: [builtTab] });
  assert.equal(TabsFooterSchema.safeParse(builtTabsFooter).success, true);
});

test("contract: page envelope (feed) round-trips through PageSchema", () => {
  const response = pageFeed({ id: "home", title: "Home" })
    .body(section({ items: [chip({ label: { text: "All" } })] }))
    .build();
  // The envelope the runtime renders is response.page.
  assert.equal(PageSchema.safeParse(response.page).success, true);
});

// ---------------------------------------------------------------------------
// (c) Label-shape regression (FIX 1) — the renderers read `v.label.text`.
// The schema declares `data.label` as a flat `TextSchema` ({ text, ... }), so
// the built node MUST expose `data.label.text` as a string and MUST NOT nest
// it under `data.label.data` (the old, crashing assumption).
// ---------------------------------------------------------------------------

test("contract: tab/chip/tag emit a FLAT data.label (label.text, NOT label.data)", () => {
  const builtTab = tab({ label: { text: "Explore" } });
  const builtChip = chip({ label: { text: "All" } });
  const builtTag = tagComponent({ label: { text: "New" } });

  for (const [name, node] of [
    ["tab", builtTab],
    ["chip", builtChip],
    ["tag", builtTag],
  ] as const) {
    const label = (node.data as { label: unknown }).label as Record<string, unknown>;
    assert.equal(
      typeof label.text,
      "string",
      `${name}: data.label.text must be a string (flat TextSchema)`,
    );
    assert.equal(
      "data" in label,
      false,
      `${name}: data.label must be flat — it must NOT have a nested .data (renderers read v.label.text)`,
    );
  }
});

test("contract: infoBreakdownRow emits flat data.label and data.value", () => {
  const node = infoBreakdownRow({ label: { text: "Total" }, value: { text: "$100" } });
  const data = node.data as { label: Record<string, unknown>; value: Record<string, unknown> };
  assert.equal(typeof data.label.text, "string");
  assert.equal("data" in data.label, false);
  assert.equal(typeof data.value.text, "string");
  assert.equal("data" in data.value, false);
});
