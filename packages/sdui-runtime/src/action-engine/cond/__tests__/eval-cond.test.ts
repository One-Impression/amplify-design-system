import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateCond } from "../eval-cond.ts";
import type { Cond } from "@one-impression/sdk-native-sdui/actions";

const reader = (state: Record<string, unknown>) => (key: string) => state[key];

test("cond:local exists — present key resolves truthy", () => {
  const cond: Cond = { type: "cond:local", key: "auth.token", op: "exists" };
  assert.equal(evaluateCond(cond, reader({ "auth.token": "abc" })), true);
});

test("cond:local exists — missing key resolves false", () => {
  const cond: Cond = { type: "cond:local", key: "auth.token", op: "exists" };
  assert.equal(evaluateCond(cond, reader({})), false);
});

test("cond:local exists — explicit null reads as missing", () => {
  const cond: Cond = { type: "cond:local", key: "auth.token", op: "exists" };
  assert.equal(evaluateCond(cond, reader({ "auth.token": null })), false);
});

test("cond:local not_exists — missing key resolves true", () => {
  const cond: Cond = {
    type: "cond:local",
    key: "session.id",
    op: "not_exists",
  };
  assert.equal(evaluateCond(cond, reader({})), true);
});

test("cond:local eq — string match", () => {
  const cond: Cond = {
    type: "cond:local",
    key: "user.role",
    op: "eq",
    value: "admin",
  };
  assert.equal(evaluateCond(cond, reader({ "user.role": "admin" })), true);
  assert.equal(evaluateCond(cond, reader({ "user.role": "viewer" })), false);
});

test("cond:local ne — inequality", () => {
  const cond: Cond = {
    type: "cond:local",
    key: "feature.tier",
    op: "ne",
    value: "free",
  };
  assert.equal(evaluateCond(cond, reader({ "feature.tier": "pro" })), true);
  assert.equal(evaluateCond(cond, reader({ "feature.tier": "free" })), false);
});

test("cond:local gt — numeric coercion", () => {
  const cond: Cond = {
    type: "cond:local",
    key: "count",
    op: "gt",
    value: 5,
  };
  assert.equal(evaluateCond(cond, reader({ count: 10 })), true);
  assert.equal(evaluateCond(cond, reader({ count: 3 })), false);
  assert.equal(evaluateCond(cond, reader({ count: "20" })), true);
});

test("cond:local gt — non-numeric resolves false (no implicit truthiness)", () => {
  const cond: Cond = {
    type: "cond:local",
    key: "name",
    op: "gt",
    value: 0,
  };
  assert.equal(evaluateCond(cond, reader({ name: "alice" })), false);
});

test("cond:local gte / lte boundary", () => {
  const gte: Cond = { type: "cond:local", key: "n", op: "gte", value: 5 };
  const lte: Cond = { type: "cond:local", key: "n", op: "lte", value: 5 };
  assert.equal(evaluateCond(gte, reader({ n: 5 })), true);
  assert.equal(evaluateCond(lte, reader({ n: 5 })), true);
});

test("cond:local eq — structural equality across plain objects", () => {
  const cond: Cond = {
    type: "cond:local",
    key: "filters",
    op: "eq",
    value: { tier: "pro", country: "in" },
  };
  assert.equal(
    evaluateCond(cond, reader({ filters: { tier: "pro", country: "in" } })),
    true,
  );
  assert.equal(
    evaluateCond(cond, reader({ filters: { tier: "free", country: "in" } })),
    false,
  );
});

test("evaluateCond — unknown discriminator fails closed (false)", () => {
  const cond = { type: "cond:remote", key: "x", op: "eq" } as unknown as Cond;
  assert.equal(evaluateCond(cond, reader({})), false);
});
