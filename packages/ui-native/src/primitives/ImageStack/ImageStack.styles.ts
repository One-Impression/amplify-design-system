import { StyleSheet } from 'react-native';
import { sdui } from '@amplify-ai/tokens-creator/react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    borderWidth: 2,
    borderColor: sdui.color.neutralInverse,
  },
  overflow: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: sdui.color.neutralSubtle,
    borderWidth: 2,
    borderColor: sdui.color.neutralInverse,
  },
  overflowText: {
    fontSize: sdui.fontSize.xs,
    fontWeight: '600',
    color: sdui.color.neutralMedium,
  },
});
