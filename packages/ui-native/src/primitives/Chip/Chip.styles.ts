import { StyleSheet } from 'react-native';
import { sdui } from '@one-impression/tokens-creator/react-native';

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sdui.spacing.md,
    paddingVertical: sdui.spacing.xs,
    borderRadius: sdui.radius.full,
    borderWidth: sdui.borderWidth.thin,
    borderColor: sdui.color.neutralSubtle,
    backgroundColor: sdui.color.neutralInverse,
    gap: sdui.spacing.xs,
  },
  selected: {
    backgroundColor: sdui.color.primaryWeak,
    borderColor: sdui.color.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: sdui.fontSize.sm,
    fontWeight: '500',
    color: sdui.color.neutralStrong,
  },
  labelSelected: {
    color: sdui.color.primary,
  },
});
