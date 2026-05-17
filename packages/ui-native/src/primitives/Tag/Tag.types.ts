import type { ViewProps } from 'react-native';
import type { ColorToken } from '../../tokens';

export type TagVariant = 'default' | 'primary' | 'positive' | 'negative' | 'notice' | 'neutral';

export interface TagProps extends Omit<ViewProps, 'style'> {
  /** Label text. */
  label: string;
  /** Visual variant. Defaults to 'default'. */
  variant?: TagVariant;
  /** Icon element. */
  icon?: React.ReactNode;
  /** Additional style overrides. */
  style?: ViewProps['style'];
}
