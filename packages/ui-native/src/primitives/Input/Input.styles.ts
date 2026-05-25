import { StyleSheet } from 'react-native';
import { sdui } from '@one-impression/tokens-creator/react-native';

export const styles = StyleSheet.create({
  container: {
    gap: sdui.spacing.xs,
  },
  input: {
    borderWidth: sdui.borderWidth.thin,
    borderColor: sdui.color.neutralSubtle,
    borderRadius: sdui.radius.sm,
    paddingHorizontal: sdui.spacing.md,
    paddingVertical: sdui.spacing.sm,
    fontSize: sdui.fontSize.md,
    color: sdui.color.neutralStrong,
    backgroundColor: sdui.color.neutralInverse,
  },
  inputError: {
    borderColor: sdui.color.negative,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: sdui.fontSize.sm,
    fontWeight: '500',
    color: sdui.color.neutralStrong,
  },
  helperText: {
    fontSize: sdui.fontSize.xs,
    color: sdui.color.neutralMedium,
  },
  helperError: {
    color: sdui.color.negative,
  },
});
