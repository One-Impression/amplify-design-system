# Recipes — `@amplify-ai/ui/recipes`

A **recipe** is a small composition of two or more primitives from
`@amplify-ai/ui` that captures a recurring UI pattern. Recipes are NOT
primitives — they are convenience wrappers that:

- Compose existing components, adding layout and minor glue logic only
- Have **no new visual tokens** (everything inherits from the underlying primitives)
- Are dropped into product code in place of bespoke compositions

## Why a separate layer?

Primitives stay focused (one component = one concept). Recipes capture
the next tier — the patterns we kept rebuilding by hand in product
repos. By centralizing them here we get visual consistency and a single
upgrade target.

## When to add a new recipe

Promote a pattern to a recipe when **all** of the following are true:

1. Used (or will be) in 2+ products
2. Composes existing primitives — does not introduce new visual concepts
3. Has minimal logic (debounce, group-by, click-away — not domain logic)
4. Has a clear, stable API surface

If a candidate fails any of these, build a **primitive** instead, or
keep it product-local.

## Current recipes

| Recipe          | Composes                                  |
|-----------------|-------------------------------------------|
| `SearchCombobox`| `<input>` + Dropdown + `LoadingState` + `EmptyState` |
| `ActionCard`    | `Card` + Icon slot + Heading + `Button`   |
| `StepHeader`    | `Stepper` + Heading + Help slot           |
| `MetricGrid`    | Responsive grid of `MetricCard`           |
| `AlertBanner`   | Banner + Icon + Title + Description + Dismiss + Action |

## Importing

```tsx
import { SearchCombobox, ActionCard, MetricGrid } from '@amplify-ai/ui';
// or, equivalently:
import { SearchCombobox } from '@amplify-ai/ui/recipes';  // if you export a /recipes subpath later
```

For now everything is re-exported from the package root; the
recipes subpath export will be added when needed.
