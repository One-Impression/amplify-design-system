import type { PressableProps, ViewProps } from 'react-native';

export interface SelectableItemProps extends Omit<PressableProps, 'style'> {
  /** Primary label text. */
  label: string;
  /** Secondary description text. */
  description?: string;
  /** Whether the item is selected. */
  selected?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Leading element (icon, avatar, image). */
  leading?: React.ReactNode;
  /** Trailing element (checkbox, radio, badge). */
  trailing?: React.ReactNode;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
