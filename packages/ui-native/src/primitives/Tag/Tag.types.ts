import type { ViewProps } from 'react-native';
import type { ColorToken } from '../../tokens';

export type TagVariant = 'default' | 'primary' | 'positive' | 'negative' | 'notice' | 'neutral';

export interface TagProps extends Omit<ViewProps, 'style'> {
  /** Label text. */
  label: string;
  /** Visual variant. Defaults to 'default'. Used as the fallback when no
   *  explicit bgColor / textColor / background is provided. */
  variant?: TagVariant;
  /** Icon element (rendered before the label). */
  icon?: React.ReactNode;
  /** Explicit background color token / raw color — overrides the variant bg. */
  bgColor?: ColorToken | string;
  /** Explicit text color token / raw color — overrides the variant text color. */
  textColor?: ColorToken | string;
  /** Absolute-fill background node (e.g. a gradient) painted behind the label;
   *  when set, the solid background + border are dropped and the pill clips it. */
  background?: React.ReactNode;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
