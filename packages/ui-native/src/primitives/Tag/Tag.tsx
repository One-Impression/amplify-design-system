import React from 'react';
import { View, Text as RNText } from 'react-native';
import type { TagProps } from './Tag.types';
import { styles, variantColors } from './Tag.styles';
import { resolveColor } from '../../theme/resolvers';

/**
 * Tag — a small status / value label (e.g. "Applied", "Cash ₹2400").
 *
 * Color resolution: an explicit `background` node (e.g. a gradient) wins and
 * makes the pill transparent + borderless so the node shows through (the pill
 * clips it). Otherwise `bgColor` / `textColor` override the `variant` defaults.
 */
export const Tag = React.forwardRef<View, TagProps>(
  ({ label, variant = 'default', icon, bgColor, textColor, background, style, ...props }, ref) => {
    const colors = variantColors[variant];
    const hasBgNode = background != null;
    const bg = hasBgNode ? 'transparent' : bgColor ? resolveColor(bgColor) : colors.bg;
    const text = textColor ? resolveColor(textColor) : hasBgNode ? '#FFFFFF' : colors.text;
    const border = hasBgNode || bgColor ? 'transparent' : colors.border;

    return (
      <View
        ref={ref}
        style={[styles.base, { backgroundColor: bg, borderColor: border }, style]}
        {...props}
      >
        {background}
        {icon}
        <RNText style={[styles.label, { color: text }]}>{label}</RNText>
      </View>
    );
  },
);

Tag.displayName = 'Tag';
