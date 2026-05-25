# @one-impression/ui-native — Package Context

React Native primitives for the Amplify Creator App. Every component resolves SDUI tokens from `@one-impression/tokens-creator/react-native` — no hardcoded colors, spacing, or sizing.

## Architecture

```
packages/ui-native/
  src/
    tokens.ts          — ColorToken, SpacingToken, etc. type unions
    theme/
      resolvers.ts     — resolveColor(), resolveSpacing(), etc.
      ThemeProvider.tsx — React Context wrapping tokens-creator
    layout/
      Box.tsx          — flex View with token props
      Stack.tsx        — vertical/horizontal stack (Box wrapper)
    primitives/
      <Name>/          — 5-file pattern per component
        <Name>.types.ts
        <Name>.styles.ts
        <Name>.tsx
        <Name>.test.tsx
        index.ts
```

## Boundaries

- **NO Zod schemas** — those live in `@one-impression/sdk-native-sdui`
- **NO SDUI renderers** — those live in `@one-impression/sdui-runtime`
- **NO BFF logic, action engine, or creator business logic**
- **NO `react-dom` imports** — this is React Native only
- **NO `@one-impression/*` imports** — this package is in the `@amplify-ai` namespace

## Primitives (18)

| Category | Components |
|----------|-----------|
| Layout | Box, Stack |
| Foundation | Text, Icon, Image, Separator |
| Interactive | Button, Card, Input, Chip, Checkbox, Radio, Tag, Tab |
| Composite | ProgressIndicator, SearchBar, SelectableItem, ImageStack, Section, ScrollView |

## Token Resolution

All components accept token names as props and resolve them via `theme/resolvers.ts`:

```tsx
<Box bg="primary" p="lg" rounded="md">
  <Text color="neutralInverse" size="xl" weight="bold">
    Hello
  </Text>
</Box>
```

Resolvers accept either a token name OR a raw value, enabling both SDUI-driven and one-off usage.

## Adding a New Primitive

1. Create `src/primitives/<Name>/` with the 5-file pattern
2. Use token types from `../../tokens` for props
3. Use resolvers from `../../theme/resolvers` for style computation
4. Export from the component's `index.ts`
5. Add exports to `src/index.ts` barrel
6. Write tests with `@testing-library/react-native`

## Commands

```bash
npm run build -w packages/ui-native   # tsup ESM + types
npm run test -w packages/ui-native    # jest + react-native preset
npm run lint -w packages/ui-native    # eslint
```

## Peer Dependencies

- `react` >= 18.0.0
- `react-native` >= 0.72.0
- `@one-impression/tokens-creator` >= 2.1.0
