/**
 * Token resolvers — convert token names to concrete values using
 * the sdui namespace from @one-impression/tokens-creator/react-native.
 *
 * Every resolver accepts either a token name OR a raw value (number/string).
 * This lets components work with both token-driven SDUI props and one-off overrides.
 */
import type { ViewStyle } from 'react-native';
import { sdui } from '@one-impression/tokens-creator/react-native';
import type {
  ColorToken,
  SpacingToken,
  FontSizeToken,
  FontWeightToken,
  IconSizeToken,
  RadiusToken,
  BorderWidthToken,
} from '../tokens';

/** Camel-case a kebab segment: "neutral-inverse" → "neutralInverse". */
function camelize(s: string): string {
  return s.replace(/-([a-z0-9])/g, (_m, c: string) => c.toUpperCase());
}

/**
 * Look a token up in a built token map, accepting BOTH forms:
 *   - the short built key the components use internally — `neutralInverse`, `lg`
 *   - the long wire form the gateway / SDUI schema emit — `sdui.color.neutral-inverse`
 *     (the `ColorTokenSchema` regex even *requires* this form on the wire)
 *
 * The build emits short camelCase keys, so the wire form is normalised by
 * dropping the `sdui.<group>.` prefix and kebab→camel-casing the remainder.
 * Without this, every `sdui.*` token sent over the wire fails to resolve.
 */
function lookupToken<T>(map: Record<string, T>, token: string): T | undefined {
  if (token in map) return map[token];
  const m = /^sdui\.[a-z0-9-]+\.(.+)$/.exec(token);
  if (m) {
    const key = camelize(m[1]);
    if (key in map) return map[key];
  }
  return undefined;
}

/** Resolve a color token (short key or `sdui.color.*` wire form). Pass-through for raw strings. */
export function resolveColor(token: ColorToken | string | undefined): string | undefined {
  if (token === undefined) return undefined;
  return lookupToken(sdui.color as Record<string, string>, token) ?? token;
}

/** Resolve a spacing token to its numeric value. Pass-through for raw numbers. */
export function resolveSpacing(token: SpacingToken | number | undefined): number | undefined {
  if (token === undefined) return undefined;
  if (typeof token === 'number') return token;
  return lookupToken(sdui.spacing as Record<string, number>, token);
}

/** Resolve a font size token to its numeric value. */
export function resolveFontSize(token: FontSizeToken | number | undefined): number | undefined {
  if (token === undefined) return undefined;
  if (typeof token === 'number') return token;
  return lookupToken(sdui.fontSize as Record<string, number>, token);
}

/** Resolve a font weight token to its numeric string (for RN fontWeight). */
export function resolveFontWeight(
  token: FontWeightToken | string | undefined,
): string | undefined {
  if (token === undefined) return undefined;
  const weight = lookupToken(sdui.fontWeight as Record<string, number>, token);
  return weight !== undefined ? String(weight) : token;
}

/** Resolve an icon size token to its numeric value. */
export function resolveIconSize(token: IconSizeToken | number | undefined): number | undefined {
  if (token === undefined) return undefined;
  if (typeof token === 'number') return token;
  return lookupToken(sdui.iconSize as Record<string, number>, token);
}

/** Resolve a radius token to its numeric value. */
export function resolveRadius(token: RadiusToken | number | undefined): number | undefined {
  if (token === undefined) return undefined;
  if (typeof token === 'number') return token;
  return lookupToken(sdui.radius as Record<string, number>, token);
}

/** Resolve a border width token to its numeric value. */
export function resolveBorderWidth(
  token: BorderWidthToken | number | undefined,
): number | undefined {
  if (token === undefined) return undefined;
  if (typeof token === 'number') return token;
  return lookupToken(sdui.borderWidth as Record<string, number>, token);
}

/**
 * Elevation levels. A shadow is a React-Native platform *composite* (iOS reads
 * shadowColor/Offset/Opacity/Radius; Android reads `elevation`), not a portable
 * scalar — so the recipe lives here in the theme rather than as a tokens-creator
 * scalar token.
 *
 * Values are lifted verbatim from the legacy SDUI card primitive
 * (oportunities-creator-app `src/sdui/components/generic/card.tsx`): `md` is the
 * standard floating-card shadow, `lg` is a pronounced lift, `xl` is the
 * warm-tinted floating-sticker shadow. Do not re-tune these by eye — they're the
 * hand-tuned source of truth.
 */
export type ElevationToken = 'none' | 'sm' | 'md' | 'lg' | 'xl';

const ELEVATION_SHADOWS: Record<ElevationToken, ViewStyle> = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  xl: {
    shadowColor: '#1C1611',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.26,
    shadowRadius: 14,
    elevation: 14,
  },
};

/** Resolve an elevation level to a React-Native shadow style. */
export function resolveShadow(token: ElevationToken | undefined): ViewStyle | undefined {
  if (!token || token === 'none') return undefined;
  return ELEVATION_SHADOWS[token];
}
