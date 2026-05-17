import type { ViewProps, ImageSourcePropType } from 'react-native';
import type { RadiusToken } from '../../tokens';

export interface ImageStackProps extends Omit<ViewProps, 'style'> {
  /** Array of image sources to stack. */
  images: ImageSourcePropType[];
  /** Size of each image circle. Defaults to 32. */
  size?: number;
  /** Overlap between images in pixels. Defaults to 8. */
  overlap?: number;
  /** Max images to show before "+N" overflow. Defaults to 3. */
  max?: number;
  /** Border radius. Defaults to 'full'. */
  rounded?: RadiusToken | number;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
