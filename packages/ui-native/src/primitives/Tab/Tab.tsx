import React from 'react';
import { Pressable, View, Text as RNText } from 'react-native';
import type { TabProps } from './Tab.types';
import { styles } from './Tab.styles';

/**
 * Tab — a single tab item. Use inside a horizontal ScrollView or Row
 * for a tab bar. Active state is controlled by the consumer.
 */
export const Tab = React.forwardRef<View, TabProps>(
  (
    { label, active = false, disabled = false, icon, style, onPress, ...props },
    ref,
  ) => {
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        accessibilityRole="tab"
        accessibilityState={{ selected: active, disabled }}
        style={[
          styles.base,
          active && styles.active,
          disabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        {...props}
      >
        {icon}
        <RNText style={[styles.label, active && styles.labelActive]}>{label}</RNText>
      </Pressable>
    );
  },
);

Tab.displayName = 'Tab';
