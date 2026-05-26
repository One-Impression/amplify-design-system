import { test } from "node:test";
import assert from "node:assert/strict";
import { extractFeedPageData } from "../extractFeedPageData.ts";

test("returns empty object for undefined data", () => {
  assert.deepEqual(extractFeedPageData(undefined), {});
});

test("returns empty object for null data", () => {
  assert.deepEqual(extractFeedPageData(null), {});
});

test("returns empty object for primitive data", () => {
  assert.deepEqual(extractFeedPageData("hello"), {});
  assert.deepEqual(extractFeedPageData(42), {});
});

test("passes through filters / on_load_more / loader / empty_state", () => {
  const input = {
    filters: [{ id: "f1", type: "creator.snippet.chip", data: {} }],
    on_load_more: { type: "bff_call", payload: {} },
    loader: { id: "l", type: "creator.snippet.loader", data: {} },
    empty_state: { id: "e", type: "creator.snippet.empty_state", data: {} },
  };
  const out = extractFeedPageData(input);
  assert.equal(out.filters?.length, 1);
  assert.ok(out.on_load_more);
  assert.equal(out.loader?.id, "l");
  assert.equal(out.empty_state?.id, "e");
});

test("reads config.gradient", () => {
  const out = extractFeedPageData({
    config: {
      gradient: {
        angle: 180,
        colors: ["#FF0000", "#00FF00"],
        screen_portion: 400,
      },
    },
  });
  assert.equal(out.config?.gradient?.angle, 180);
  assert.deepEqual(out.config?.gradient?.colors, ["#FF0000", "#00FF00"]);
  assert.equal(out.config?.gradient?.screen_portion, 400);
});

test("reads config.bg_color and config.scroll_header_color", () => {
  const out = extractFeedPageData({
    config: {
      bg_color: { type: "neutralInverse" },
      scroll_header_color: { type: "primary" },
    },
  });
  assert.equal(out.config?.bg_color?.type, "neutralInverse");
  assert.equal(out.config?.scroll_header_color?.type, "primary");
});

test("reads footer slot", () => {
  const out = extractFeedPageData({
    footer: {
      id: "home-footer",
      type: "creator.snippet.tabs_footer",
      data: { items: [], active_index: 0 },
    },
  });
  assert.equal(out.footer?.id, "home-footer");
  assert.equal(out.footer?.type, "creator.snippet.tabs_footer");
});

test("missing config + footer leaves them undefined (no regression)", () => {
  const out = extractFeedPageData({
    filters: [],
    loader: { id: "l", type: "creator.snippet.loader", data: {} },
  });
  assert.equal(out.config, undefined);
  assert.equal(out.footer, undefined);
});
