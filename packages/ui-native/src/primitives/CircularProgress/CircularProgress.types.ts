import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type { ColorToken } from '../../tokens';

export interface CircularProgressProps extends Omit<ViewProps, 'style'> {
  /** Progress value between 0 and 1. */
  value: number;
  /** Outer diameter in pixels. Defaults to 44. */
  size?: number;
  /** Ring thickness in pixels. Defaults to 4. */
  strokeWidth?: number;
  /** Track (unfilled) color. Defaults to 'neutralSubtle'. */
  trackColor?: ColorToken | string;
  /** Fill (progress) color. Defaults to 'primary'. */
  fillColor?: ColorToken | string;
  /** Content rendered centered inside the ring (e.g. a percentage label). */
  children?: ReactNode;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
