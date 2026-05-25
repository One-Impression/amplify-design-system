# Palette — semantic token alias module (design proposal)

> **Status:** design proposal — implementation follows engineer sign-off on shape.
> **Principle:** Design tokens must originate from the design system package, not from BFF or app handler code. This module is the single source of truth for semantic token aliases (`text.strong`, `font.lg`, `radius.md`) consumed by BFF handlers, so theme resolution stays entirely client-side and the BFF never knows which theme is active.
> **Why design-doc-first:** the shape has several decisions that benefit from review before implementation. The actual code is ~150 LOC across `palette.js`, a build-time validator, and the export wiring — small once the shape is locked, painful if reshaped mid-implementation.

## The problem this solves

amplify-gateway BFF handlers currently redefine local design-token aliases:

```ts
// repeated across 10 creator handlers today
const color = {
  textStrong: "sdui.color.text-neutral-strong",
  textMedium: "sdui.color.text-neutral-medium",
  surface:    "sdui.color.surface",
  border:     "sdui.color.border-neutral",
  // ...
};
```

Plus ~300 inline raw token strings (`"sdui.font-size.xxl"`, `"sdui.radius.lg"`) scattered across handlers. Audit numbers from 2026-05-22 BFF code:

- 10 handlers in `amplify-gateway/src/clients/creator/handlers/*` each define their own `const color = {...}` map (drift surface = N×M)
- ~301 places using fully-qualified token strings directly
- ~31 unique SDUI token strings across the 6 token families

Every token rename in `theme-light.json` / `theme-dark.json` breaks N places in the BFF. Every new BFF handler re-derives the same color shorthand.

## The principle

Three layers — and only ONE owns the semantic palette:

| Layer | Owner today | Owner under this proposal |
|---|---|---|
| Token values (hex/px/rem) | `amplify-design-system/packages/tokens-creator/tokens/theme-*.json` | Unchanged |
| Token contract (regex/literal Zod schemas) | `amplify-schemas/packages/sdk-native-sdui/src/schemas/tokens.ts` | Unchanged |
| **Semantic palette** (`textStrong → "sdui.color.text-neutral-strong"`) | **Duplicated per-handler in amplify-gateway** | **New `palette.js` export in `@one-impression/tokens-creator`** |

Theme resolution stays entirely client-side. The BFF imports the palette and emits canonical token *names*; the renderer resolves the name → theme-correct *value* at paint time. **The BFF must never know which theme is active and must never branch on theme.**

## Proposed shape

### 1. New module `packages/tokens-creator/palette.js`

A static, hand-curated JS module that exports a nested const object mapping semantic shortnames to canonical token strings:

```js
// packages/tokens-creator/palette.js
// Generated tests assert every token-string value below resolves in every theme JSON.
// Hand-maintained: add an entry here when a BFF or app legitimately needs a new semantic alias.

export const palette = {
  text: {
    strong: "sdui.color.text-neutral-strong",
    medium: "sdui.color.text-neutral-medium",
    weak:   "sdui.color.text-neutral-weak",
    faint:  "sdui.color.text-neutral-faint",
    inverse:"sdui.color.neutral-inverse",
  },
  surface: {
    base:    "sdui.color.surface",
    raised:  "sdui.color.bg-raised",
    border:  "sdui.color.border-neutral",
  },
  brand: {
    primary:     "sdui.color.primary",
    primaryWeak: "sdui.color.primary-weak",
  },
  status: {
    positive:     "sdui.color.positive",
    positiveWeak: "sdui.color.positive-weak",
    notice:       "sdui.color.notice",
    noticeWeak:   "sdui.color.notice-weak",
    negative:     "sdui.color.negative",
    negativeWeak: "sdui.color.negative-weak",
  },
  font: {
    xs:    "sdui.font-size.xs",
    sm:    "sdui.font-size.sm",
    md:    "sdui.font-size.md",
    lg:    "sdui.font-size.lg",
    xl:    "sdui.font-size.xl",
    xxl:   "sdui.font-size.xxl",
    xxxl:  "sdui.font-size.xxxl",
  },
  weight: {
    regular:  "sdui.font-weight.regular",
    medium:   "sdui.font-weight.medium",
    semibold: "sdui.font-weight.semibold",
    bold:     "sdui.font-weight.bold",
  },
  spacing: {
    xs:    "sdui.spacing.xs",
    sm:    "sdui.spacing.sm",
    md:    "sdui.spacing.md",
    lg:    "sdui.spacing.lg",
    xl:    "sdui.spacing.xl",
    xxl:   "sdui.spacing.xxl",
    xxxl:  "sdui.spacing.xxxl",
  },
  radius: {
    none: "sdui.radius.none",
    xs:   "sdui.radius.xs",
    sm:   "sdui.radius.sm",
    md:   "sdui.radius.md",
    lg:   "sdui.radius.lg",
    xl:   "sdui.radius.xl",
    full: "sdui.radius.full",
  },
  icon: {
    sm: "sdui.icon-size.sm",
    md: "sdui.icon-size.md",
    lg: "sdui.icon-size.lg",
    xl: "sdui.icon-size.xl",
  },
  borderWidth: {
    none:   "sdui.border-width.none",
    thin:   "sdui.border-width.thin",
    medium: "sdui.border-width.medium",
    thick:  "sdui.border-width.thick",
  },
} as const;
```

Covers all six token families currently in `theme-light.json` / `theme-dark.json`: color, font-size, font-weight, spacing, radius, icon-size, border-width.

### 2. Type declaration `packages/tokens-creator/palette.d.ts`

Generated (or hand-written) `.d.ts` for the palette so BFF + SDK consumers get autocomplete and structural typing:

```ts
export type SduiToken = string & { __brand: "SduiToken" };

export interface Palette {
  text: { strong: SduiToken; medium: SduiToken; weak: SduiToken; faint: SduiToken; inverse: SduiToken };
  surface: { base: SduiToken; raised: SduiToken; border: SduiToken };
  // ... etc
}

export const palette: Palette;
```

### 3. Package export — `packages/tokens-creator/package.json`

Add a new export path:

```diff
   "exports": {
     "./css": "./dist/variables.css",
     "./tailwind": "./dist/tailwind.css",
     "./json": "./dist/tokens.json",
     "./js": "./dist/tokens.js",
     "./react-native": "./dist/tokens.native.js",
+    "./palette": { "types": "./palette.d.ts", "default": "./palette.js" },
     "./icons": "./dist/icons/manifest.json",
     ".": "./dist/tokens.js"
   }
```

Consumers import as:

```ts
import { palette } from "@one-impression/tokens-creator/palette";

return sdui.pageHeader({
  title: { text: "Explore", color: palette.text.strong },
  paddingTop: palette.spacing.md,
});
```

### 4. Build-time invariant — `packages/tokens-creator/scripts/validate-palette.js`

Asserts every token string in `palette.js` resolves to a concrete value in EVERY theme JSON. Fails the build if a palette entry references a token name that doesn't exist in any active theme.

```js
// scripts/validate-palette.js — runs as part of `node build.js`
import { palette } from '../palette.js';
import lightTheme from '../tokens/theme-light.json' assert { type: 'json' };
import darkTheme  from '../tokens/theme-dark.json' assert { type: 'json' };

const themes = { 'theme-light': lightTheme, 'theme-dark': darkTheme };
const allPaletteTokens = collectLeaves(palette);  // ['sdui.color.text-neutral-strong', ...]

for (const [themeName, themeJson] of Object.entries(themes)) {
  for (const tokenPath of allPaletteTokens) {
    const resolved = lookup(themeJson, tokenPath);
    if (resolved === undefined) {
      console.error(`PALETTE BUILD FAILED: ${tokenPath} not found in ${themeName}.json`);
      process.exit(1);
    }
  }
}
console.log(`✓ palette: ${allPaletteTokens.length} entries × ${Object.keys(themes).length} themes — all resolve`);
```

Wired into `build.js`:

```diff
 import { execSync } from 'child_process';
 import { dirname, join } from 'path';
 import { fileURLToPath } from 'url';

 const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
+execSync(`node ${join(import.meta.dirname, 'scripts/validate-palette.js')}`, { stdio: 'inherit' });
 execSync(`node ${join(root, 'scripts/build-tokens.js')} creator`, { stdio: 'inherit' });
```

### 5. Tests — `packages/tokens-creator/palette.test.js`

Lightweight sanity tests:

- Every leaf value matches `/^sdui\.[a-z-]+\.[a-z0-9-]+$/`
- Every leaf value resolves in `theme-light.json` AND `theme-dark.json` (mirrors the build-time check but as a unit test for CI)
- Snapshot the palette object shape — prevents accidental rename / removal of a public entry (which would break downstream BFFs)

## Open decisions for review (please confirm before implementation)

1. **Module location: `palette.js` vs `dist/palette.js`?**
   I propose **top-level `palette.js`** (NOT in `dist/`) because:
   - It's hand-maintained, not build-generated
   - Lives alongside `build.js` and `package.json` — clearly source, not artifact
   - The `.d.ts` sits next to it
   - `dist/` stays as build output only

2. **Per-product palettes vs single palette?**
   The org has multiple `tokens-*` packages (brand, atmosphere, creator, marketing, etc.). Each has its own theme JSONs. Question:
   - **(a)** One palette per package — `@one-impression/tokens-creator/palette`, `@one-impression/tokens-brand/palette`, etc. — each curates the names that product's BFFs use.
   - **(b)** Shared `@one-impression/sdui-palette` package — one universal palette, all themes from all packages must satisfy it.

   I lean **(a)** — keeps palette scoped to its product, allows per-product semantic differences (e.g. creator's "energy" color might not exist in brand). Initial implementation adds the palette only to `tokens-creator` since that's the first consumer. Other packages get their own palette module when their consumers need one.

3. **Naming convention for nested palette keys?**
   - **(a)** Multi-level dotted: `palette.text.strong`, `palette.status.positiveWeak` (PROPOSED).
   - **(b)** Flat camelCase: `palette.textStrong`, `palette.statusPositiveWeak`.

   I lean **(a)** — better autocomplete, scales as more semantic groups are added. Flat could be added later as a re-export if engineers prefer.

4. **What to do about token-NAMES vs token-PATHS?**
   The theme JSON nests as `sdui.color.text-neutral-strong` — that's `sdui` → `color` → `text-neutral-strong`. The palette emits the dotted string. The renderer reads the string and walks the same path. **No build transformation needed** — the dotted string IS the token name as it appears in the dist tokens.js.

   Open: do we want to expose the token paths in a typed-union form (e.g. `type SduiColorToken = "sdui.color.text-neutral-strong" | "sdui.color.text-neutral-medium" | ...`)? If yes, that's auto-generated from the theme JSONs as a separate build step. Out of scope for the initial palette module but worth flagging as a follow-on.

5. **Where does palette versioning come from?**
   The palette's shape is part of the public API of `@one-impression/tokens-creator`. A breaking change (renaming `palette.text.strong` to `palette.color.text.strong`) needs a major version bump. Test #5.3 (snapshot) catches accidental breakage; intentional breaking changes go through normal package versioning.

6. **What about palette additions that DON'T resolve in a theme yet?**
   Build-time check fails. The fix order is: theme JSON gets the new token → palette gets the alias → BFFs consume. NOT: palette gets the alias → BFFs consume → theme gets backfilled (BFF ships broken in the meantime).

## Implementation effort estimate

- `palette.js` + `palette.d.ts`: 30 LOC + 30 LOC = 60 LOC
- `scripts/validate-palette.js`: ~50 LOC
- `palette.test.js`: ~80 LOC
- `build.js` wiring: 1 LOC
- `package.json` export: 1 LOC
- Total: ~200 LOC, ~2 hours focused work post-design-approval

## Out of scope for the initial palette module

- BFF migration to use the palette (separate PR per BFF — first one is on `amplify-gateway` once this lands)
- Per-product palettes for `tokens-brand`, `tokens-atmosphere`, etc. (each gets its own PR when their consumers need it)
- Type-union of all theme token names (separate build step, separate PR)
- Migration of inline token strings in existing BFF code to palette references (separate PR per sub-module, scheduled by the consuming repo's roadmap)

## Approval gate

Once decisions 1–5 above are confirmed, I'll author the implementation PR. Default if not overridden: my recommendations as written.
