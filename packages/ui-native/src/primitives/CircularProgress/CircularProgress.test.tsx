import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { CircularProgress } from './CircularProgress';

describe('CircularProgress', () => {
  it('renders with progressbar role', () => {
    render(<CircularProgress testID="ring" value={0.5} />);
    const el = screen.getByTestId('ring');
    expect(el.props.accessibilityRole).toBe('progressbar');
  });

  it('clamps value to 0-1 range', () => {
    render(<CircularProgress testID="ring" value={1.5} />);
    const el = screen.getByTestId('ring');
    expect(el.props.accessibilityValue.now).toBe(100);
  });

  it('reports percentage in accessibility value', () => {
    render(<CircularProgress testID="ring" value={0.41} />);
    const el = screen.getByTestId('ring');
    expect(el.props.accessibilityValue.now).toBe(41);
  });

  it('renders centered children (e.g. a label)', () => {
    render(
      <CircularProgress value={0.41}>
        <Text>41%</Text>
      </CircularProgress>,
    );
    expect(screen.getByText('41%')).toBeTruthy();
  });
});
