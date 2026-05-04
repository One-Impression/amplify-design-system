/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Radio, RadioGroup } from './RadioGroup';

afterEach(cleanup);

const Group = (
  props: Partial<React.ComponentProps<typeof RadioGroup>> & {
    onValueChange?: (v: string) => void;
  }
) => (
  <RadioGroup name="t" label="Color" {...props}>
    <Radio value="red">Red</Radio>
    <Radio value="green">Green</Radio>
    <Radio value="blue" disabled>
      Blue
    </Radio>
  </RadioGroup>
);

describe('RadioGroup', () => {
  it('renders with role=radiogroup and labelled by the label', () => {
    render(<Group />);
    const group = screen.getByRole('radiogroup');
    expect(group).toBeDefined();
    expect(group.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('renders one role=radio per <Radio> child with correct aria-checked', () => {
    render(<Group defaultValue="red" />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    expect(radios[1].getAttribute('aria-checked')).toBe('false');
    expect(radios[2].getAttribute('aria-checked')).toBe('false');
  });

  it('selects on click and fires onValueChange', () => {
    const onValueChange = vi.fn();
    render(<Group onValueChange={onValueChange} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);
    expect(onValueChange).toHaveBeenCalledWith('green');
  });

  it('does not change value when readOnly', () => {
    const onValueChange = vi.fn();
    render(<Group readOnly defaultValue="red" onValueChange={onValueChange} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(radios[0].getAttribute('aria-checked')).toBe('true');
  });

  it('arrow keys cycle to next enabled radio and select it', () => {
    const onValueChange = vi.fn();
    render(<Group defaultValue="red" onValueChange={onValueChange} />);
    const radios = screen.getAllByRole('radio');
    radios[0].focus();
    fireEvent.keyDown(radios[0], { key: 'ArrowDown' });
    expect(onValueChange).toHaveBeenLastCalledWith('green');
    // Skip the disabled "blue" — wraps back to "red".
    radios[1].focus();
    fireEvent.keyDown(radios[1], { key: 'ArrowDown' });
    expect(onValueChange).toHaveBeenLastCalledWith('red');
  });

  it('ArrowUp moves backwards', () => {
    const onValueChange = vi.fn();
    render(<Group defaultValue="green" onValueChange={onValueChange} />);
    const radios = screen.getAllByRole('radio');
    radios[1].focus();
    fireEvent.keyDown(radios[1], { key: 'ArrowUp' });
    expect(onValueChange).toHaveBeenLastCalledWith('red');
  });

  it('Space selects the focused radio', () => {
    const onValueChange = vi.fn();
    render(<Group onValueChange={onValueChange} />);
    const radios = screen.getAllByRole('radio');
    radios[1].focus();
    fireEvent.keyDown(radios[1], { key: ' ' });
    expect(onValueChange).toHaveBeenCalledWith('green');
  });

  it('marks group as aria-orientation horizontal when configured', () => {
    render(<Group orientation="horizontal" />);
    const group = screen.getByRole('radiogroup');
    expect(group.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('shows error and sets aria-invalid', () => {
    render(<Group error="Required" />);
    const group = screen.getByRole('radiogroup');
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Required')).toBeDefined();
  });

  it('disabled radios are not selectable', () => {
    const onValueChange = vi.fn();
    render(<Group onValueChange={onValueChange} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[2]);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
