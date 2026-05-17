import React from 'react';
import { Pressable, View, Text as RNText } from 'react-native';
import type { CheckboxProps } from './Checkbox.types';
import { styles } from './Checkbox.styles';

/**
 * Checkbox — a toggleable check control with optional label.
 */
export const Checkbox = React.forwardRef<View, CheckboxProps>(
  ({ checked = false, label, disabled = false, style, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
        style={[styles.container, disabled && styles.disabled, style]}
        {...props}
      >
        <View style={[styles.box, checked && styles.boxChecked]}>
          {checked && <RNText style={styles.checkmark}>✓</RNText>}
        </View>
        {label && <RNText style={styles.label}>{label}</RNText>}
      </Pressable>
    );
  },
);

Checkbox.displayName = 'Checkbox';
