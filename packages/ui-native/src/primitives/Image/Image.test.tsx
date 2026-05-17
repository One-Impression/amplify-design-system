import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Image } from './Image';

describe('Image', () => {
  it('renders with source', () => {
    render(<Image testID="img" source={{ uri: 'https://example.com/img.jpg' }} />);
    expect(screen.getByTestId('img')).toBeTruthy();
  });

  it('applies width and height', () => {
    render(
      <Image testID="img" source={{ uri: 'https://example.com/img.jpg' }} width={100} height={100} />,
    );
    const el = screen.getByTestId('img');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.width).toBe(100);
    expect(flatStyle.height).toBe(100);
  });

  it('resolves border radius token', () => {
    render(
      <Image testID="img" source={{ uri: 'https://example.com/img.jpg' }} rounded="full" />,
    );
    const el = screen.getByTestId('img');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.borderRadius).toBe(9999);
  });
});
