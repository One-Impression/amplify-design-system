import type { PressableProps, ViewProps } from 'react-native';
import type { ColorToken } from '../../tokens';

export interface ChipProps extends Omit<PressableProps, 'style'> {
  /** Label text. */
  label: string;
  /** Whether the chip is selected. */
  selected?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Icon element. */
  icon?: React.ReactNode;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
