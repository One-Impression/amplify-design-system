import type { TextInputProps as RNTextInputProps } from 'react-native';
import type { ColorToken, SpacingToken, RadiusToken, FontSizeToken } from '../../tokens';

export interface InputProps extends Omit<RNTextInputProps, 'style'> {
  /** Label shown above the input. */
  label?: string;
  /**
   * Element rendered inside the field, before the text (icon, currency prefix,
   * country-code chip/dropdown trigger). Sits within the bordered container.
   */
  leading?: React.ReactNode;
  /** Element rendered inside the field, after the text (clear ✕, unit, toggle). */
  trailing?: React.ReactNode;
  /**
   * Material-style floating label: the `label` rests inside the field like a
   * placeholder when empty + unfocused, and animates to the top border on focus
   * or when the field has a value. When true, the static above-input label is
   * not rendered and the native placeholder only shows once floated.
   */
  floatingLabel?: boolean;
  /** Helper or error text below the input. */
  helperText?: string;
  /** Error state. */
  error?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Font size token. Defaults to 'md'. */
  size?: FontSizeToken | number;
  /** Border radius. Defaults to 'md' (matches the Button radius for consistency). */
  rounded?: RadiusToken | number;
  /** Additional style overrides for the input container. */
  style?: RNTextInputProps['style'];
}
