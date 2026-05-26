import React from 'react';
import { Pressable, ActivityIndicator, View } from 'react-native';
import { Text } from '../Text/Text';
import type { ButtonProps } from './Button.types';
import { styles, variantColors, sizeStyles } from './Button.styles';

/**
 * Button — token-driven pressable with variant, size, loading, and icon support.
 * Uses SDUI component.button tokens for sizing.
 */
export const Button = React.forwardRef<View, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      children,
      style,
      onPress,
      ...props
    },
    ref,
  ) => {
    const colors = variantColors[variant];
    const sizing = sizeStyles[size];
    const isDisabled = disabled || loading;

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={[
          styles.base,
          {
            backgroundColor: colors.bg,
            height: sizing.height,
            paddingHorizontal: sizing.paddingHorizontal,
            borderWidth: colors.border ? 1 : 0,
            borderColor: colors.border,
          },
          isDisabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        {...props}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {typeof children === 'string' ? (
              <Text
                style={[styles.label, { color: colors.text, fontSize: sizing.fontSize }]}
              >
                {children}
              </Text>
            ) : (
              children
            )}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </Pressable>
    );
  },
);

Button.displayName = 'Button';
