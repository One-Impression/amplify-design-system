import { StyleSheet } from 'react-native';
import type { TextVariant } from './Text.types';

type VariantStyle = { fontSize: number; fontWeight: string };

export const variantStyles: Record<TextVariant, VariantStyle> = {
  display: { fontSize: 32, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '700' },
  heading: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: '400' },
  label: { fontSize: 12, fontWeight: '500' },
  caption: { fontSize: 10, fontWeight: '400' },
};

export const styles = StyleSheet.create({
  base: {
    color: '#1C1917', // neutralStrong fallback
  },
});
