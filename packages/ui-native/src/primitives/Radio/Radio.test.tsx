import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Radio } from './Radio';

describe('Radio', () => {
  it('renders unselected by default', () => {
    render(<Radio testID="radio" />);
    const el = screen.getByTestId('radio');
    expect(el.props.accessibilityState.selected).toBe(false);
  });

  it('renders selected state', () => {
    render(<Radio testID="radio" selected />);
    const el = screen.getByTestId('radio');
    expect(el.props.accessibilityState.selected).toBe(true);
  });

  it('renders label', () => {
    render(<Radio label="Option A" />);
    expect(screen.getByText('Option A')).toBeTruthy();
  });

  it('has radio role', () => {
    render(<Radio testID="radio" />);
    expect(screen.getByTestId('radio').props.accessibilityRole).toBe('radio');
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    render(<Radio testID="radio" onPress={onPress} />);
    fireEvent.press(screen.getByTestId('radio'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
