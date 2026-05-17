import type { ScrollViewProps as RNScrollViewProps } from 'react-native';
import type { ColorToken, SpacingToken } from '../../tokens';

export interface ScrollViewProps extends Omit<RNScrollViewProps, 'style'> {
  /** Background color. */
  bg?: ColorToken | string;
  /** Content padding. */
  padding?: SpacingToken | number;
  /** Additional style overrides. */
  style?: RNScrollViewProps['style'];
}
