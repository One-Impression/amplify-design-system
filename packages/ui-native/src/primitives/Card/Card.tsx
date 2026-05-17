import React from 'react';
import { View } from 'react-native';
import type { CardProps } from './Card.types';
import { styles } from './Card.styles';
import { resolveColor, resolveSpacing, resolveRadius } from '../../theme/resolvers';

/**
 * Card — a bordered, padded container for grouped content.
 */
export const Card = React.forwardRef<View, CardProps>(
  (
    {
      bg = 'neutralInverse',
      padding = 'lg',
      rounded = 'md',
      borderColor = 'neutralSubtle',
      mb,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <View
        ref={ref}
        style={[
          styles.base,
          {
            backgroundColor: resolveColor(bg),
            padding: resolveSpacing(padding),
            borderRadius: resolveRadius(rounded),
            borderColor: resolveColor(borderColor),
            marginBottom: resolveSpacing(mb),
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  },
);

Card.displayName = 'Card';
