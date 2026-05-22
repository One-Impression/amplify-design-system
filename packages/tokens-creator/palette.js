/**
 * Palette — semantic token alias module.
 *
 * Maps engineer-friendly semantic names (e.g. `palette.text.strong`) to
 * canonical SDUI token names (e.g. `"sdui.color.neutral-strong"`). The
 * token NAME is theme-invariant; only its VALUE differs per theme, and
 * theme resolution happens client-side in the renderer at paint time.
 *
 * Consumers (BFF handlers, server-driven UI emitters):
 *   import { palette } from "@amplify-ai/tokens-creator/palette";
 *   sdui.pageHeader({ title: { text: "Explore", color: palette.text.strong } });
 *
 * Maintenance:
 *   - Every value here MUST resolve to a token defined in EVERY theme JSON
 *     (tokens/theme-light.json + tokens/theme-dark.json). The build-time
 *     invariant in scripts/validate-palette.js enforces this; the build
 *     fails if any palette entry references a non-existent token.
 *   - When adding a new alias, first add the underlying token to the theme
 *     JSONs (in BOTH light and dark), then add the alias here.
 *
 * Design rationale: see PALETTE-DESIGN.md in this package.
 */

export const palette = Object.freeze({
  text: Object.freeze({
    strong: "sdui.color.neutral-strong",
    medium: "sdui.color.neutral-medium",
    weak: "sdui.color.neutral-weak",
    subtle: "sdui.color.neutral-subtle",
    inverse: "sdui.color.neutral-inverse",
  }),

  surface: Object.freeze({
    base: "sdui.color.offset-weak",
    raised: "sdui.color.offset-medium",
    border: "sdui.color.offset-strong",
    transparent: "sdui.color.transparent",
  }),

  brand: Object.freeze({
    primary: "sdui.color.primary",
    primaryWeak: "sdui.color.primary-weak",
  }),

  status: Object.freeze({
    positive: "sdui.color.positive",
    positiveWeak: "sdui.color.positive-weak",
    notice: "sdui.color.notice",
    noticeWeak: "sdui.color.notice-weak",
    negative: "sdui.color.negative",
    negativeWeak: "sdui.color.negative-weak",
  }),

  font: Object.freeze({
    xs: "sdui.font-size.xs",
    sm: "sdui.font-size.sm",
    md: "sdui.font-size.md",
    lg: "sdui.font-size.lg",
    xl: "sdui.font-size.xl",
    xxl: "sdui.font-size.xxl",
    xxxl: "sdui.font-size.xxxl",
  }),

  weight: Object.freeze({
    regular: "sdui.font-weight.regular",
    medium: "sdui.font-weight.medium",
    semibold: "sdui.font-weight.semibold",
    bold: "sdui.font-weight.bold",
  }),

  spacing: Object.freeze({
    xs: "sdui.spacing.xs",
    sm: "sdui.spacing.sm",
    md: "sdui.spacing.md",
    lg: "sdui.spacing.lg",
    xl: "sdui.spacing.xl",
    xxl: "sdui.spacing.xxl",
    xxxl: "sdui.spacing.xxxl",
  }),

  radius: Object.freeze({
    none: "sdui.radius.none",
    xs: "sdui.radius.xs",
    sm: "sdui.radius.sm",
    md: "sdui.radius.md",
    lg: "sdui.radius.lg",
    xl: "sdui.radius.xl",
    full: "sdui.radius.full",
  }),

  icon: Object.freeze({
    sm: "sdui.icon-size.sm",
    md: "sdui.icon-size.md",
    lg: "sdui.icon-size.lg",
    xl: "sdui.icon-size.xl",
  }),

  borderWidth: Object.freeze({
    none: "sdui.border-width.none",
    thin: "sdui.border-width.thin",
    medium: "sdui.border-width.medium",
    thick: "sdui.border-width.thick",
  }),
});
