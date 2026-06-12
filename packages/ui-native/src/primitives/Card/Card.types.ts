import type { ViewProps } from 'react-native';
import type { ColorToken, SpacingToken, RadiusToken } from '../../tokens';
import type { ElevationToken } from '../../theme/resolvers';

export interface CardProps extends Omit<ViewProps, 'style'> {
  /** Background color. Defaults to 'neutralInverse' (white). */
  bg?: ColorToken | string;
  /** Inner padding. Defaults to 'md'. */
  padding?: SpacingToken | number;
  /** Border radius. Defaults to 'lg' (12). */
  rounded?: RadiusToken | number;
  /** Border color. Defaults to 'neutralSubtle' (thin light border, like the legacy card). */
  borderColor?: ColorToken | string;
  /** Drop-shadow level ('none'|'sm'|'md'|'lg'|'xl'). Defaults to 'none' — cards opt in. */
  elevation?: ElevationToken;
  /** Margin bottom. */
  mb?: SpacingToken | number;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
