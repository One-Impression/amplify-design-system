import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox testID="cb" />);
    const el = screen.getByTestId('cb');
    expect(el.props.accessibilityState.checked).toBe(false);
  });

  it('renders checked state', () => {
    render(<Checkbox testID="cb" checked />);
    const el = screen.getByTestId('cb');
    expect(el.props.accessibilityState.checked).toBe(true);
  });

  it('renders label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeTruthy();
  });

  it('has checkbox role', () => {
    render(<Checkbox testID="cb" />);
    expect(screen.getByTestId('cb').props.accessibilityRole).toBe('checkbox');
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    render(<Checkbox testID="cb" onPress={onPress} />);
    fireEvent.press(screen.getByTestId('cb'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
