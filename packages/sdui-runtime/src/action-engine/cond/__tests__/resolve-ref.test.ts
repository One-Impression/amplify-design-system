import { test } from "node:test";
import assert from "node:assert/strict";
import { isRefObject, resolveValue } from "../resolve-ref.ts";

test("isRefObject — recognises $.-prefixed ref", () => {
  assert.equal(isRefObject({ ref: "$.now" }), true);
  assert.equal(isRefObject({ ref: "$.payload.id" }), true);
});

test("isRefObject — rejects non-$ refs and non-objects", () => {
  assert.equal(isRefObject({ ref: "bogus" }), false);
  assert.equal(isRefObject({ ref: 42 }), false);
  assert.equal(isRefObject("string"), false);
  assert.equal(isRefObject(null), false);
  assert.equal(isRefObject(undefined), false);
});

test("resolveValue — literal pass-through", () => {
  assert.equal(resolveValue("hello"), "hello");
  assert.equal(resolveValue(42), 42);
  assert.deepEqual(resolveValue({ a: 1 }), { a: 1 });
});

test("resolveValue — $.now uses injected clock", () => {
  const out = resolveValue({ ref: "$.now" }, { now: () => 1_700_000_000_000 });
  assert.equal(out, 1_700_000_000_000);
});

test("resolveValue — $.now_minus_seconds shifts past", () => {
  const out = resolveValue(
    { ref: "$.now_minus_seconds", n: 60 },
    { now: () => 1_700_000_000_000 },
  );
  assert.equal(out, 1_700_000_000_000 - 60_000);
});

test("resolveValue — $.now_minus_seconds without n resolves to null", () => {
  const out = resolveValue({ ref: "$.now_minus_seconds" });
  assert.equal(out, null);
});

test("resolveValue — $.response.<path> dotted pluck", () => {
  const ctx = { response: { user: { id: "u1", name: "alice" } } };
  assert.equal(resolveValue({ ref: "$.response.user.id" }, ctx), "u1");
  assert.equal(resolveValue({ ref: "$.response.user.name" }, ctx), "alice");
});

test("resolveValue — $.payload.<path> dotted pluck", () => {
  const ctx = { payload: { order: { id: "o1" } } };
  assert.equal(resolveValue({ ref: "$.payload.order.id" }, ctx), "o1");
});

test("resolveValue — array index lookup", () => {
  const ctx = { response: { items: [{ id: "a" }, { id: "b" }] } };
  assert.equal(resolveValue({ ref: "$.response.items.1.id" }, ctx), "b");
});

test("resolveValue — missing path resolves to null", () => {
  const ctx = { response: { user: { id: "u1" } } };
  assert.equal(resolveValue({ ref: "$.response.user.email" }, ctx), null);
  assert.equal(resolveValue({ ref: "$.response.user.tags.0" }, ctx), null);
});

test("resolveValue — missing context resolves to null", () => {
  assert.equal(resolveValue({ ref: "$.response.foo" }), null);
  assert.equal(resolveValue({ ref: "$.payload.foo" }), null);
});

test("resolveValue — unknown ref form resolves to null", () => {
  assert.equal(resolveValue({ ref: "$.unknown_form" }), null);
});
