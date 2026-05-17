import type { ViewProps } from 'react-native';
import type { ColorToken, SpacingToken } from '../../tokens';

export interface SectionProps extends Omit<ViewProps, 'style'> {
  /** Section heading. */
  title?: string;
  /** Trailing element in header row (e.g. "See all" link). */
  headerRight?: React.ReactNode;
  /** Background color. */
  bg?: ColorToken | string;
  /** Inner padding. Defaults to 'lg'. */
  padding?: SpacingToken | number;
  /** Margin bottom. Defaults to 'lg'. */
  mb?: SpacingToken | number;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
