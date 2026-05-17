import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ProgressIndicator } from './ProgressIndicator';

describe('ProgressIndicator', () => {
  it('renders with progressbar role', () => {
    render(<ProgressIndicator testID="prog" value={0.5} />);
    const el = screen.getByTestId('prog');
    expect(el.props.accessibilityRole).toBe('progressbar');
  });

  it('clamps value to 0-1 range', () => {
    render(<ProgressIndicator testID="prog" value={1.5} />);
    const el = screen.getByTestId('prog');
    expect(el.props.accessibilityValue.now).toBe(100);
  });

  it('reports percentage in accessibility value', () => {
    render(<ProgressIndicator testID="prog" value={0.75} />);
    const el = screen.getByTestId('prog');
    expect(el.props.accessibilityValue.now).toBe(75);
  });
});
