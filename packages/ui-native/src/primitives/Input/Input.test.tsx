import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Input } from './Input';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input testID="input" placeholder="Enter text" />);
    expect(screen.getByTestId('input')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders label', () => {
    render(<Input label="Email" testID="input" />);
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('renders helper text', () => {
    render(<Input helperText="Required field" testID="input" />);
    expect(screen.getByText('Required field')).toBeTruthy();
  });

  it('is not editable when disabled', () => {
    render(<Input testID="input" disabled />);
    const el = screen.getByTestId('input');
    expect(el.props.editable).toBe(false);
  });
});
