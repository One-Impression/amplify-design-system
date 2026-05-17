import React from 'react';
import { Image as RNImage, type ImageStyle } from 'react-native';
import type { ImageProps } from './Image.types';
import { styles } from './Image.styles';
import { resolveRadius, resolveSpacing } from '../../theme/resolvers';

/**
 * Image — token-resolved image primitive with border radius and spacing support.
 */
export const Image = React.forwardRef<RNImage, ImageProps>(
  (
    {
      width,
      height,
      aspectRatio,
      rounded,
      resizeMode = 'cover',
      mb,
      style,
      ...props
    },
    ref,
  ) => {
    const imageStyle: ImageStyle = {
      width: width as ImageStyle['width'],
      height: height as ImageStyle['height'],
      aspectRatio,
      borderRadius: resolveRadius(rounded),
      resizeMode,
      marginBottom: resolveSpacing(mb),
    };

    const cleaned = Object.fromEntries(
      Object.entries(imageStyle).filter(([, v]) => v !== undefined),
    ) as ImageStyle;

    return <RNImage ref={ref} style={[styles.base, cleaned, style]} {...props} />;
  },
);

Image.displayName = 'Image';
