---
"@one-impression/sdui-runtime": patch
---

`StepsRenderer` no longer hardcodes `#6531FF` / `#E0E0E0` for the active and inactive step bars. It now passes the semantic tokens `"primary"` and `"neutralWeak"` (from `@one-impression/tokens-creator`) to the `Box` `bg` prop, so the step indicator respects theme switching and brand cascades instead of bypassing the token system.
