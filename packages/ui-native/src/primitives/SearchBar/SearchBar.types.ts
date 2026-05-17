import type { TextInputProps as RNTextInputProps } from 'react-native';

export interface SearchBarProps extends Omit<RNTextInputProps, 'style'> {
  /** Current search value. */
  value?: string;
  /** Called when text changes. */
  onChangeText?: (text: string) => void;
  /** Called when clear button is pressed. */
  onClear?: () => void;
  /** Disabled state. */
  disabled?: boolean;
  /** Additional style overrides for the container. */
  style?: RNTextInputProps['style'];
}
