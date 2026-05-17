import { StyleSheet } from 'react-native';
import { sdui } from '@amplify-ai/tokens-creator/react-native';
import type { ButtonVariant, ButtonSize } from './Button.types';

type VariantColors = { bg: string; text: string; border?: string };

export const variantColors: Record<ButtonVariant, VariantColors> = {
  primary: { bg: sdui.color.primary, text: sdui.color.neutralInverse },
  secondary: { bg: sdui.color.primaryWeak, text: sdui.color.primary },
  ghost: { bg: 'transparent', text: sdui.color.neutralStrong },
  outline: { bg: 'transparent', text: sdui.color.neutralStrong, border: sdui.color.neutralSubtle },
  destructive: { bg: sdui.color.negative, text: sdui.color.neutralInverse },
};

export const sizeStyles: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number }> = {
  sm: {
    height: sdui.component.button.heightSm,
    paddingHorizontal: sdui.component.button.paddingXSm,
    fontSize: sdui.component.button.fontSizeSm,
  },
  md: {
    height: sdui.component.button.heightMd,
    paddingHorizontal: sdui.component.button.paddingXMd,
    fontSize: sdui.component.button.fontSizeMd,
  },
  lg: {
    height: sdui.component.button.heightLg,
    paddingHorizontal: sdui.component.button.paddingXLg,
    fontSize: sdui.component.button.fontSizeLg,
  },
};

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: sdui.component.button.radius,
    gap: sdui.spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: '600',
  },
});
