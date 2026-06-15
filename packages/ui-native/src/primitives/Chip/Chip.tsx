import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '../Text/Text';
import type { ChipProps } from './Chip.types';
import { styles } from './Chip.styles';

/**
 * Chip — a compact, selectable element for filters and multi-select.
 */
export const Chip = React.forwardRef<View, ChipProps>(
  ({ label, selected = false, disabled = false, icon, trailingIcon, style, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        style={[
          styles.base,
          selected && styles.selected,
          disabled && styles.disabled,
          style,
        ]}
        {...props}
      >
        {icon}
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
        {trailingIcon}
      </Pressable>
    );
  },
);

Chip.displayName = 'Chip';
