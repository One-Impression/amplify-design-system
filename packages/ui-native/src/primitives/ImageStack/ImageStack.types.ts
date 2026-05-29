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
  /**
   * Per-image press handler. When provided, each visible image is wrapped
   * in a `Pressable` whose `onPress` invokes this with the image's index
   * in the original `images` array. The consumer decides what (if
   * anything) to do for that index — including no-op for non-actionable
   * faces. The `+N` overflow chip is NOT pressable through this hook.
   * Used by SDUI surfaces like `PageHeaderImageStack` where each face
   * dispatches an action keyed by index.
   */
  onImagePress?: (index: number) => void;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
