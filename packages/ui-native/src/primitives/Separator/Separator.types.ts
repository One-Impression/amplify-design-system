import type { ViewProps } from 'react-native';
import type { ColorToken, SpacingToken } from '../../tokens';

export interface SeparatorProps extends Omit<ViewProps, 'style'> {
  /** Orientation. Defaults to 'horizontal'. */
  orientation?: 'horizontal' | 'vertical';
  /** Line style. Defaults to 'solid'. */
  variant?: 'solid' | 'dashed' | 'dotted';
  /** Color token or raw color string. Defaults to 'neutralSubtle'. */
  color?: ColorToken | string;
  /** Thickness in pixels. Defaults to 1. */
  thickness?: number;
  /** Margin on both sides of the separator. */
  spacing?: SpacingToken | number;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
