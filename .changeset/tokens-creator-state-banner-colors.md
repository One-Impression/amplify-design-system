---
"@one-impression/tokens-creator": minor
---

feat(tokens-creator): state-banner color tokens for campaign/opportunity lifecycle stripes

Adds four bg + text token pairs to the `sdui.color.*` namespace and surfaces them through a new `palette.state.*` group. These are reserved for the persistent banner that communicates where a campaign / opportunity sits in its lifecycle — distinct from `palette.status.*`, which is for inline messaging (toasts, form errors).

Tokens added (light + dark theme):

- `state-neutral-bg` / `state-neutral-text` — info / pending review (warm-grey surface).
- `state-action-required-bg` / `state-action-required-text` — creator must act (amber).
- `state-success-bg` / `state-success-text` — approved / paid (green).
- `state-urgent-bg` / `state-urgent-text` — deadline approaching (orange — intentionally distinct from action-required amber and from `negative` red, so the three "lean in" states each have their own affordance).

Bg + text pairs are tuned for AA contrast in both themes: each text token is two steps darker (light theme) or two steps lighter (dark theme) than its background. Dark theme backgrounds use the accent hue at 18% over the dark surface so the banner reads as tinted-but-recessive rather than competing with the body content.

Why new tokens rather than aliasing existing `status.*`: the urgent-orange shade is not present in the existing palette (the closest existing alternative would be `notice` amber, which is reserved for action-required); and the four state-banner cells must remain perceptually independent across light AND dark themes. Aliasing to `notice` / `positive` / etc. would collapse urgent and action-required into the same hue, defeating the visual differentiation the banner needs.

Build artifacts regenerated (CSS variables, SCSS, JSON, JS, Tailwind v4, React Native). Existing palette consumers are unaffected.
