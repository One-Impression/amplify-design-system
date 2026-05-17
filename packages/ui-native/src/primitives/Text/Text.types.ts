import type { TextProps as RNTextProps } from 'react-native';
import type { ColorToken, FontSizeToken, FontWeightToken, SpacingToken } from '../../tokens';

export type TextVariant = 'body' | 'caption' | 'label' | 'heading' | 'title' | 'display';

export interface TextProps extends Omit<RNTextProps, 'style'> {
  /** Semantic variant — sets default size + weight. */
  variant?: TextVariant;
  /** Color token or raw color string. */
  color?: ColorToken | string;
  /** Font size token or raw number. */
  size?: FontSizeToken | number;
  /** Font weight token. */
  weight?: FontWeightToken;
  /** Text alignment. */
  align?: 'left' | 'center' | 'right';
  /** Margin bottom for spacing. */
  mb?: SpacingToken | number;
  /** Additional RN style overrides. */
  style?: RNTextProps['style'];
}
