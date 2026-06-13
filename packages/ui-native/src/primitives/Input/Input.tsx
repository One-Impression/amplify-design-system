import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Text as RNText, Animated, Easing } from 'react-native';
import { sdui } from '@one-impression/tokens-creator/react-native';
import type { InputProps } from './Input.types';
import { styles } from './Input.styles';
import { resolveRadius, resolveFontSize } from '../../theme/resolvers';

/**
 * Input — a text input with label/helper/error, optional `leading`/`trailing`
 * adornments (icon, prefix, country chip, clear button), and a Material-style
 * `floatingLabel`. The border lives on the row container so adornments sit
 * inside the field; the TextInput itself is borderless.
 */
export const Input = React.forwardRef<TextInput, InputProps>((props, ref) => {
  if (props.floatingLabel && props.label) {
    return <FloatingLabelInput {...props} ref={ref} />;
  }

  const {
    label,
    floatingLabel: _floatingLabel,
    leading,
    trailing,
    helperText,
    error = false,
    disabled = false,
    size = 'md',
    rounded = 'md',
    style,
    ...rest
  } = props;

  return (
    <View style={styles.container}>
      {label && <RNText style={styles.label}>{label}</RNText>}
      <View
        style={[
          styles.inputRow,
          { borderRadius: resolveRadius(rounded) },
          error && styles.inputError,
          disabled && styles.inputDisabled,
          style,
        ]}
      >
        {leading}
        <TextInput
          ref={ref}
          editable={!disabled}
          accessibilityLabel={label}
          style={[styles.input, { fontSize: resolveFontSize(size) ?? 14 }]}
          placeholderTextColor="#78716C"
          {...rest}
        />
        {trailing}
      </View>
      {helperText && (
        <RNText style={[styles.helperText, error && styles.helperError]}>
          {helperText}
        </RNText>
      )}
    </View>
  );
});

Input.displayName = 'Input';

/**
 * Material-style outlined input: the label rests in the placeholder position
 * when empty + unfocused, and animates to the top border on focus or value.
 * A leading adornment shifts the resting label right by the measured width.
 */
const FloatingLabelInput = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      floatingLabel: _floatingLabel,
      leading,
      trailing,
      helperText,
      error = false,
      disabled = false,
      size = 'md',
      rounded = 'md',
      style,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [leadingWidth, setLeadingWidth] = useState(0);
    const hasValue = props.value != null && String(props.value).length > 0;
    const floated = focused || hasValue;
    const anim = useRef(new Animated.Value(floated ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(anim, {
        toValue: floated ? 1 : 0,
        duration: 180,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    }, [floated, anim]);

    // Resting label aligns with the text start — past any leading adornment.
    const labelLeft =
      sdui.component.field.paddingX +
      (leading ? leadingWidth + sdui.spacing.sm : 0);

    const labelStyle = {
      left: labelLeft,
      top: anim.interpolate({ inputRange: [0, 1], outputRange: [14, -10] }),
      // Resting = body size (placeholder-equivalent); floated = caption size
      // (matches helper/error text). Token-driven so it tracks the type scale.
      fontSize: anim.interpolate({
        inputRange: [0, 1],
        outputRange: [sdui.fontSize.lg, sdui.fontSize.sm],
      }),
      color: error
        ? sdui.color.negative
        : floated
          ? sdui.color.neutralStrong
          : sdui.color.neutralMedium,
    };

    return (
      <View style={styles.container}>
        <View style={styles.floatWrap}>
          <Animated.Text
            pointerEvents="none"
            numberOfLines={1}
            style={[styles.floatLabel, labelStyle]}
          >
            {label}
          </Animated.Text>
          <View
            style={[
              styles.inputRow,
              { borderRadius: resolveRadius(rounded) },
              error && styles.inputError,
              disabled && styles.inputDisabled,
              style,
            ]}
          >
            {leading && (
              <View onLayout={(e) => setLeadingWidth(e.nativeEvent.layout.width)}>
                {leading}
              </View>
            )}
            <TextInput
              ref={ref}
              editable={!disabled}
              accessibilityLabel={label}
              style={[styles.input, { fontSize: resolveFontSize(size) ?? 14 }]}
              placeholderTextColor="#78716C"
              // The label occupies the placeholder slot until it floats up.
              placeholder={floated ? props.placeholder : undefined}
              {...props}
              onFocus={(e) => {
                setFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                props.onBlur?.(e);
              }}
            />
            {trailing}
          </View>
        </View>
        {helperText && (
          <RNText style={[styles.helperText, error && styles.helperError]}>
            {helperText}
          </RNText>
        )}
      </View>
    );
  },
);

FloatingLabelInput.displayName = 'FloatingLabelInput';
