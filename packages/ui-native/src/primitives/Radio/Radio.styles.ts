import { StyleSheet } from 'react-native';
import { sdui } from '@one-impression/tokens-creator/react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sdui.spacing.sm,
  },
  outer: {
    width: 20,
    height: 20,
    borderRadius: sdui.radius.full,
    borderWidth: sdui.borderWidth.medium,
    borderColor: sdui.color.neutralWeak,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerSelected: {
    borderColor: sdui.color.primary,
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: sdui.radius.full,
    backgroundColor: sdui.color.primary,
  },
  label: {
    fontSize: sdui.fontSize.md,
    color: sdui.color.neutralStrong,
  },
  disabled: {
    opacity: 0.5,
  },
});
