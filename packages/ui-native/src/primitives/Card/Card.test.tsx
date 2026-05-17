import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text as RNText } from 'react-native';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card testID="card">
        <RNText>Content</RNText>
      </Card>,
    );
    expect(screen.getByTestId('card')).toBeTruthy();
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('applies default padding and radius', () => {
    render(<Card testID="card"><RNText>X</RNText></Card>);
    const el = screen.getByTestId('card');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.padding).toBe(16); // lg
    expect(flatStyle.borderRadius).toBe(8); // md
  });
});
