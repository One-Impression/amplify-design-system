import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeNode } from "../normalize-node.ts";
import type { Node } from "@one-impression/sdk-native-sdui";

/**
 * The Node type from the schema package is strict about `data`, but the
 * normalizer's whole job is to defend against payloads that violate it.
 * We cast through `unknown` so the tests can construct the legacy shape.
 */
function asNode(value: unknown): Node {
  return value as Node;
}

test("normalizeNode — node with valid data passes through unchanged", () => {
  const node = asNode({
    id: "n1",
    type: "creator.ui_component.text",
    data: { text: "hello" },
  });

  const result = normalizeNode(node);

  assert.equal(result.didNormalize, false);
  // Same reference — no clone needed on the happy path.
  assert.equal(result.normalized, node);
  assert.deepEqual(
    (result.normalized as Node & { data?: unknown }).data,
    { text: "hello" },
  );
});

test("normalizeNode — node with only props gets normalized to data", () => {
  const node = asNode({
    id: "n2",
    type: "creator.ui_component.text",
    props: { text: "legacy emit" },
  });

  const result = normalizeNode(node);

  assert.equal(result.didNormalize, true);
  const out = result.normalized as Node & {
    data?: unknown;
    props?: unknown;
  };
  assert.deepEqual(out.data, { text: "legacy emit" });
  // The legacy `props` key is stripped so downstream renderers don't see
  // the stale shape and double-resolve it.
  assert.equal(out.props, undefined);
  assert.equal(out.id, "n2");
  assert.equal(out.type, "creator.ui_component.text");
});

test("normalizeNode — node with both data and props keeps data (never overwrite)", () => {
  const node = asNode({
    id: "n3",
    type: "creator.ui_component.text",
    data: { text: "canonical" },
    props: { text: "stale duplicate" },
  });

  const result = normalizeNode(node);

  // didNormalize stays false: we never overwrite a valid `data`.
  assert.equal(result.didNormalize, false);
  assert.deepEqual(
    (result.normalized as Node & { data?: unknown }).data,
    { text: "canonical" },
  );
});

test("normalizeNode — node with neither data nor props is untouched", () => {
  const node = asNode({
    id: "n4",
    type: "creator.ui_component.separator",
  });

  const result = normalizeNode(node);

  assert.equal(result.didNormalize, false);
  assert.equal(result.normalized, node);
});

test("normalizeNode — input node is not mutated when normalizing", () => {
  const node = asNode({
    id: "n5",
    type: "creator.ui_component.text",
    props: { text: "legacy" },
  });

  const before = JSON.stringify(node);
  normalizeNode(node);
  const after = JSON.stringify(node);

  assert.equal(before, after);
});
