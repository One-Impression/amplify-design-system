# Oportunities — Engineer hand-off guide

## What's been built (all in this PR)
- `@one-impression/tokens-oportunities@1.0.0`
- `@one-impression/brand-oportunities@1.0.0`
- New components in `@one-impression/ui` (`Wordmark`, `SignalDot`, `CreatorIntentCard`, `BrandInterestCard`, `IntentFeed`, `AppIconOportunities`)
- Storybook theme + 8 brand guidelines docs

## How to consume in a product app

### Step 1: install tokens + UI
```bash
npm install @one-impression/tokens-oportunities @one-impression/ui @one-impression/brand-oportunities
```

### Step 2: load CSS or Tailwind

Option A (CSS vars):
```ts
import '@one-impression/tokens-oportunities/css';
```

Option B (Tailwind preset):
```ts
// tailwind.config.ts
import oportunitiesPreset from '@one-impression/tokens-oportunities/tailwind';
export default { presets: [oportunitiesPreset], ... };
```

### Step 3: use components
```tsx
import { Wordmark, SignalDot, CreatorIntentCard } from '@one-impression/ui';

<Wordmark size="xl" animated />
<SignalDot size={24} live />
<CreatorIntentCard creator={...} intent={...} aiFitScore={94} onUnlock={...} />
```

### Step 4: brand assets
```ts
import { wordmark, appIcon } from '@one-impression/brand-oportunities';
// Or reference directly:
<img src="/node_modules/@one-impression/brand-oportunities/assets/logo/wordmark-default.svg" />
```

## What you still need to build (product code, not design system)

### Brand product (desktop SPA)
- Authentication wiring
- Backend API integration
- Stripe payment integration
- Real intent data feed

### Creator app (mobile)
- iOS / Android app shell
- Push notification handling
- WhatsApp deep-link handler

### Internal admin
- Real admin auth + RBAC
- Real database queries
- Audit log infrastructure

## Locked brand decisions (DO NOT change without sign-off)
- Wordmark: `oportunities.` Geist 600, -0.04em, solid apricot period
- Signature animation: apricot→purple gradient sweep
- App icon: V1 default base (`op.` on cream / dark)
- Favicon: V1 default base
- Voice register: Direct-confident (push/buttons/errors/tooltips) + Tool-curious (empty/success/email/marketing)
- Palette: locked apricot family (see `tokens-oportunities/tokens/theme-light.json`)

## Pixel governance
Once this PR merges:
- Pixel agent will detect the new `tokens-oportunities` package within 6 hours
- Pixel will start drift monitoring for Oportunities
- Brand cascade enabled when tokens change here

## Questions
File issues on this PR or ping Apaksh on Slack.
