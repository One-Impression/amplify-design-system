import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SelectableItem } from './SelectableItem';

describe('SelectableItem', () => {
  it('renders label', () => {
    render(<SelectableItem label="Item 1" />);
    expect(screen.getByText('Item 1')).toBeTruthy();
  });

  it('renders description', () => {
    render(<SelectableItem label="Item" description="Details here" />);
    expect(screen.getByText('Details here')).toBeTruthy();
  });

  it('marks selected state', () => {
    render(<SelectableItem testID="item" label="A" selected />);
    const el = screen.getByTestId('item');
    expect(el.props.accessibilityState.selected).toBe(true);
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    render(<SelectableItem testID="item" label="A" onPress={onPress} />);
    fireEvent.press(screen.getByTestId('item'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
