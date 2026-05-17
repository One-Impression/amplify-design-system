import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Tab } from './Tab';

describe('Tab', () => {
  it('renders label', () => {
    render(<Tab label="Overview" />);
    expect(screen.getByText('Overview')).toBeTruthy();
  });

  it('has tab accessibility role', () => {
    render(<Tab testID="tab" label="A" />);
    expect(screen.getByTestId('tab').props.accessibilityRole).toBe('tab');
  });

  it('marks active state', () => {
    render(<Tab testID="tab" label="A" active />);
    const el = screen.getByTestId('tab');
    expect(el.props.accessibilityState.selected).toBe(true);
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    render(<Tab testID="tab" label="A" onPress={onPress} />);
    fireEvent.press(screen.getByTestId('tab'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
