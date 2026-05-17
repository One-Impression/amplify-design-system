import React from 'react';
import { View, Image as RNImage, Text as RNText } from 'react-native';
import type { ImageStackProps } from './ImageStack.types';
import { styles } from './ImageStack.styles';
import { resolveRadius } from '../../theme/resolvers';

/**
 * ImageStack — overlapping circular images with overflow count.
 * Common in creator lists showing multiple profile pictures.
 */
export const ImageStack = React.forwardRef<View, ImageStackProps>(
  ({ images, size = 32, overlap = 8, max = 3, rounded = 'full', style, ...props }, ref) => {
    const borderRadius = resolveRadius(rounded) ?? 9999;
    const visible = images.slice(0, max);
    const overflowCount = images.length - max;

    return (
      <View ref={ref} style={[styles.container, style]} {...props}>
        {visible.map((source, i) => (
          <RNImage
            key={i}
            source={source}
            style={[
              styles.image,
              {
                width: size,
                height: size,
                borderRadius,
                marginLeft: i > 0 ? -overlap : 0,
                zIndex: visible.length - i,
              },
            ]}
          />
        ))}
        {overflowCount > 0 && (
          <View
            style={[
              styles.overflow,
              {
                width: size,
                height: size,
                borderRadius,
                marginLeft: -overlap,
              },
            ]}
          >
            <RNText style={styles.overflowText}>+{overflowCount}</RNText>
          </View>
        )}
      </View>
    );
  },
);

ImageStack.displayName = 'ImageStack';
