import { StyleSheet } from 'react-native';
import { sdui } from '@one-impression/tokens-creator/react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // Shared control sizing (field token group) so option rows match inputs +
    // buttons. minHeight keeps single-line rows at the control height; rows with
    // a description grow past it via the vertical padding.
    minHeight: sdui.component.field.height,
    paddingHorizontal: sdui.component.field.paddingX,
    paddingVertical: sdui.component.field.paddingY,
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
  // Selection indicators (radio = circle, checkbox = square).
  indicatorCircle: {
    width: 18,
    height: 18,
    borderRadius: sdui.radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorBox: {
    width: 18,
    height: 18,
    borderRadius: sdui.radius.xs,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorUnselected: {
    borderColor: sdui.color.neutralWeak,
    backgroundColor: sdui.color.transparent,
  },
  indicatorSelected: {
    borderColor: sdui.color.primary,
    backgroundColor: sdui.color.primary,
  },
  indicatorCheck: {
    color: sdui.color.neutralInverse,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 13,
  },
});
