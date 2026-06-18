import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Separator } from './Separator';

describe('Separator', () => {
  it('renders horizontal by default', () => {
    render(<Separator testID="sep" />);
    const el = screen.getByTestId('sep');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.height).toBe(1);
    expect(flatStyle.alignSelf).toBe('stretch');
  });

  it('renders vertical', () => {
    render(<Separator testID="sep" orientation="vertical" />);
    const el = screen.getByTestId('sep');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.width).toBe(1);
  });

  it('resolves color token', () => {
    render(<Separator testID="sep" color="primary" />);
    const el = screen.getByTestId('sep');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.backgroundColor).toBe('#7C3AED');
  });

  it('applies spacing', () => {
    render(<Separator testID="sep" spacing="md" />);
    const el = screen.getByTestId('sep');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.marginVertical).toBe(12);
  });

  it('renders solid via backgroundColor by default', () => {
    render(<Separator testID="sep" color="primary" thickness={2} />);
    const el = screen.getByTestId('sep');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.backgroundColor).toBe('#7C3AED');
    expect(flatStyle.height).toBe(2);
    expect(flatStyle.borderStyle).toBeUndefined();
    expect(flatStyle.borderTopWidth).toBeUndefined();
  });

  it('renders dashed via a horizontal border, not a background', () => {
    render(<Separator testID="sep" variant="dashed" color="primary" thickness={2} />);
    const el = screen.getByTestId('sep');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.borderStyle).toBe('dashed');
    expect(flatStyle.borderTopWidth).toBe(2);
    expect(flatStyle.borderColor).toBe('#7C3AED');
    expect(flatStyle.height).toBe(0);
    expect(flatStyle.backgroundColor).toBeUndefined();
  });

  it('renders dotted via a horizontal border, not a background', () => {
    render(<Separator testID="sep" variant="dotted" color="primary" thickness={2} />);
    const el = screen.getByTestId('sep');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.borderStyle).toBe('dotted');
    expect(flatStyle.borderTopWidth).toBe(2);
    expect(flatStyle.borderColor).toBe('#7C3AED');
    expect(flatStyle.height).toBe(0);
    expect(flatStyle.backgroundColor).toBeUndefined();
  });

  it('renders dashed vertical via a left border', () => {
    render(
      <Separator
        testID="sep"
        orientation="vertical"
        variant="dashed"
        color="primary"
        thickness={2}
      />,
    );
    const el = screen.getByTestId('sep');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(flatStyle.borderStyle).toBe('dashed');
    expect(flatStyle.borderLeftWidth).toBe(2);
    expect(flatStyle.width).toBe(0);
    expect(flatStyle.backgroundColor).toBeUndefined();
  });
});
