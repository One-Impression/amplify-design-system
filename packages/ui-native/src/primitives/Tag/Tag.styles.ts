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
    // component.tag rhythm — shares radius with button/field (8) and uses the
    // system font scale, so tags/chips no longer look sharper + smaller than
    // every other surface.
    paddingHorizontal: sdui.component.tag.paddingX,
    paddingVertical: sdui.component.tag.paddingY,
    borderRadius: sdui.component.tag.radius,
    borderWidth: sdui.borderWidth.thin,
    gap: sdui.spacing.xs,
    alignSelf: 'flex-start',
    // Clip an absolute-fill background node (e.g. a gradient) to the pill radius.
    overflow: 'hidden',
  },
  label: {
    fontSize: sdui.component.tag.fontSize,
    fontWeight: '500',
  },
});
