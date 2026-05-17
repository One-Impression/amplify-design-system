import type { PressableProps, ViewProps } from 'react-native';

export interface TabProps extends Omit<PressableProps, 'style'> {
  /** Tab label text. */
  label: string;
  /** Whether this tab is active. */
  active?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Icon element. */
  icon?: React.ReactNode;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
