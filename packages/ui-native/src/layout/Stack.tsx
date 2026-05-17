import React from 'react';
import { View } from 'react-native';
import { Box, type BoxProps } from './Box';
import type { SpacingToken } from '../tokens';

export interface StackProps extends Omit<BoxProps, 'direction'> {
  /** Gap between children. Defaults to 'sm' (8px). */
  spacing?: SpacingToken | number;
  /** Stack direction. Defaults to 'column'. */
  horizontal?: boolean;
}

/**
 * Stack — a thin wrapper around Box that sets flex direction and gap.
 * Vertical by default; set `horizontal` for a row.
 */
export const Stack = React.forwardRef<View, StackProps>(
  ({ spacing = 'sm', horizontal = false, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        direction={horizontal ? 'row' : 'column'}
        gap={spacing}
        {...props}
      />
    );
  },
);

Stack.displayName = 'Stack';
