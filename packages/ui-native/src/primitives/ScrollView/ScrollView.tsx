import React from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import type { ScrollViewProps } from './ScrollView.types';
import { styles } from './ScrollView.styles';
import { resolveColor, resolveSpacing } from '../../theme/resolvers';

/**
 * ScrollView — a token-aware scrollable container.
 */
export const ScrollView = React.forwardRef<RNScrollView, ScrollViewProps>(
  ({ bg, padding, style, ...props }, ref) => {
    return (
      <RNScrollView
        ref={ref}
        style={[
          styles.base,
          {
            backgroundColor: resolveColor(bg),
          },
          style,
        ]}
        contentContainerStyle={{ padding: resolveSpacing(padding) }}
        {...props}
      />
    );
  },
);

ScrollView.displayName = 'ScrollView';
