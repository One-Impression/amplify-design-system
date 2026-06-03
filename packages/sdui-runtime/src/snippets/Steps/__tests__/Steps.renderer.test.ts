import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

/**
 * Source-text regression: StepsRenderer must use the semantic tokens
 * (`"primary"` / `"neutralWeak"`) supplied by `@one-impression/tokens-creator`
 * rather than hex literals. We can't render the component under
 * `node:test` (it transitively imports the React Native renderer chain
 * which isn't available in the workspace), so we assert against the
 * compiled-but-not-yet-built source text.
 *
 * If you change this file, also update the snippet renderer to keep
 * the contract in sync.
 */

const here = dirname(fileURLToPath(import.meta.url));
const rendererPath = resolve(here, "../Steps.renderer.tsx");
const source = readFileSync(rendererPath, "utf8");

test("StepsRenderer — uses `primary` token for active step (not #6531FF / #7C3AED)", () => {
  assert.ok(
    source.includes('"primary"'),
    "Steps.renderer.tsx should reference the `primary` token by name",
  );
  // Either of the historical hex values would defeat dark-mode /
  // brand-switching support — block both.
  assert.equal(
    source.includes("#6531FF"),
    false,
    "Steps.renderer.tsx must not contain the raw hex #6531FF",
  );
  assert.equal(
    source.includes("#7C3AED"),
    false,
    "Steps.renderer.tsx must not contain the raw hex #7C3AED",
  );
});

test("StepsRenderer — uses `neutralWeak` token for inactive step (not #E0E0E0 / #D6D3D1)", () => {
  assert.ok(
    source.includes('"neutralWeak"'),
    "Steps.renderer.tsx should reference the `neutralWeak` token by name",
  );
  assert.equal(
    source.includes("#E0E0E0"),
    false,
    "Steps.renderer.tsx must not contain the raw hex #E0E0E0",
  );
  assert.equal(
    source.includes("#D6D3D1"),
    false,
    "Steps.renderer.tsx must not contain the raw hex #D6D3D1",
  );
});

test("StepsRenderer — bg expression chooses between the two tokens by step index", () => {
  // The exact line: bg={i < v.current ? "primary" : "neutralWeak"}
  // We don't pin spacing, just the conditional shape.
  const expr =
    /bg=\{\s*i\s*<\s*v\.current\s*\?\s*"primary"\s*:\s*"neutralWeak"\s*\}/;
  assert.match(source, expr);
});
