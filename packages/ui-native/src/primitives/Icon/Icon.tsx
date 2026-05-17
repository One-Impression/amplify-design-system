import React from 'react';
import { View } from 'react-native';
import type { IconProps } from './Icon.types';
import { styles } from './Icon.styles';
import { resolveColor, resolveIconSize } from '../../theme/resolvers';

/**
 * Icon — a sized, colored container for icon content. Renders children
 * (typically an SVG icon component) inside a constrained box. The
 * consumer app provides the actual icon library; this primitive only
 * handles sizing and color resolution.
 *
 * Usage:
 *   <Icon name="heart" size="lg" color="primary">
 *     <HeartSvg />
 *   </Icon>
 *
 * The `name` prop is available for icon-lookup logic in the consumer
 * but is not rendered by this component — it exists for SDUI mapping.
 */
export const Icon = React.forwardRef<View, IconProps>(
  ({ name: _name, size = 'md', color = 'neutralStrong', style, children, ...props }, ref) => {
    const resolvedSize = resolveIconSize(size) ?? 20;
    const resolvedColor = resolveColor(color);

    return (
      <View
        ref={ref}
        accessibilityRole="image"
        style={[
          styles.container,
          { width: resolvedSize, height: resolvedSize },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  },
);

Icon.displayName = 'Icon';
