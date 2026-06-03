import { StyleSheet } from 'react-native';
import { sdui } from '@one-impression/tokens-creator/react-native';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: sdui.spacing.md,
  },
  title: {
    fontSize: sdui.fontSize.lg,
    fontWeight: '600',
    color: sdui.color.neutralStrong,
  },
});
