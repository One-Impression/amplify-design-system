import type { PressableProps, ViewProps } from 'react-native';

export interface CheckboxProps extends Omit<PressableProps, 'style'> {
  /** Whether the checkbox is checked. */
  checked?: boolean;
  /** Label text. */
  label?: string;
  /** Disabled state. */
  disabled?: boolean;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
