import React from 'react';
import { View } from 'react-native';
import type { SeparatorProps } from './Separator.types';
import { styles } from './Separator.styles';
import { resolveColor, resolveSpacing } from '../../theme/resolvers';

/**
 * Separator — a thin line to visually divide content sections.
 */
export const Separator = React.forwardRef<View, SeparatorProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'solid',
      color = 'neutralSubtle',
      thickness = 1,
      spacing,
      style,
      ...props
    },
    ref,
  ) => {
    const resolvedColor = resolveColor(color);
    const resolvedSpacing = resolveSpacing(spacing);
    const isHorizontal = orientation === 'horizontal';

    // The spacing/margin logic is identical across all variants.
    const spacingStyle = {
      marginVertical: isHorizontal ? resolvedSpacing : undefined,
      marginHorizontal: isHorizontal ? undefined : resolvedSpacing,
    };

    // 'solid' keeps the filled-View approach: a backgroundColor fills the
    // thickness-sized box. A filled view cannot be dashed/dotted, so
    // 'dashed'/'dotted' instead draw a border (the line) on a zero-extent,
    // transparent View.
    const lineStyle =
      variant === 'solid'
        ? {
            backgroundColor: resolvedColor,
            [isHorizontal ? 'height' : 'width']: thickness,
          }
        : isHorizontal
          ? {
              height: 0,
              borderTopWidth: thickness,
              borderStyle: variant,
              borderColor: resolvedColor,
            }
          : {
              width: 0,
              borderLeftWidth: thickness,
              borderStyle: variant,
              borderColor: resolvedColor,
            };

    return (
      <View
        ref={ref}
        accessibilityRole="none"
        style={[
          isHorizontal ? styles.horizontal : styles.vertical,
          lineStyle,
          spacingStyle,
          style,
        ]}
        {...props}
      />
    );
  },
);

Separator.displayName = 'Separator';
