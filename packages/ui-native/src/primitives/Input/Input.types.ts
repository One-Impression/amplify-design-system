import type { TextInputProps as RNTextInputProps } from 'react-native';
import type { ColorToken, SpacingToken, RadiusToken, FontSizeToken } from '../../tokens';

export interface InputProps extends Omit<RNTextInputProps, 'style'> {
  /** Label shown above the input. */
  label?: string;
  /** Helper or error text below the input. */
  helperText?: string;
  /** Error state. */
  error?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Font size token. Defaults to 'md'. */
  size?: FontSizeToken | number;
  /** Border radius. Defaults to 'sm'. */
  rounded?: RadiusToken | number;
  /** Additional style overrides for the input container. */
  style?: RNTextInputProps['style'];
}
