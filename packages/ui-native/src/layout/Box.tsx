import React from 'react';
import { View, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { resolveColor, resolveSpacing, resolveRadius, resolveBorderWidth } from '../theme/resolvers';
import type { ColorToken, SpacingToken, RadiusToken, BorderWidthToken } from '../tokens';

export interface BoxProps extends ViewProps {
  /** Background color token or raw color string. */
  bg?: ColorToken | string;
  /** Padding — all sides. */
  p?: SpacingToken | number;
  /** Horizontal padding. */
  px?: SpacingToken | number;
  /** Vertical padding. */
  py?: SpacingToken | number;
  /** Padding top. */
  pt?: SpacingToken | number;
  /** Padding bottom. */
  pb?: SpacingToken | number;
  /** Padding left. */
  pl?: SpacingToken | number;
  /** Padding right. */
  pr?: SpacingToken | number;
  /** Margin — all sides. */
  m?: SpacingToken | number;
  /** Horizontal margin. */
  mx?: SpacingToken | number;
  /** Vertical margin. */
  my?: SpacingToken | number;
  /** Margin top. */
  mt?: SpacingToken | number;
  /** Margin bottom. */
  mb?: SpacingToken | number;
  /** Border radius token or raw number. */
  rounded?: RadiusToken | number;
  /** Border width token or raw number. */
  borderWidth?: BorderWidthToken | number;
  /** Border color token or raw color string. */
  borderColor?: ColorToken | string;
  /** Flex value. */
  flex?: number;
  /** Flex direction. */
  direction?: ViewStyle['flexDirection'];
  /** Align items. */
  align?: ViewStyle['alignItems'];
  /** Justify content. */
  justify?: ViewStyle['justifyContent'];
  /** Gap between children. */
  gap?: SpacingToken | number;
  /** Width. */
  width?: number | string;
  /** Height. */
  height?: number | string;
}

/**
 * Box — the fundamental layout primitive. A flex View with token-resolved
 * spacing, color, and border props.
 */
export const Box = React.forwardRef<View, BoxProps>(
  (
    {
      bg,
      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,
      m,
      mx,
      my,
      mt,
      mb,
      rounded,
      borderWidth: bw,
      borderColor,
      flex,
      direction,
      align,
      justify,
      gap,
      width,
      height,
      style,
      ...props
    },
    ref,
  ) => {
    const resolvedStyle: ViewStyle = {
      backgroundColor: resolveColor(bg),
      padding: resolveSpacing(p),
      paddingHorizontal: resolveSpacing(px),
      paddingVertical: resolveSpacing(py),
      paddingTop: resolveSpacing(pt),
      paddingBottom: resolveSpacing(pb),
      paddingLeft: resolveSpacing(pl),
      paddingRight: resolveSpacing(pr),
      margin: resolveSpacing(m),
      marginHorizontal: resolveSpacing(mx),
      marginVertical: resolveSpacing(my),
      marginTop: resolveSpacing(mt),
      marginBottom: resolveSpacing(mb),
      borderRadius: resolveRadius(rounded),
      borderWidth: resolveBorderWidth(bw),
      borderColor: resolveColor(borderColor),
      flex,
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      gap: resolveSpacing(gap),
      width: width as ViewStyle['width'],
      height: height as ViewStyle['height'],
    };

    // Strip undefined values to avoid overriding defaults
    const cleaned = Object.fromEntries(
      Object.entries(resolvedStyle).filter(([, v]) => v !== undefined),
    ) as ViewStyle;

    return <View ref={ref} style={[cleaned, style as StyleProp<ViewStyle>]} {...props} />;
  },
);

Box.displayName = 'Box';
