import type { PressableProps, ViewProps } from 'react-native';
import type { ColorToken } from '../../tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Visual variant. Defaults to 'primary'. */
  variant?: ButtonVariant;
  /** Size. Defaults to 'md'. */
  size?: ButtonSize;
  /** Loading state — disables press and shows spinner. */
  loading?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Icon element rendered before the label. */
  icon?: React.ReactNode;
  /** Icon position. Defaults to 'left'. */
  iconPosition?: 'left' | 'right';
  /** Button label text. */
  children?: React.ReactNode;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
