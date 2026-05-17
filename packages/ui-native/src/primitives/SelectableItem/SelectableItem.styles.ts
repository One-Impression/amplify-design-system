import { StyleSheet } from 'react-native';
import { sdui } from '@amplify-ai/tokens-creator/react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sdui.spacing.lg,
    paddingVertical: sdui.spacing.md,
    gap: sdui.spacing.md,
    backgroundColor: sdui.color.neutralInverse,
  },
  selected: {
    backgroundColor: sdui.color.primaryWeak,
  },
  content: {
    flex: 1,
    gap: sdui.spacing.xs,
  },
  label: {
    fontSize: sdui.fontSize.md,
    fontWeight: '500',
    color: sdui.color.neutralStrong,
  },
  description: {
    fontSize: sdui.fontSize.sm,
    color: sdui.color.neutralMedium,
  },
  disabled: {
    opacity: 0.5,
  },
});
