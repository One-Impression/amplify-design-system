import type { PressableProps, ViewProps } from 'react-native';

export interface RadioProps extends Omit<PressableProps, 'style'> {
  /** Whether this radio is selected. */
  selected?: boolean;
  /** Label text. */
  label?: string;
  /** Disabled state. */
  disabled?: boolean;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
