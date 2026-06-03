import type { PressableProps, ViewProps } from 'react-native';

export interface TabProps extends Omit<PressableProps, 'style' | 'onPress'> {
  /** Tab label text. */
  label: string;
  /** Whether this tab is active. */
  active?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Icon element. */
  icon?: React.ReactNode;
  /**
   * Press handler. Explicit first-class prop so that wrappers (e.g. the
   * SDUI runtime's Clickable) can forward their tap callback to the inner
   * `Pressable` — taps land on the inner Pressable first and would
   * otherwise be swallowed.
   */
  onPress?: PressableProps['onPress'];
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
