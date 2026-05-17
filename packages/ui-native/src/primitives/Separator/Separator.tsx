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

    return (
      <View
        ref={ref}
        accessibilityRole="none"
        style={[
          isHorizontal ? styles.horizontal : styles.vertical,
          {
            backgroundColor: resolvedColor,
            [isHorizontal ? 'height' : 'width']: thickness,
            marginVertical: isHorizontal ? resolvedSpacing : undefined,
            marginHorizontal: isHorizontal ? undefined : resolvedSpacing,
          },
          style,
        ]}
        {...props}
      />
    );
  },
);

Separator.displayName = 'Separator';
