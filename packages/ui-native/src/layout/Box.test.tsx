import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text as RNText } from 'react-native';
import { Box } from './Box';

/** Flatten Box's `style` array into a single object for assertions. */
function flatStyle(testID: string): Record<string, unknown> {
  const el = screen.getByTestId(testID);
  const s = el.props.style;
  return Array.isArray(s)
    ? Object.assign({}, ...(s.filter(Boolean) as object[]))
    : (s as Record<string, unknown>);
}

describe('Box', () => {
  it('renders children', () => {
    render(
      <Box testID="box">
        <RNText>Hello</RNText>
      </Box>,
    );
    expect(screen.getByTestId('box')).toBeTruthy();
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('forwards position prop to underlying View style', () => {
    render(<Box testID="box" position="absolute" />);
    expect(flatStyle('box').position).toBe('absolute');
  });

  it('forwards zIndex prop', () => {
    render(<Box testID="box" zIndex={10} />);
    expect(flatStyle('box').zIndex).toBe(10);
  });

  it('forwards opacity prop', () => {
    render(<Box testID="box" opacity={0.5} />);
    expect(flatStyle('box').opacity).toBe(0.5);
  });

  it('forwards overflow prop', () => {
    render(<Box testID="box" overflow="hidden" />);
    expect(flatStyle('box').overflow).toBe('hidden');
  });

  it('forwards individual border widths', () => {
    render(
      <Box
        testID="box"
        borderTopWidth={1}
        borderBottomWidth={2}
        borderLeftWidth={3}
        borderRightWidth={4}
      />,
    );
    const s = flatStyle('box');
    expect(s.borderTopWidth).toBe(1);
    expect(s.borderBottomWidth).toBe(2);
    expect(s.borderLeftWidth).toBe(3);
    expect(s.borderRightWidth).toBe(4);
  });

  it('does not leak the new props onto the underlying View when unset', () => {
    render(<Box testID="box" />);
    const s = flatStyle('box');
    expect(s.position).toBeUndefined();
    expect(s.zIndex).toBeUndefined();
    expect(s.opacity).toBeUndefined();
    expect(s.overflow).toBeUndefined();
    expect(s.borderTopWidth).toBeUndefined();
    expect(s.borderBottomWidth).toBeUndefined();
    expect(s.borderLeftWidth).toBeUndefined();
    expect(s.borderRightWidth).toBeUndefined();
  });

  it('still applies existing layout props alongside the new ones', () => {
    render(
      <Box
        testID="box"
        p="lg"
        rounded="md"
        position="absolute"
        zIndex={5}
        opacity={0.8}
      />,
    );
    const s = flatStyle('box');
    expect(s.padding).toBe(16); // lg
    expect(s.borderRadius).toBe(8); // md
    expect(s.position).toBe('absolute');
    expect(s.zIndex).toBe(5);
    expect(s.opacity).toBe(0.8);
  });
});
