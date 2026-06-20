import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  Text as RNText,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import { sdui } from '@one-impression/tokens-creator/react-native';
import type { InputProps } from './Input.types';
import { styles } from './Input.styles';
import { resolveRadius, resolveFontSize } from '../../theme/resolvers';

// An animated, pressable label container: it carries the floating-label
// animation (left/top) AND focuses the field on tap (the resting label sits over
// the placeholder slot with zIndex, so `pointerEvents:none` passthrough is not
// reliable on Android — pressing it to focus is).
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

    // Keep an internal handle to the TextInput (so the label can focus it) while
    // still forwarding the ref to the caller.
    const innerRef = useRef<TextInput | null>(null);
    const setRefs = useCallback(
      (node: TextInput | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref)
          (ref as React.MutableRefObject<TextInput | null>).current = node;
      },
      [ref],
    );

    // Resting label aligns with the text start — past any leading adornment.
    // Resting (placeholder): aligned with the text start — shifted past a
    // leading adornment so it doesn't overlap it. Floated: snaps to the field's
    // standard top-left corner regardless of adornments (cleaner notch; labels
    // the whole field). So `left` animates leftward as the label floats up.
    const restingLeft =
      sdui.component.field.paddingX +
      (leading ? leadingWidth + sdui.spacing.sm : 0);
    const floatedLeft = sdui.component.field.paddingX;

    // Positioning animates on the pressable container; type styling on the Text.
    const labelPosStyle = {
      left: anim.interpolate({
        inputRange: [0, 1],
        outputRange: [restingLeft, floatedLeft],
      }),
      top: anim.interpolate({ inputRange: [0, 1], outputRange: [14, -10] }),
    };
    const labelTextStyle = {
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
          <AnimatedPressable
            // The resting label sits over the placeholder slot, so a tap on it
            // must focus the field (passthrough is unreliable on Android because
            // the label is z-lifted for the floated notch). Pressing focuses.
            onPress={() => innerRef.current?.focus()}
            disabled={disabled}
            style={[styles.floatLabel, labelPosStyle]}
          >
            <Animated.Text numberOfLines={1} style={labelTextStyle}>
              {label}
            </Animated.Text>
          </AnimatedPressable>
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
              ref={setRefs}
              editable={!disabled}
              accessibilityLabel={label}
              style={[styles.input, { fontSize: resolveFontSize(size) ?? 14 }]}
              placeholderTextColor="#78716C"
              {...props}
              // The label occupies the placeholder slot while resting, so the
              // real placeholder is shown ONLY once the label floats up (focus
              // or value) — otherwise they overlap. Set AFTER {...props} so this
              // wins over props.placeholder rather than being re-overridden.
              placeholder={floated ? props.placeholder : undefined}
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
