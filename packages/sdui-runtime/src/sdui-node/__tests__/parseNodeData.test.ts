import { test } from "node:test";
import assert from "node:assert/strict";
import { z, ZodError } from "zod";
import { parseNodeData } from "../parseNodeData.ts";

const SampleSchema = z.object({
  title: z.string(),
  count: z.number().int(),
});

test("parseNodeData — returns ok=true with parsed value on valid input", () => {
  const result = parseNodeData(SampleSchema, { title: "hi", count: 3 });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("type guard");
  assert.deepEqual(result.value, { title: "hi", count: 3 });
});

test("parseNodeData — returns ok=false with ZodError on shape mismatch", () => {
  const result = parseNodeData(SampleSchema, { title: 42, count: "nope" });
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("type guard");
  assert.ok(result.error instanceof ZodError);
  assert.ok(result.error.issues.length >= 1);
});

test("parseNodeData — returns ok=false on missing required fields", () => {
  const result = parseNodeData(SampleSchema, {});
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("type guard");
  const paths = result.error.issues.map((i) => i.path.join("."));
  assert.ok(paths.includes("title"));
  assert.ok(paths.includes("count"));
});

test("parseNodeData — returns ok=false on null / undefined input", () => {
  assert.equal(parseNodeData(SampleSchema, null).ok, false);
  assert.equal(parseNodeData(SampleSchema, undefined).ok, false);
});

test("parseNodeData — re-throws non-Zod errors", () => {
  const throwingSchema = {
    parse: () => {
      throw new TypeError("not a zod error");
    },
  } as unknown as z.ZodTypeAny;
  assert.throws(
    () => parseNodeData(throwingSchema, {}),
    /not a zod error/,
  );
});

test("parseNodeData — strips unknown fields per the schema's transform rules", () => {
  const strict = z.object({ title: z.string() }).strip();
  const result = parseNodeData(strict, { title: "x", extra: "y" });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("type guard");
  assert.deepEqual(result.value, { title: "x" });
});
