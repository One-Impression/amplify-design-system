import type { ViewProps } from 'react-native';
import type { ColorToken, RadiusToken } from '../../tokens';

export interface ProgressIndicatorProps extends Omit<ViewProps, 'style'> {
  /** Progress value between 0 and 1. */
  value: number;
  /** Track color. Defaults to 'neutralSubtle'. */
  trackColor?: ColorToken | string;
  /** Fill color. Defaults to 'primary'. */
  fillColor?: ColorToken | string;
  /** Height in pixels. Defaults to 4. */
  height?: number;
  /** Border radius. Defaults to 'full'. */
  rounded?: RadiusToken | number;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
