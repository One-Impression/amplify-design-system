---
"@one-impression/tokens-creator": minor
---

Add four gradient anchor color tokens for the home page background: `gradientHomeStart` (`#E2E7FE`), `gradientHomeMid1` (`#DEE2FE`), `gradientHomeMid2` (`#EBF9FF`), and `gradientHomeEnd` (`#FFFFFF`). These mirror the legacy hex values used in the home page `pageConfig.gradient.colors` and unblock a legacy-faithful SDUI rebuild that currently bypasses the token system with raw hex literals. Purely additive — no existing token names or values change — and the names are reusable across any future page that wants a similar light-violet → off-white background ramp.
