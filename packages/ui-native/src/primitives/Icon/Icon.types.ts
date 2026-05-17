import type { ViewProps } from 'react-native';
import type { ColorToken, IconSizeToken } from '../../tokens';

export interface IconProps extends Omit<ViewProps, 'style'> {
  /** Icon name — passed to the render function. */
  name: string;
  /** Size token or raw number. Defaults to 'md' (20). */
  size?: IconSizeToken | number;
  /** Color token or raw color string. Defaults to 'neutralStrong'. */
  color?: ColorToken | string;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
