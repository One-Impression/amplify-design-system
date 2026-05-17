import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders label text', () => {
    render(<Button>Press me</Button>);
    expect(screen.getByText('Press me')).toBeTruthy();
  });

  it('has button accessibility role', () => {
    render(<Button testID="btn">OK</Button>);
    expect(screen.getByTestId('btn').props.accessibilityRole).toBe('button');
  });

  it('is disabled when loading', () => {
    render(<Button testID="btn" loading>OK</Button>);
    const el = screen.getByTestId('btn');
    expect(el.props.accessibilityState.busy).toBe(true);
    expect(el.props.accessibilityState.disabled).toBe(true);
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button testID="btn" disabled>OK</Button>);
    const el = screen.getByTestId('btn');
    expect(el.props.accessibilityState.disabled).toBe(true);
  });

  it('fires onPress when not disabled', () => {
    const onPress = jest.fn();
    render(<Button testID="btn" onPress={onPress}>OK</Button>);
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
