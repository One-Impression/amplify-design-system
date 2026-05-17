import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renders with placeholder', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
  });

  it('calls onChangeText', () => {
    const onChangeText = jest.fn();
    render(<SearchBar testID="search" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByTestId('search'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('shows clear button when value is present', () => {
    const onClear = jest.fn();
    render(<SearchBar value="test" onClear={onClear} />);
    const clearBtn = screen.getByLabelText('Clear search');
    expect(clearBtn).toBeTruthy();
    fireEvent.press(clearBtn);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('hides clear button when value is empty', () => {
    render(<SearchBar value="" onClear={jest.fn()} />);
    expect(screen.queryByLabelText('Clear search')).toBeNull();
  });
});
