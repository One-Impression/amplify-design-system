import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text as RNText } from 'react-native';
import { ScrollView } from './ScrollView';

describe('ScrollView', () => {
  it('renders children', () => {
    render(
      <ScrollView testID="scroll">
        <RNText>Content</RNText>
      </ScrollView>,
    );
    expect(screen.getByTestId('scroll')).toBeTruthy();
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('applies background color token', () => {
    render(<ScrollView testID="scroll" bg="primary" />);
    const el = screen.getByTestId('scroll');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.backgroundColor).toBe('#7C3AED');
  });
});
