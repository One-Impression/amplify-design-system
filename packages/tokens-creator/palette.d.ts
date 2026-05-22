/**
 * Type declarations for the palette module.
 *
 * Provides autocomplete + structural typing for consumers (BFF handlers).
 * The branded `SduiToken` type marks string values that are valid SDUI
 * token names — preventing accidental concatenation with arbitrary strings.
 */

/** Branded string type — valid SDUI token name. */
export type SduiToken = string & { readonly __brand: "SduiToken" };

export interface PaletteText {
  readonly strong: SduiToken;
  readonly medium: SduiToken;
  readonly weak: SduiToken;
  readonly subtle: SduiToken;
  readonly inverse: SduiToken;
}

export interface PaletteSurface {
  readonly base: SduiToken;
  readonly raised: SduiToken;
  readonly border: SduiToken;
  readonly transparent: SduiToken;
}

export interface PaletteBrand {
  readonly primary: SduiToken;
  readonly primaryWeak: SduiToken;
}

export interface PaletteStatus {
  readonly positive: SduiToken;
  readonly positiveWeak: SduiToken;
  readonly notice: SduiToken;
  readonly noticeWeak: SduiToken;
  readonly negative: SduiToken;
  readonly negativeWeak: SduiToken;
}

export interface PaletteFont {
  readonly xs: SduiToken;
  readonly sm: SduiToken;
  readonly md: SduiToken;
  readonly lg: SduiToken;
  readonly xl: SduiToken;
  readonly xxl: SduiToken;
  readonly xxxl: SduiToken;
}

export interface PaletteWeight {
  readonly regular: SduiToken;
  readonly medium: SduiToken;
  readonly semibold: SduiToken;
  readonly bold: SduiToken;
}

export interface PaletteSpacing {
  readonly xs: SduiToken;
  readonly sm: SduiToken;
  readonly md: SduiToken;
  readonly lg: SduiToken;
  readonly xl: SduiToken;
  readonly xxl: SduiToken;
  readonly xxxl: SduiToken;
}

export interface PaletteRadius {
  readonly none: SduiToken;
  readonly xs: SduiToken;
  readonly sm: SduiToken;
  readonly md: SduiToken;
  readonly lg: SduiToken;
  readonly xl: SduiToken;
  readonly full: SduiToken;
}

export interface PaletteIcon {
  readonly sm: SduiToken;
  readonly md: SduiToken;
  readonly lg: SduiToken;
  readonly xl: SduiToken;
}

export interface PaletteBorderWidth {
  readonly none: SduiToken;
  readonly thin: SduiToken;
  readonly medium: SduiToken;
  readonly thick: SduiToken;
}

export interface Palette {
  readonly text: PaletteText;
  readonly surface: PaletteSurface;
  readonly brand: PaletteBrand;
  readonly status: PaletteStatus;
  readonly font: PaletteFont;
  readonly weight: PaletteWeight;
  readonly spacing: PaletteSpacing;
  readonly radius: PaletteRadius;
  readonly icon: PaletteIcon;
  readonly borderWidth: PaletteBorderWidth;
}

export declare const palette: Palette;
