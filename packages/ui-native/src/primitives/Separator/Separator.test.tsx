import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Separator } from './Separator';

describe('Separator', () => {
  it('renders horizontal by default', () => {
    render(<Separator testID="sep" />);
    const el = screen.getByTestId('sep');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.height).toBe(1);
    expect(flatStyle.alignSelf).toBe('stretch');
  });

  it('renders vertical', () => {
    render(<Separator testID="sep" orientation="vertical" />);
    const el = screen.getByTestId('sep');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.width).toBe(1);
  });

  it('resolves color token', () => {
    render(<Separator testID="sep" color="primary" />);
    const el = screen.getByTestId('sep');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.backgroundColor).toBe('#7C3AED');
  });

  it('applies spacing', () => {
    render(<Separator testID="sep" spacing="md" />);
    const el = screen.getByTestId('sep');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.marginVertical).toBe(12);
  });
});
