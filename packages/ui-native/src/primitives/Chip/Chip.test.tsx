import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders label', () => {
    render(<Chip label="Filter" />);
    expect(screen.getByText('Filter')).toBeTruthy();
  });

  it('marks selected state in accessibility', () => {
    render(<Chip testID="chip" label="A" selected />);
    const el = screen.getByTestId('chip');
    expect(el.props.accessibilityState.selected).toBe(true);
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    render(<Chip testID="chip" label="A" onPress={onPress} />);
    fireEvent.press(screen.getByTestId('chip'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
