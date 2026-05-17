---
"@amplify-ai/tokens-creator": minor
---

feat(tokens-creator): extend sdui.* token contract + icon manifest pipeline

Adds sdui.spacing, sdui.font-size, sdui.font-weight, sdui.icon-size, sdui.radius,
sdui.border-width, and sdui.component.button token sections for the creator SDUI rebuild.

Adds build-icons.ts pipeline that generates dist/icons/manifest.json, essentials.json,
version.txt, and manifest.d.ts from SVG source files in icons/.
