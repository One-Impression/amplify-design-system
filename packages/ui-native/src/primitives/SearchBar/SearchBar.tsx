import React from 'react';
import { View, TextInput, Pressable, Text as RNText } from 'react-native';
import type { SearchBarProps } from './SearchBar.types';
import { styles } from './SearchBar.styles';

/**
 * SearchBar — a text input with search icon and optional clear button.
 */
export const SearchBar = React.forwardRef<TextInput, SearchBarProps>(
  ({ value, onChangeText, onClear, disabled = false, style, ...props }, ref) => {
    const showClear = value && value.length > 0 && onClear;

    return (
      <View style={[styles.container, disabled && styles.disabled]}>
        <RNText style={styles.searchIcon} accessibilityElementsHidden>
          ⌕
        </RNText>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          accessibilityRole="search"
          placeholder="Search..."
          placeholderTextColor="#78716C"
          style={[styles.input, style]}
          {...props}
        />
        {showClear && (
          <Pressable onPress={onClear} style={styles.clearButton} accessibilityLabel="Clear search">
            <RNText style={styles.clearText}>✕</RNText>
          </Pressable>
        )}
      </View>
    );
  },
);

SearchBar.displayName = 'SearchBar';
