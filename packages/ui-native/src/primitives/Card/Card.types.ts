import type { ViewProps } from 'react-native';
import type { ColorToken, SpacingToken, RadiusToken } from '../../tokens';

export interface CardProps extends Omit<ViewProps, 'style'> {
  /** Background color. Defaults to 'neutralInverse' (white). */
  bg?: ColorToken | string;
  /** Inner padding. Defaults to 'lg'. */
  padding?: SpacingToken | number;
  /** Border radius. Defaults to 'md'. */
  rounded?: RadiusToken | number;
  /** Border color. Defaults to 'neutralSubtle'. */
  borderColor?: ColorToken | string;
  /** Margin bottom. */
  mb?: SpacingToken | number;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
