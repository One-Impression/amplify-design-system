import React from 'react';
import { View, Text as RNText } from 'react-native';
import type { SectionProps } from './Section.types';
import { styles } from './Section.styles';
import { resolveColor, resolveSpacing } from '../../theme/resolvers';

/**
 * Section — a content group with an optional header row (title + trailing action).
 * Common in SDUI page layouts for "Campaigns", "Earnings", etc.
 */
export const Section = React.forwardRef<View, SectionProps>(
  (
    {
      title,
      headerRight,
      bg,
      padding = 'lg',
      mb = 'lg',
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
          {
            backgroundColor: resolveColor(bg),
            padding: resolveSpacing(padding),
            marginBottom: resolveSpacing(mb),
          },
          style,
        ]}
        {...props}
      >
        {(title || headerRight) && (
          <View style={styles.header}>
            {title && <RNText style={styles.title}>{title}</RNText>}
            {headerRight}
          </View>
        )}
        {children}
      </View>
    );
  },
);

Section.displayName = 'Section';
