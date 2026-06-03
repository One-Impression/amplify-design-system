# Icons Source Directory

This directory holds the SVG source files for the `@one-impression/tokens-creator` icon manifest.

## Current state

Empty — placeholder only. The 226 SVGs need to be bulk-copied from the legacy app.

## How to populate

Copy all SVG icon files from the legacy creator app:

```bash
cp one_club_app/src/appLib/icons/*.svg packages/tokens-creator/icons/
```

Source location: `one_club_app/src/appLib/icons/` (226 SVGs as of the legacy audit).

## Naming convention

- File names must be kebab-case: `arrow-left.svg`, `check-circle.svg`
- The file name (minus `.svg`) becomes the icon name in `manifest.json`
- No spaces, no uppercase, no special characters beyond hyphens

## After populating

Run the icon build to generate the manifest:

```bash
npm run build:icons -w packages/tokens-creator
```

This produces:
- `dist/icons/manifest.json` — full icon catalog (`{ version, icons: { name: svgContent } }`)
- `dist/icons/essentials.json` — bootstrap subset (~10 most-used icons)
- `dist/icons/version.txt` — manifest version string
- `dist/icons/manifest.d.ts` — TypeScript `IconName` literal-union type
