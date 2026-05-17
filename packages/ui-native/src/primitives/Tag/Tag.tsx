import React from 'react';
import { View, Text as RNText } from 'react-native';
import type { TagProps } from './Tag.types';
import { styles, variantColors } from './Tag.styles';

/**
 * Tag — a small status label for metadata display (e.g. "Active", "Pending").
 */
export const Tag = React.forwardRef<View, TagProps>(
  ({ label, variant = 'default', icon, style, ...props }, ref) => {
    const colors = variantColors[variant];

    return (
      <View
        ref={ref}
        style={[
          styles.base,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border,
          },
          style,
        ]}
        {...props}
      >
        {icon}
        <RNText style={[styles.label, { color: colors.text }]}>{label}</RNText>
      </View>
    );
  },
);

Tag.displayName = 'Tag';
