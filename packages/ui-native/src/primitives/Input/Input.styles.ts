import { StyleSheet } from 'react-native';
import { sdui } from '@one-impression/tokens-creator/react-native';

export const styles = StyleSheet.create({
  container: {
    gap: sdui.spacing.xs,
    marginTop: sdui.spacing.sm,
  },
  // The bordered container row: holds [leading] [TextInput] [trailing]. Shared
  // control sizing (field token group) lives here so inputs, select rows, and
  // buttons share one rhythm; the TextInput inside is borderless.
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sdui.spacing.sm,
    borderWidth: sdui.borderWidth.thin,
    borderColor: sdui.color.neutralSubtle,
    borderRadius: sdui.component.field.radius,
    minHeight: sdui.component.field.height,
    paddingHorizontal: sdui.component.field.paddingX,
    backgroundColor: sdui.color.neutralInverse,
  },
  input: {
    flex: 1,
    paddingVertical: sdui.component.field.paddingY,
    fontSize: sdui.fontSize.md,
    color: sdui.color.neutralStrong,
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
    fontSize: sdui.fontSize.sm,
    color: sdui.color.neutralMedium,
  },
  helperError: {
    color: sdui.color.negative,
  },
  // Floating-label variant.
  floatWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  floatLabel: {
    position: 'absolute',
    left: sdui.spacing.md,
    // A small inverse-surface pad so the floated label "cuts" the top border.
    paddingHorizontal: sdui.spacing.xs,
    backgroundColor: sdui.color.neutralInverse,
    zIndex: 1,
  },
});
