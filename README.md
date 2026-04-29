# Amplify Design System

Federated design tokens and shared UI components for all One Impression products.

## Architecture

```
                    +-----------------------+
                    |   Pixel Agent (CDO)   |
                    |  pixel.amplify.club   |
                    |                       |
                    |  - Token governance   |
                    |  - Drift detection    |
                    |  - Design review      |
                    |  - Brand cascade      |
                    |  - A11y auditing      |
                    |  - Mockup generation  |
                    |  - Theme management   |
                    +----------+------------+
                               |
                    reads/syncs via GitHub API
                               |
                    +----------v------------+
                    | amplify-design-system  |  <-- YOU ARE HERE
                    |     (this repo)        |
                    |                        |
                    |  - Token source files  |
                    |  - Style Dictionary    |
                    |  - npm packages        |
                    |  - UI components       |
                    |  - ESLint rules        |
                    |  - Storybook           |
                    |  - Figma sync          |
                    +----------+-------------+
                               |
                    npm install @amplify-ai/tokens-*
                               |
          +--------------------+--------------------+
          |                    |                    |
  +-------v------+   +--------v-------+   +-------v--------+
  |    Brand     |   |   Creator App  |   |  Atmosphere    |
  | one-dashboard|   |  one_club_app  |   | odin-agent/web |
  |    -web      |   |                |   |                |
  +--------------+   +----------------+   +----------------+
```

## This repo is the BUILD SYSTEM. Pixel is the BRAIN.

| This repo does | Pixel does |
|----------------|------------|
| Stores token JSON source files | Governs token changes (approval workflows) |
| Builds CSS/JS/RN output via Style Dictionary | Detects token drift (Pixel vs code) |
| Publishes npm packages (@amplify-ai/*) | Cascades brand changes across products |
| Houses React UI components | Reviews PR design compliance |
| Runs Storybook for component docs | Audits accessibility (WCAG 2.1 AA) |
| Provides ESLint rules | Generates design mockups & handoff specs |
| Syncs with Figma (Tokens Studio) | Manages themes (dark, light, high-contrast) |

**Do NOT rebuild governance, auditing, or design intelligence here.** That lives in [pixel-agent](https://github.com/One-Impression/pixel-agent).

## Packages

| Package | Purpose | Consumer |
|---------|---------|----------|
| `@amplify-ai/tokens-foundation` | Shared primitives (spacing, radii, shadows, typography) | All products |
| `@amplify-ai/tokens-brand` | Brand platform colors & theme | one-dashboard-web |
| `@amplify-ai/tokens-atmosphere` | Atmosphere dashboard colors & theme | odin-agent/web |
| `@amplify-ai/tokens-creator` | Creator app colors & SDUI mapping | one_club_app |
| `@amplify-ai/ui` | Shared React UI components | Web products |
| `@amplify-ai/eslint-config` | Design system lint rules | All products |
| `@amplify-ai/feature-flags` | Feature flag utilities | All products |

## Token Flow

1. Designer updates tokens in **Figma** (Tokens Studio plugin)
2. Tokens Studio pushes JSON to `tokens-studio/*` branch on this repo
3. **GitHub Actions** builds all packages, validates, creates PR
4. On merge: npm publish + **Pixel** detects update via scheduled drift check
5. Pixel runs brand cascade → identifies affected products → generates fix PRs
6. Products `npm update @amplify-ai/tokens-*` to adopt changes

## Pixel Integration Points

- **Token sync**: `pixel-agent/src/services/token-sync.ts` reads from `packages/tokens-*/tokens/` via GitHub API
- **Drift detection**: Pixel compares this repo's tokens against live product code every 6 hours
- **Brand cascade**: When tokens change here, Pixel propagates to all 3 products
- **PR review**: Pixel checks product PRs for design system compliance

## Development

```bash
npm install          # Install all workspace deps
npm run build        # Build all token packages + UI
npm run storybook    # Launch Storybook (port 6006)
npm run validate     # Cross-package consistency check
```

## Related Repos

- [pixel-agent](https://github.com/One-Impression/pixel-agent) — AI Chief Design Officer (governance, auditing, intelligence)
- [one-dashboard-web](https://github.com/One-Impression/one-dashboard-web) — Brand Platform (consumer)
- [one_club_app](https://github.com/One-Impression/one_club_app) — Creator App (consumer)
- [odin-agent](https://github.com/One-Impression/odin-agent) — Atmosphere Dashboard (consumer)
