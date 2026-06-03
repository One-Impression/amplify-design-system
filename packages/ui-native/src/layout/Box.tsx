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
  /** Border width token or raw number — applies to all four sides. */
  borderWidth?: BorderWidthToken | number;
  /** Border top width token or raw number. */
  borderTopWidth?: BorderWidthToken | number;
  /** Border bottom width token or raw number. */
  borderBottomWidth?: BorderWidthToken | number;
  /** Border left width token or raw number. */
  borderLeftWidth?: BorderWidthToken | number;
  /** Border right width token or raw number. */
  borderRightWidth?: BorderWidthToken | number;
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
  /** Positioning mode (e.g. 'absolute' for overlay layouts). */
  position?: ViewStyle['position'];
  /** Z-index for stacking absolute / overlay nodes. */
  zIndex?: number;
  /** Opacity (0..1) — useful for animated fade-in/out. */
  opacity?: number;
  /** Overflow handling for children that exceed the box bounds. */
  overflow?: ViewStyle['overflow'];
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
      borderTopWidth: btw,
      borderBottomWidth: bbw,
      borderLeftWidth: blw,
      borderRightWidth: brw,
      borderColor,
      flex,
      direction,
      align,
      justify,
      gap,
      width,
      height,
      position,
      zIndex,
      opacity,
      overflow,
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
      borderTopWidth: resolveBorderWidth(btw),
      borderBottomWidth: resolveBorderWidth(bbw),
      borderLeftWidth: resolveBorderWidth(blw),
      borderRightWidth: resolveBorderWidth(brw),
      borderColor: resolveColor(borderColor),
      flex,
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      gap: resolveSpacing(gap),
      width: width as ViewStyle['width'],
      height: height as ViewStyle['height'],
      position,
      zIndex,
      opacity,
      overflow,
    };

    // Strip undefined values to avoid overriding defaults
    const cleaned = Object.fromEntries(
      Object.entries(resolvedStyle).filter(([, v]) => v !== undefined),
    ) as ViewStyle;

    return <View ref={ref} style={[cleaned, style as StyleProp<ViewStyle>]} {...props} />;
  },
);

Box.displayName = 'Box';
