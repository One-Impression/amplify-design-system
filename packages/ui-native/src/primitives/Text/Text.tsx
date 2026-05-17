import React from 'react';
import { Text as RNText } from 'react-native';
import type { TextProps } from './Text.types';
import { styles, variantStyles } from './Text.styles';
import { resolveColor, resolveFontSize, resolveFontWeight, resolveSpacing } from '../../theme/resolvers';

/**
 * Text — token-resolved typography primitive. Accepts a semantic variant
 * or individual size/weight/color overrides.
 */
export const Text = React.forwardRef<RNText, TextProps>(
  ({ variant = 'body', color, size, weight, align, mb, style, ...props }, ref) => {
    const variantDefaults = variantStyles[variant];

    return (
      <RNText
        ref={ref}
        style={[
          styles.base,
          {
            fontSize: resolveFontSize(size) ?? variantDefaults.fontSize,
            fontWeight: (resolveFontWeight(weight) ?? variantDefaults.fontWeight) as RNText['props']['style'] extends infer S ? S extends { fontWeight?: infer W } ? W : string : string,
            color: resolveColor(color) ?? styles.base.color,
            textAlign: align,
            marginBottom: resolveSpacing(mb),
          },
          style,
        ]}
        {...props}
      />
    );
  },
);

Text.displayName = 'Text';
