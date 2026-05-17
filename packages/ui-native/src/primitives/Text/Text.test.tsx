import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from './Text';

describe('Text', () => {
  it('renders children', () => {
    render(<Text testID="txt">Hello</Text>);
    expect(screen.getByTestId('txt')).toBeTruthy();
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('applies variant defaults', () => {
    const { getByTestId } = render(<Text testID="txt" variant="heading">H</Text>);
    const el = getByTestId('txt');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.fontSize).toBe(20);
  });

  it('overrides size and weight', () => {
    const { getByTestId } = render(<Text testID="txt" size="xl" weight="bold">Big</Text>);
    const el = getByTestId('txt');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.fontSize).toBe(20);
    expect(flatStyle.fontWeight).toBe('700');
  });

  it('resolves color tokens', () => {
    const { getByTestId } = render(<Text testID="txt" color="primary">C</Text>);
    const el = getByTestId('txt');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.color).toBe('#7C3AED');
  });
});
