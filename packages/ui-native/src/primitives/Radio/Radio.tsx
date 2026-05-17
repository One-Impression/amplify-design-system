import React from 'react';
import { Pressable, View, Text as RNText } from 'react-native';
import type { RadioProps } from './Radio.types';
import { styles } from './Radio.styles';

/**
 * Radio — a single radio button with optional label.
 * Group logic (mutual exclusion) is handled by the consumer.
 */
export const Radio = React.forwardRef<View, RadioProps>(
  ({ selected = false, label, disabled = false, style, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityState={{ selected, disabled }}
        style={[styles.container, disabled && styles.disabled, style]}
        {...props}
      >
        <View style={[styles.outer, selected && styles.outerSelected]}>
          {selected && <View style={styles.inner} />}
        </View>
        {label && <RNText style={styles.label}>{label}</RNText>}
      </Pressable>
    );
  },
);

Radio.displayName = 'Radio';
