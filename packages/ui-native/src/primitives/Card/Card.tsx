import React from 'react';
import { View } from 'react-native';
import type { CardProps } from './Card.types';
import { styles } from './Card.styles';
import {
  resolveColor,
  resolveSpacing,
  resolveRadius,
  resolveShadow,
} from '../../theme/resolvers';

/**
 * Card — an elevated, rounded container for grouped content.
 *
 * Two layers, because a single RN view can't both cast a shadow and clip its
 * children: the OUTER view owns the shadow (no `overflow:hidden`, so iOS doesn't
 * clip it) and the INNER view owns `overflow:hidden` + the border + padding, so
 * full-bleed children (a hero image, a coloured footer banner) clip cleanly to
 * the rounded corners. A card is defined by its shadow by default — pass a
 * `borderColor` for an explicit outline.
 */
export const Card = React.forwardRef<View, CardProps>(
  (
    {
      bg = 'neutralInverse',
      padding = 'md',
      rounded = 'lg',
      borderColor = 'neutralSubtle',
      elevation = 'none',
      mb,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const radius = resolveRadius(rounded);
    const hasBorder = borderColor !== undefined;
    return (
      <View
        ref={ref}
        style={[
          {
            backgroundColor: resolveColor(bg),
            borderRadius: radius,
            marginBottom: resolveSpacing(mb),
          },
          resolveShadow(elevation),
          style,
        ]}
        {...props}
      >
        <View
          style={[
            styles.inner,
            {
              borderRadius: radius,
              padding: resolveSpacing(padding),
              borderWidth: hasBorder ? 1 : 0,
              borderColor: resolveColor(borderColor),
            },
          ]}
        >
          {children}
        </View>
      </View>
    );
  },
);

Card.displayName = 'Card';
