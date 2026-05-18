/**
 * styleResolver — resolves token-referencing style objects to React Native
 * StyleSheet-compatible values.
 *
 * SDUI style objects from the BFF may contain token references like
 * "$sdui.color.primary" or "$sdui.spacing.md". This resolver walks the
 * style object, resolves all token references, and returns a plain
 * object suitable for React Native's StyleSheet.
 *
 * Convention: token references are prefixed with "$" to distinguish
 * them from literal values.
 */
import { type TextStyle, type ViewStyle, type ImageStyle } from 'react-native';
import { resolveToken } from './tokens.js';

/** Combined RN style type. */
export type RNStyle = ViewStyle & TextStyle & ImageStyle;

/** Token reference prefix. */
const TOKEN_PREFIX = '$';

/**
 * Check if a value is a token reference string.
 */
function isTokenRef(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(TOKEN_PREFIX);
}

/**
 * Resolve a single value. If it's a token reference, look it up.
 * Otherwise return as-is.
 */
function resolveValue(value: unknown): unknown {
  if (!isTokenRef(value)) return value;

  // Strip the "$" prefix to get the token path
  const tokenPath = value.slice(1);
  const resolved = resolveToken(tokenPath);

  if (resolved === undefined) {
    if (__DEV__) {
      console.warn(`[styleResolver] Unknown token reference: "${value}"`);
    }
    return undefined;
  }

  return resolved;
}

/**
 * Resolve a style object with token references to concrete RN values.
 *
 * @param style - Style object that may contain "$sdui.*" token references
 * @returns A new object with all token references resolved
 *
 * @example
 * ```ts
 * resolveStyle({
 *   backgroundColor: '$sdui.color.primary',
 *   padding: '$sdui.spacing.md',
 *   borderRadius: '$sdui.radius.lg',
 *   fontSize: 14, // literal, passed through
 * });
 * // => { backgroundColor: '#6531FF', padding: 12, borderRadius: 12, fontSize: 14 }
 * ```
 */
export function resolveStyle(style: Record<string, unknown>): Partial<RNStyle> {
  const resolved: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(style)) {
    if (value === null || value === undefined) continue;

    const resolvedValue = resolveValue(value);
    if (resolvedValue !== undefined) {
      resolved[key] = resolvedValue;
    }
  }

  return resolved as Partial<RNStyle>;
}

/**
 * Resolve an array of style objects, merging them left to right.
 * Later values override earlier ones (same as RN StyleSheet behavior).
 */
export function resolveStyles(
  ...styles: (Record<string, unknown> | undefined | null)[]
): Partial<RNStyle> {
  const merged: Record<string, unknown> = {};

  for (const style of styles) {
    if (!style) continue;
    Object.assign(merged, resolveStyle(style));
  }

  return merged as Partial<RNStyle>;
}

/**
 * Create a cached style resolver for a specific set of styles.
 * Useful for components that resolve the same style structure on every render.
 *
 * @param factory - Function that returns a style object with token references
 * @returns A function that returns the resolved styles (cached after first call)
 */
export function createStyleResolver<T extends Record<string, Record<string, unknown>>>(
  factory: () => T,
): () => { [K in keyof T]: Partial<RNStyle> } {
  let cached: { [K in keyof T]: Partial<RNStyle> } | null = null;

  return () => {
    if (cached) return cached;

    const raw = factory();
    const resolved = {} as { [K in keyof T]: Partial<RNStyle> };

    for (const [key, style] of Object.entries(raw)) {
      (resolved as Record<string, Partial<RNStyle>>)[key] = resolveStyle(style);
    }

    cached = resolved;
    return resolved;
  };
}
