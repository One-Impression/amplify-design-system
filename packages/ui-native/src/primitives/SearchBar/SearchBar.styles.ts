import { StyleSheet } from 'react-native';
import { sdui } from '@one-impression/tokens-creator/react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: sdui.color.neutralSubtle,
    borderRadius: sdui.radius.md,
    paddingHorizontal: sdui.spacing.md,
    height: 40,
    gap: sdui.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: sdui.fontSize.md,
    color: sdui.color.neutralStrong,
    padding: 0,
  },
  searchIcon: {
    fontSize: sdui.fontSize.lg,
    color: sdui.color.neutralMedium,
  },
  clearButton: {
    padding: sdui.spacing.xs,
  },
  clearText: {
    fontSize: sdui.fontSize.sm,
    color: sdui.color.neutralMedium,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
