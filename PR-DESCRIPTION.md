# feat: add Oportunities theme + Studio brand to design system

This PR introduces the **Oportunities** product theme (Studio direction) to the federated design system, alongside the existing brand/creator/atmosphere/studio/marketing themes.

## What's added

### 4 new packages
- **`@amplify-ai/tokens-oportunities@1.0.0`** — Studio-direction tokens (apricot palette, Geist + Inter + JBM, light + dark)
- **`@amplify-ai/brand-oportunities@1.0.0`** — brand asset library (logo SVGs, app icons, favicons, social templates, business cards, email signature, full `BRAND-DECISIONS.md`)

### 6 new components in `@amplify-ai/ui` (will release as 2.12.0)
- `Wordmark` — Oportunities wordmark with optional gradient-sweep animation
- `SignalDot` — the apricot period as a standalone animated mark
- `CreatorIntentCard` — signature product card (composes `Card` + `Avatar` + `Badge`)
- `BrandInterestCard` — creator-side inbox card
- `IntentFeed` — filterable container
- `AppIconOportunities` — the locked "op." app icon as a React component

All composed from existing primitives — no new primitives introduced.

### Storybook
- Oportunities theme registered in theme switcher
- 8 brand guidelines docs: Brand overview, Logo, Color, Typography, Components, Voice, AppIcon, Favicon

## What's NOT in this PR (Phase 2)
Marketing site templates, email transactional/marketing templates, push notif spec, WhatsApp message templates, full social templates, slide deck cover, Slack notification format. These ship in a follow-up PR (`feat/oportunities-templates`).

## Locked brand decisions (founder-approved)
Documented in `packages/brand-oportunities/BRAND-DECISIONS.md` — full record of:
- Wordmark spec
- Signature animation
- App icon + favicon (light + dark)
- Voice register
- Application contexts
- Sizing scale

## Test plan
- [ ] `npm install` from clean state
- [ ] `npm run build` succeeds for all workspaces
- [ ] `npm run storybook` launches; Oportunities theme selectable; all 8 docs render
- [ ] `npm run test -w packages/ui` passes
- [ ] Pixel drift detection picks up the new package within 6 hours of merge
- [ ] Engineer can import + use components in a sample product

## Migration / breaking changes
None. All additions are net-new. No existing API changed.

Generated with Claude Code
