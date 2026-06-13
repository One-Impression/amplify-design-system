import type { PressableProps, ViewProps } from 'react-native';
import type { RadiusToken } from '../../tokens';

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
  /** Trailing element (checkbox, radio, badge). Ignored when `indicator` is set. */
  trailing?: React.ReactNode;
  /**
   * Built-in selection indicator rendered in the trailing slot, reflecting
   * `selected`. `radio` (filled circle + check) signals single-select;
   * `checkbox` (square + check) signals multi-select; `none` (default) renders
   * the `trailing` slot instead. Lets the affordance communicate the model.
   */
  indicator?: 'none' | 'radio' | 'checkbox';
  /**
   * Corner radius of the item container. Defaults to `none` (flush, for list
   * rows); pass a token (e.g. `md`) when rendering as a standalone card so it
   * matches the rest of the form's controls.
   */
  rounded?: RadiusToken | number;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
