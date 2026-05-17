/**
 * Token resolvers — convert token names to concrete values using
 * the sdui namespace from @amplify-ai/tokens-creator/react-native.
 *
 * Every resolver accepts either a token name OR a raw value (number/string).
 * This lets components work with both token-driven SDUI props and one-off overrides.
 */
import { sdui } from '@amplify-ai/tokens-creator/react-native';
import type {
  ColorToken,
  SpacingToken,
  FontSizeToken,
  FontWeightToken,
  IconSizeToken,
  RadiusToken,
  BorderWidthToken,
} from '../tokens';

/** Resolve a color token name to its hex value. Pass-through for raw strings. */
export function resolveColor(token: ColorToken | string | undefined): string | undefined {
  if (token === undefined) return undefined;
  const resolved = (sdui.color as Record<string, string>)[token];
  return resolved ?? token;
}

/** Resolve a spacing token to its numeric value. Pass-through for raw numbers. */
export function resolveSpacing(token: SpacingToken | number | undefined): number | undefined {
  if (token === undefined) return undefined;
  if (typeof token === 'number') return token;
  return (sdui.spacing as Record<string, number>)[token];
}

/** Resolve a font size token to its numeric value. */
export function resolveFontSize(token: FontSizeToken | number | undefined): number | undefined {
  if (token === undefined) return undefined;
  if (typeof token === 'number') return token;
  return (sdui.fontSize as Record<string, number>)[token];
}

/** Resolve a font weight token to its numeric string (for RN fontWeight). */
export function resolveFontWeight(
  token: FontWeightToken | string | undefined,
): string | undefined {
  if (token === undefined) return undefined;
  const weight = (sdui.fontWeight as Record<string, number>)[token];
  return weight !== undefined ? String(weight) : token;
}

/** Resolve an icon size token to its numeric value. */
export function resolveIconSize(token: IconSizeToken | number | undefined): number | undefined {
  if (token === undefined) return undefined;
  if (typeof token === 'number') return token;
  return (sdui.iconSize as Record<string, number>)[token];
}

/** Resolve a radius token to its numeric value. */
export function resolveRadius(token: RadiusToken | number | undefined): number | undefined {
  if (token === undefined) return undefined;
  if (typeof token === 'number') return token;
  return (sdui.radius as Record<string, number>)[token];
}

/** Resolve a border width token to its numeric value. */
export function resolveBorderWidth(
  token: BorderWidthToken | number | undefined,
): number | undefined {
  if (token === undefined) return undefined;
  if (typeof token === 'number') return token;
  return (sdui.borderWidth as Record<string, number>)[token];
}
