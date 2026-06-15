import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveRequestRefs,
  normalizeQueryParams,
  bindRequestPayload,
} from "../resolve-request-refs.ts";

const LOCAL = {
  selected_tab: "active",
  selected_filters: ["beauty", "wellness"],
  search: "lipstick",
  empty_filters: [] as string[],
};

test("resolveRequestRefs — resolves nested ref-objects against local context", () => {
  const out = resolveRequestRefs(
    {
      tab: { ref: "$.local.selected_tab" },
      filters: { ref: "$.local.selected_filters" },
      static: "keep",
    },
    { local: LOCAL },
  );
  assert.deepEqual(out, {
    tab: "active",
    filters: ["beauty", "wellness"],
    static: "keep",
  });
});

test("resolveRequestRefs — leaves literals untouched, recurses arrays", () => {
  const out = resolveRequestRefs(
    { list: [{ ref: "$.local.search" }, "raw"] },
    { local: LOCAL },
  );
  assert.deepEqual(out, { list: ["lipstick", "raw"] });
});

test("normalizeQueryParams — arrays become CSV, scalars String()-ed", () => {
  const out = normalizeQueryParams({ tab: "active", page: 2, filter: ["a", "b"] });
  assert.deepEqual(out, { tab: "active", page: "2", filter: "a,b" });
});

test("normalizeQueryParams — null/undefined and empty arrays are dropped", () => {
  const out = normalizeQueryParams({
    a: null,
    b: undefined,
    c: [],
    d: "x",
  });
  assert.deepEqual(out, { d: "x" });
});

test("bindRequestPayload — string-coerces query_params (incl. CSV), resolves from local", () => {
  const bound = bindRequestPayload(
    {
      endpoint: "creator.campaigns.list",
      query_params: {
        tab: { ref: "$.local.selected_tab" },
        filter: { ref: "$.local.selected_filters" },
      },
    },
    LOCAL,
  );
  assert.deepEqual(bound.query_params, { tab: "active", filter: "beauty,wellness" });
  // Non-request fields are preserved unchanged.
  assert.equal(bound.endpoint, "creator.campaigns.list");
});

test("bindRequestPayload — request_body keeps arrays/types (no string coercion)", () => {
  const bound = bindRequestPayload(
    { request_body: { filters: { ref: "$.local.selected_filters" }, n: 3 } },
    LOCAL,
  );
  assert.deepEqual(bound.request_body, { filters: ["beauty", "wellness"], n: 3 });
});

test("bindRequestPayload — an empty multi-select drops the query param", () => {
  const bound = bindRequestPayload(
    { query_params: { filter: { ref: "$.local.empty_filters" } } },
    LOCAL,
  );
  assert.deepEqual(bound.query_params, {});
});

test("bindRequestPayload — does not mutate the input payload", () => {
  const input = { query_params: { tab: { ref: "$.local.selected_tab" } } };
  const snapshot = JSON.stringify(input);
  bindRequestPayload(input, LOCAL);
  assert.equal(JSON.stringify(input), snapshot);
});

test("bindRequestPayload — undefined/absent payload yields empty object", () => {
  assert.deepEqual(bindRequestPayload(undefined, LOCAL), {});
});
