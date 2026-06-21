---
"@one-impression/sdui-runtime": minor
---

Vertical `group_config` children now inherit the page's per-item vertical rhythm by default, instead of a fixed `sm` gap. Spacing resolves in precedence: a child node's own `gap` (per-child, backend) → the group's `gap` (group-wide, backend) → the inherited page default (half-gutter). A plain (cardless) vertical group is now spacing-transparent — its children space exactly as if inlined at the page level (first child's top and last child's bottom are zeroed, since the group already sits in the page gutter). Horizontal groups are unchanged (they keep the uniform `Box` gap, default `sm`).
