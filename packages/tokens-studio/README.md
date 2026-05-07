# @amplify-ai/tokens-studio

Studio-specific design tokens — used only by `studio.amplify.club`. Inherits primitives from tokens-foundation; layers Studio cockpit semantics on top.

## What's in here

- **Cockpit chrome** (`--amp-studio-theme-color-{bg,fg,muted,border,accent}`) — the 5 surface/text/border/accent semantics that the `--studio-*` consumer aliases resolve to.
- **Layout dimensions** (`--amp-studio-theme-layout-{toolbar-h,drawer-h,drawer-h-open,pane-left-w}`) — the 4 chrome heights/widths that are intentional raw `px` per `magic-studio/CLAUDE.md` Rule 2.
- **Mirror / Map-mode voices** (`--amp-studio-theme-map-voice-{pixel,aria,heimdall,atlas,sentinel,penny,zara}`) — per-agent voice colours surfaced in the Council rail.
- **Status scale** (`--amp-studio-status-{success,warning,error}` + `-bg` variants) — replaces the 10 raw hex literals (`#10b981`, `#f59e0b`, `#d4524d`, …) called out in the Phase-0 audit.

## Usage

```css
/* magic-studio/src/app/globals.css */
@import "@amplify-ai/tokens-studio/css";

:root {
  /* Phase-D consumer aliases — keep byte-identical to avoid touching ~282 use sites. */
  --studio-bg:             var(--amp-studio-theme-color-bg);
  --studio-fg:             var(--amp-studio-theme-color-fg);
  --studio-muted:          var(--amp-studio-theme-color-muted);
  --studio-border:         var(--amp-studio-theme-color-border);
  --studio-accent:         var(--amp-studio-theme-color-accent);
  --studio-toolbar-h:      var(--amp-studio-theme-layout-toolbar-h);
  --studio-drawer-h:       var(--amp-studio-theme-layout-drawer-h);
  --studio-drawer-h-open:  var(--amp-studio-theme-layout-drawer-h-open);
  --studio-pane-left-w:    var(--amp-studio-theme-layout-pane-left-w);

  --mirror-voice-pixel:    var(--amp-studio-theme-map-voice-pixel);
  --mirror-voice-aria:     var(--amp-studio-theme-map-voice-aria);
  --mirror-voice-heimdall: var(--amp-studio-theme-map-voice-heimdall);
  --mirror-voice-atlas:    var(--amp-studio-theme-map-voice-atlas);
  --mirror-voice-sentinel: var(--amp-studio-theme-map-voice-sentinel);
  --mirror-voice-penny:    var(--amp-studio-theme-map-voice-penny);
  --mirror-voice-zara:     var(--amp-studio-theme-map-voice-zara);
}
```

Status badges then reference `var(--amp-studio-status-success)` etc. directly — no consumer alias needed because they're new (replacing raw hex).

## Outputs

`build.js` delegates to the shared `scripts/build-tokens.js` and emits five artifacts under `dist/`:

| File | Purpose |
|---|---|
| `variables.css`  | CSS custom properties for `:root` + `[data-theme="dark"]` overrides |
| `variables.scss` | Same tokens as SCSS variables |
| `tokens.json`    | Flat JSON map (machine-consumable) |
| `tokens.js`      | ES-module exports (camelCase) |
| `tailwind.css`   | Tailwind v4 `@theme` preset |

## Provenance

The 16 lifted variables were sourced verbatim from the Phase-0 token audit
(`magic-studio/docs/audits/phase-0-tokens.md`). Phase D in `magic-studio` swaps the in-repo
`:root { --studio-* / --mirror-* }` definitions for an `@import "@amplify-ai/tokens-studio/css"`
plus the consumer-alias block above.
