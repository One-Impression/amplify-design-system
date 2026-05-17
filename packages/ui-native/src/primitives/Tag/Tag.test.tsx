import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders label', () => {
    render(<Tag label="Active" />);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('renders with variant colors', () => {
    render(<Tag testID="tag" label="Error" variant="negative" />);
    const el = screen.getByTestId('tag');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.backgroundColor).toBe('#FFEBEF');
  });
});
