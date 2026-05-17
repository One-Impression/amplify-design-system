import { StyleSheet } from 'react-native';
import { sdui } from '@amplify-ai/tokens-creator/react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sdui.spacing.sm,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: sdui.radius.xs,
    borderWidth: sdui.borderWidth.medium,
    borderColor: sdui.color.neutralWeak,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: sdui.color.primary,
    borderColor: sdui.color.primary,
  },
  checkmark: {
    color: sdui.color.neutralInverse,
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    fontSize: sdui.fontSize.md,
    color: sdui.color.neutralStrong,
  },
  disabled: {
    opacity: 0.5,
  },
});
