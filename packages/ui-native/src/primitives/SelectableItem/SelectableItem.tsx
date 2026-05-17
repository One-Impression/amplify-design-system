import React from 'react';
import { Pressable, View, Text as RNText } from 'react-native';
import type { SelectableItemProps } from './SelectableItem.types';
import { styles } from './SelectableItem.styles';

/**
 * SelectableItem — a list item with leading/trailing slots, pressable
 * for selection. Used in SDUI lists, settings, multi-select surfaces.
 */
export const SelectableItem = React.forwardRef<View, SelectableItemProps>(
  (
    {
      label,
      description,
      selected = false,
      disabled = false,
      leading,
      trailing,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        style={[
          styles.container,
          selected && styles.selected,
          disabled && styles.disabled,
          style,
        ]}
        {...props}
      >
        {leading}
        <View style={styles.content}>
          <RNText style={styles.label}>{label}</RNText>
          {description && <RNText style={styles.description}>{description}</RNText>}
        </View>
        {trailing}
      </Pressable>
    );
  },
);

SelectableItem.displayName = 'SelectableItem';
