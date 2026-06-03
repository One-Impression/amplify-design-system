import { StyleSheet } from 'react-native';
import { sdui } from '@one-impression/tokens-creator/react-native';
import type { TagVariant } from './Tag.types';

type VariantColors = { bg: string; text: string; border: string };

export const variantColors: Record<TagVariant, VariantColors> = {
  default: { bg: sdui.color.neutralInverse, text: sdui.color.neutralStrong, border: sdui.color.neutralSubtle },
  primary: { bg: sdui.color.primaryWeak, text: sdui.color.primary, border: sdui.color.primary },
  positive: { bg: sdui.color.positiveWeak, text: sdui.color.positive, border: sdui.color.positive },
  negative: { bg: sdui.color.negativeWeak, text: sdui.color.negative, border: sdui.color.negative },
  notice: { bg: sdui.color.noticeWeak, text: sdui.color.notice, border: sdui.color.notice },
  neutral: { bg: sdui.color.neutralSubtle, text: sdui.color.neutralMedium, border: sdui.color.neutralSubtle },
};

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sdui.spacing.sm,
    paddingVertical: sdui.spacing.xs,
    borderRadius: sdui.radius.xs,
    borderWidth: sdui.borderWidth.thin,
    gap: sdui.spacing.xs,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: sdui.fontSize.xs,
    fontWeight: '500',
  },
});
