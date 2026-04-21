

## ESLint Design System Rules

## ESLint Design System Rules

The `@amplify/eslint-plugin` (v2.0.0) enforces 7 rules at `warn` level across all products. The 4 new rules below cover additional violation classes reviewers should flag.

### no-inline-styles
- `style={{ color: '#fff', padding: 10 }}` (literal string/number values in an inline object) → flag (use Tailwind + CSS variable tokens instead)
- `style={someVariable}` or `style={{ ['--custom']: val }}` (pre-defined objects or CSS variable injection) → allowed
- Files in `components/ui/` are exempt

### no-raw-surface
- `bg-[var(--surface-elevated|secondary|tertiary|overlay)]` on a `className` without any of `ring-`, `border-`, `shadow-` → flag (card becomes invisible in light mode; add `ring-1 ring-[var(--border-default)]` or use `<Card>`)
- Having a boundary class alongside the surface token → allowed
- Files in `components/ui/` are exempt

### no-hardcoded-radius
- `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, or `rounded-[Npx]` in a `className` → flag (use `rounded-[var(--radius-card)]` for 16px or `rounded-[var(--radius-xs)]` for 6px)
- `rounded-full` and `rounded-none` → allowed
- Files in `components/ui/` are exempt

### no-hardcoded-typography
- `text-[Npx]` (arbitrary pixel font size) in a `className` → flag (use Tailwind scale: `text-xs` 12px, `text-sm` 14px, `text-base` 16px, `text-lg` 18px, etc.)
- `text-[var(--typography-*)]` (token-based arbitrary value) → allowed
- Files in `components/ui/` are exempt

### Rule detection scope
All four new rules inspect `className` JSXAttributes and check `Literal` strings, template literal quasi strings, and string arguments to `cn(...)` call expressions.
