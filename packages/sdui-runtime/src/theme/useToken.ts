/**
 * useToken — hook to resolve token strings at render time.
 *
 * Accepts a dot-notation token path and returns the resolved value.
 * Uses the token map built from @amplify-ai/tokens-creator.
 *
 * @example
 * ```tsx
 * const color = useToken('sdui.color.primary');
 * // => '#6531FF'
 *
 * const spacing = useToken('sdui.spacing.lg');
 * // => 16
 * ```
 */
import { useMemo } from 'react';
import { resolveToken } from './tokens.js';

/**
 * Resolve a single token path to its value at render time.
 *
 * @param path - Dot-notation token path (e.g. 'sdui.color.primary')
 * @returns The resolved value, or undefined if not found
 */
export function useToken(path: string): string | number | undefined {
  return useMemo(() => resolveToken(path), [path]);
}

/**
 * Resolve multiple token paths at once.
 *
 * @param paths - Array of dot-notation token paths
 * @returns Array of resolved values (undefined for unresolved tokens)
 */
export function useTokens(paths: string[]): (string | number | undefined)[] {
  return useMemo(
    () => paths.map((p) => resolveToken(p)),
    // Stringify paths for stable memoization
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paths.join(',')],
  );
}

/**
 * Resolve a token path with a fallback value.
 *
 * @param path     - Dot-notation token path
 * @param fallback - Value to return if token is not found
 * @returns The resolved value or fallback
 */
export function useTokenWithFallback<T extends string | number>(
  path: string,
  fallback: T,
): T {
  return useMemo(() => {
    const value = resolveToken(path);
    return (value as T) ?? fallback;
  }, [path, fallback]);
}
