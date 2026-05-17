import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders with default size', () => {
    render(<Icon testID="icon" name="star" />);
    const el = screen.getByTestId('icon');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.width).toBe(20);
    expect(flatStyle.height).toBe(20);
  });

  it('resolves size token', () => {
    render(<Icon testID="icon" name="star" size="lg" />);
    const el = screen.getByTestId('icon');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.width).toBe(24);
    expect(flatStyle.height).toBe(24);
  });

  it('resolves color token', () => {
    render(<Icon testID="icon" name="star" color="primary" />);
    const el = screen.getByTestId('icon');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.tintColor).toBe('#7C3AED');
  });

  it('has image accessibility role', () => {
    render(<Icon testID="icon" name="star" />);
    const el = screen.getByTestId('icon');
    expect(el.props.accessibilityRole).toBe('image');
  });
});
