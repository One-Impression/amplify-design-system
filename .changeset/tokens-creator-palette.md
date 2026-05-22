---
"@amplify-ai/tokens-creator": minor
---

feat(tokens-creator): add palette semantic alias module

Adds the `palette` export — a hand-curated semantic alias map for BFF and app
consumers. Maps engineer-friendly names (`palette.text.strong`) to canonical
SDUI token names (`"sdui.color.neutral-strong"`) across all 7 token families
(color, font-size, font-weight, spacing, radius, icon-size, border-width).
Build-time validator ensures every alias resolves in every theme JSON.

New export path: `@amplify-ai/tokens-creator/palette`. Consumers replace
inline token strings and local `const color = {...}` duplication with
`import { palette } from "@amplify-ai/tokens-creator/palette"`. Theme
resolution stays entirely client-side; the BFF emits palette names and the
renderer paints the theme-correct value at paint time.
