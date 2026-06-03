/**
 * tokens — maps @one-impression/tokens-creator values to React Native
 * compatible values for runtime resolution.
 *
 * Reads the sdui namespace from tokens-creator and re-exports as
 * flat lookup maps usable by the style resolver and useToken hook.
 */
import { sdui } from '@one-impression/tokens-creator/react-native';

/**
 * Token category types matching the sdui namespace structure.
 * These mirror the types in @one-impression/ui-native/src/tokens.ts
 * but are defined here to avoid a hard dependency on that package.
 */
export type TokenCategory =
  | 'color'
  | 'spacing'
  | 'fontSize'
  | 'fontWeight'
  | 'iconSize'
  | 'radius'
  | 'borderWidth'
  | 'component';

/** The full resolved token set from tokens-creator. */
export type SduiTokens = typeof sdui;

/**
 * Flat token map — maps dot-notation keys to resolved values.
 *
 * @example
 * 'sdui.color.primary' => '#6531FF'
 * 'sdui.spacing.md' => 12
 * 'sdui.fontSize.lg' => 16
 */
export function buildTokenMap(): Record<string, string | number> {
  const map: Record<string, string | number> = {};

  // Color tokens
  for (const [key, value] of Object.entries(sdui.color)) {
    map[`sdui.color.${key}`] = value as string;
  }

  // Spacing tokens
  for (const [key, value] of Object.entries(sdui.spacing)) {
    map[`sdui.spacing.${key}`] = value as number;
  }

  // Font size tokens
  for (const [key, value] of Object.entries(sdui.fontSize)) {
    map[`sdui.fontSize.${key}`] = value as number;
  }

  // Font weight tokens
  for (const [key, value] of Object.entries(sdui.fontWeight)) {
    map[`sdui.fontWeight.${key}`] = value as number;
  }

  // Icon size tokens
  for (const [key, value] of Object.entries(sdui.iconSize)) {
    map[`sdui.iconSize.${key}`] = value as number;
  }

  // Radius tokens
  for (const [key, value] of Object.entries(sdui.radius)) {
    map[`sdui.radius.${key}`] = value as number;
  }

  // Border width tokens
  for (const [key, value] of Object.entries(sdui.borderWidth)) {
    map[`sdui.borderWidth.${key}`] = value as number;
  }

  // Component tokens (nested)
  if (sdui.component?.button) {
    for (const [key, value] of Object.entries(sdui.component.button)) {
      map[`sdui.component.button.${key}`] = value as number;
    }
  }

  return map;
}

/** Lazily built token map singleton. */
let _tokenMap: Record<string, string | number> | null = null;

/**
 * Get the flat token map. Built once and cached.
 */
export function getTokenMap(): Record<string, string | number> {
  if (!_tokenMap) {
    _tokenMap = buildTokenMap();
  }
  return _tokenMap;
}

/**
 * Resolve a single token path to its value.
 *
 * @param path - Dot-notation token path (e.g. 'sdui.color.primary')
 * @returns The resolved value, or undefined if not found
 */
export function resolveToken(path: string): string | number | undefined {
  return getTokenMap()[path];
}

/**
 * Re-export the raw sdui tokens for direct access.
 */
export { sdui };
