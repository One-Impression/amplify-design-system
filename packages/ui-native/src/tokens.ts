/**
 * Token type definitions — string literal unions matching SDUI token keys
 * from @one-impression/tokens-creator/react-native.
 *
 * Components accept these as props (e.g. <Box bg="primary" p="md" />)
 * and resolve them to concrete values via theme/resolvers.ts.
 */

/** SDUI color token names — maps to sdui.color.* */
export type ColorToken =
  | 'neutralStrong'
  | 'neutralMedium'
  | 'neutralWeak'
  | 'neutralSubtle'
  | 'neutralInverse'
  | 'primary'
  | 'primaryWeak'
  | 'positive'
  | 'positiveWeak'
  | 'notice'
  | 'noticeWeak'
  | 'negative'
  | 'negativeWeak'
  | 'offsetStrong'
  | 'offsetMedium'
  | 'offsetWeak'
  | 'transparent';

/** SDUI spacing token names — maps to sdui.spacing.* */
export type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

/** SDUI font size token names — maps to sdui.fontSize.* */
export type FontSizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

/** SDUI font weight token names — maps to sdui.fontWeight.* */
export type FontWeightToken = 'regular' | 'medium' | 'semibold' | 'bold';

/** SDUI icon size token names — maps to sdui.iconSize.* */
export type IconSizeToken = 'sm' | 'md' | 'lg' | 'xl';

/** SDUI border radius token names — maps to sdui.radius.* */
export type RadiusToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/** SDUI border width token names — maps to sdui.borderWidth.* */
export type BorderWidthToken = 'none' | 'thin' | 'medium' | 'thick';
