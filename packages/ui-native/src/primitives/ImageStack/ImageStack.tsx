import React from 'react';
import { View, Image as RNImage, Text as RNText, Pressable } from 'react-native';
import type { ImageStackProps } from './ImageStack.types';
import { styles } from './ImageStack.styles';
import { resolveRadius } from '../../theme/resolvers';

/**
 * ImageStack — overlapping circular images with overflow count.
 * Common in creator lists showing multiple profile pictures.
 *
 * When `onImagePress` is provided, each visible image is wrapped in a
 * `Pressable` that invokes `onImagePress(index)` on tap. The consumer
 * decides per-index what to do (including no-op). The `+N` overflow
 * chip is not made pressable here.
 */
export const ImageStack = React.forwardRef<View, ImageStackProps>(
  (
    { images, size = 32, overlap = 8, max = 3, rounded = 'full', onImagePress, style, ...props },
    ref,
  ) => {
    const borderRadius = resolveRadius(rounded) ?? 9999;
    const visible = images.slice(0, max);
    const overflowCount = images.length - max;

    return (
      <View ref={ref} style={[styles.container, style]} {...props}>
        {visible.map((source, i) => {
          if (onImagePress) {
            // The visible hit area is the image's own bounds — overlap with
            // neighbouring circles is acceptable and matches the legacy
            // face-stack interaction.
            return (
              <Pressable
                key={i}
                onPress={() => onImagePress(i)}
                accessibilityRole="button"
                style={{
                  marginLeft: i > 0 ? -overlap : 0,
                  zIndex: visible.length - i,
                }}
              >
                <RNImage
                  source={source}
                  style={[
                    styles.image,
                    { width: size, height: size, borderRadius, marginLeft: 0 },
                  ]}
                />
              </Pressable>
            );
          }
          return (
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
          );
        })}
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
