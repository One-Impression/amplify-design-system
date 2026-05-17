import React from 'react';
import { View, TextInput, Text as RNText } from 'react-native';
import type { InputProps } from './Input.types';
import { styles } from './Input.styles';
import { resolveRadius, resolveFontSize } from '../../theme/resolvers';

/**
 * Input — a text input with label and helper text support.
 */
export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      helperText,
      error = false,
      disabled = false,
      size = 'md',
      rounded = 'sm',
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <View style={styles.container}>
        {label && <RNText style={styles.label}>{label}</RNText>}
        <TextInput
          ref={ref}
          editable={!disabled}
          accessibilityLabel={label}
          style={[
            styles.input,
            {
              fontSize: resolveFontSize(size) ?? 14,
              borderRadius: resolveRadius(rounded),
            },
            error && styles.inputError,
            disabled && styles.inputDisabled,
            style,
          ]}
          placeholderTextColor="#78716C"
          {...props}
        />
        {helperText && (
          <RNText style={[styles.helperText, error && styles.helperError]}>
            {helperText}
          </RNText>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';
