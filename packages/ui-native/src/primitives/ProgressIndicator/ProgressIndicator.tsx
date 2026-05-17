import React from 'react';
import { View } from 'react-native';
import type { ProgressIndicatorProps } from './ProgressIndicator.types';
import { styles } from './ProgressIndicator.styles';
import { resolveColor, resolveRadius } from '../../theme/resolvers';

/**
 * ProgressIndicator — a horizontal bar showing completion progress.
 */
export const ProgressIndicator = React.forwardRef<View, ProgressIndicatorProps>(
  (
    {
      value,
      trackColor = 'neutralSubtle',
      fillColor = 'primary',
      height = 4,
      rounded = 'full',
      style,
      ...props
    },
    ref,
  ) => {
    const clamped = Math.max(0, Math.min(1, value));
    const borderRadius = resolveRadius(rounded);

    return (
      <View
        ref={ref}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
        style={[
          styles.track,
          {
            height,
            borderRadius,
            backgroundColor: resolveColor(trackColor),
          },
          style,
        ]}
        {...props}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clamped * 100}%`,
              borderRadius,
              backgroundColor: resolveColor(fillColor),
            },
          ]}
        />
      </View>
    );
  },
);

ProgressIndicator.displayName = 'ProgressIndicator';
