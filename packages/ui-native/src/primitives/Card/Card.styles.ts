import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // The inner layer clips children to the rounded corners. It must be a
  // SEPARATE view from the shadow-casting outer layer — `overflow:hidden` on a
  // shadowed view clips the shadow itself on iOS.
  inner: {
    overflow: 'hidden',
  },
});
