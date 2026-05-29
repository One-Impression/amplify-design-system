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
   * Per-image press handler, invoked with the index in the **original**
   * `images` array. When provided, the matching image is wrapped in a
   * `Pressable`; the `+N` overflow chip is NOT pressable through this hook.
   * If omitted (or returns `undefined` for an index) the image renders as
   * a plain `Image` with no touch handler. Used by SDUI surfaces like
   * `PageHeaderImageStack` where each face dispatches its own `on_click`.
   */
  onImagePress?: (index: number) => (() => void) | undefined;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
