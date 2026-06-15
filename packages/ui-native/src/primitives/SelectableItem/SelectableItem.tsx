import React from 'react';
import { Pressable, View, Text as RNText } from 'react-native';
import type { SelectableItemProps } from './SelectableItem.types';
import { styles } from './SelectableItem.styles';
import { resolveRadius } from '../../theme/resolvers';

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
      indicator = 'none',
      rounded = 'none',
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
          { borderRadius: resolveRadius(rounded) },
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
        {indicator === 'none' ? (
          trailing
        ) : (
          <SelectionIndicator kind={indicator} selected={selected} />
        )}
      </Pressable>
    );
  },
);

/** Trailing radio (circle) / checkbox (square) that reflects `selected`. */
function SelectionIndicator({
  kind,
  selected,
}: {
  kind: 'radio' | 'checkbox';
  selected: boolean;
}): React.ReactElement {
  return (
    <View
      style={[
        kind === 'radio' ? styles.indicatorCircle : styles.indicatorBox,
        selected ? styles.indicatorSelected : styles.indicatorUnselected,
      ]}
    >
      {selected && <RNText style={styles.indicatorCheck}>✓</RNText>}
    </View>
  );
}

SelectableItem.displayName = 'SelectableItem';
