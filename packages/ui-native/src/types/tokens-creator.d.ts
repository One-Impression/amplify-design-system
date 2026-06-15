/**
 * Type declarations for @one-impression/tokens-creator/react-native
 *
 * The tokens-creator package generates tokens.native.js at build time
 * without .d.ts files. This declaration provides type safety for consumers.
 */
declare module '@one-impression/tokens-creator/react-native' {
  export const colors: Record<string, string>;
  export const fontSize: Record<string, number>;
  export const spacing: Record<string, number>;

  export const sdui: {
    color: Record<string, string>;
    spacing: Record<string, number>;
    fontSize: Record<string, number>;
    fontWeight: Record<string, number>;
    iconSize: Record<string, number>;
    radius: Record<string, number>;
    borderWidth: Record<string, number>;
    component: {
      button: Record<string, number>;
      field: Record<string, number>;
      tag: Record<string, number>;
    };
  };
}
