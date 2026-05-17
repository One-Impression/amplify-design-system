import { StyleSheet } from 'react-native';
import { sdui } from '@amplify-ai/tokens-creator/react-native';

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sdui.spacing.lg,
    paddingVertical: sdui.spacing.sm,
    gap: sdui.spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  active: {
    borderBottomColor: sdui.color.primary,
  },
  label: {
    fontSize: sdui.fontSize.md,
    fontWeight: '500',
    color: sdui.color.neutralMedium,
  },
  labelActive: {
    color: sdui.color.primary,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
