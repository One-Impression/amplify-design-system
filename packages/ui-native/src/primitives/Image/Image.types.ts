import type { ImageProps as RNImageProps } from 'react-native';
import type { RadiusToken, SpacingToken } from '../../tokens';

export type ImageResizeMode = 'cover' | 'contain' | 'stretch' | 'center';

export interface ImageProps extends Omit<RNImageProps, 'style'> {
  /** Image width. */
  width?: number | string;
  /** Image height. */
  height?: number | string;
  /** Aspect ratio (e.g. 1 for square, 16/9 for wide). */
  aspectRatio?: number;
  /** Border radius token or raw number. */
  rounded?: RadiusToken | number;
  /** Resize mode. Defaults to 'cover'. */
  resizeMode?: ImageResizeMode;
  /** Margin bottom. */
  mb?: SpacingToken | number;
  /** Additional style overrides. */
  style?: RNImageProps['style'];
}
