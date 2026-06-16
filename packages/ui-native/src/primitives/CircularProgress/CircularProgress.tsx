import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { CircularProgressProps } from './CircularProgress.types';
import { styles } from './CircularProgress.styles';
import { resolveColor } from '../../theme/resolvers';

/**
 * CircularProgress — a circular ring showing completion progress, with optional
 * centered content (typically a percentage label). The SVG arc is drawn via a
 * dashed `Circle` whose dash offset encodes the fraction; rotated -90° so it
 * starts at 12 o'clock and fills clockwise.
 */
export const CircularProgress = React.forwardRef<View, CircularProgressProps>(
  (
    {
      value,
      size = 44,
      strokeWidth = 4,
      trackColor = 'neutralSubtle',
      fillColor = 'primary',
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const clamped = Math.max(0, Math.min(1, value));
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - clamped);

    return (
      <View
        ref={ref}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
        style={[styles.container, { width: size, height: size }, style]}
        {...props}
      >
        <Svg width={size} height={size} style={styles.svg}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={resolveColor(trackColor)}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={resolveColor(fillColor)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>
        {children}
      </View>
    );
  },
);

CircularProgress.displayName = 'CircularProgress';
