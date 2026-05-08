/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Combobox, type ComboboxItemData } from './Combobox';

afterEach(cleanup);

const fruits: ComboboxItemData[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date', disabled: true },
];

describe('Combobox', () => {
  it('renders an input with role=combobox + correct ARIA wiring', () => {
    render(<Combobox label="Fruit" items={fruits} />);
    const input = screen.getByRole('combobox');
    expect(input).toBeDefined();
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-controls')).toBeTruthy();
  });

  it('opens the listbox on focus and renders items', () => {
    render(<Combobox label="Fruit" items={fruits} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('listbox')).toBeDefined();
    expect(screen.getAllByRole('option')).toHaveLength(fruits.length);
  });

  it('filters items as the user types', () => {
    render(<Combobox label="Fruit" items={fruits} />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'an' } });
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('Banana');
  });

  it('shows empty state when no items match', () => {
    render(<Combobox label="Fruit" items={fruits} emptyMessage="Nothing here." />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(screen.getByText('Nothing here.')).toBeDefined();
  });

  it('selects on Enter and fires onValueChange', () => {
    const onValueChange = vi.fn();
    render(<Combobox label="Fruit" items={fruits} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' }); // highlight idx -> 1 (Banana)
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('banana');
  });

  it('selects on click', () => {
    const onValueChange = vi.fn();
    render(<Combobox label="Fruit" items={fruits} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.click(screen.getAllByRole('option')[2]); // Cherry
    expect(onValueChange).toHaveBeenCalledWith('cherry');
  });

  it('Escape closes the listbox', () => {
    render(<Combobox label="Fruit" items={fruits} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('does not select disabled items', () => {
    const onValueChange = vi.fn();
    render(<Combobox label="Fruit" items={fruits} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.click(screen.getAllByRole('option')[3]); // Date (disabled)
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('exposes aria-activedescendant matching the highlighted option', () => {
    render(<Combobox label="Fruit" items={fruits} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    const firstOptId = screen.getAllByRole('option')[0].id;
    expect(input.getAttribute('aria-activedescendant')).toBe(firstOptId);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const secondOptId = screen.getAllByRole('option')[1].id;
    expect(input.getAttribute('aria-activedescendant')).toBe(secondOptId);
  });

  it('renders Combobox.Item children', () => {
    render(
      <Combobox label="Fruit">
        <Combobox.Item value="a" label="Alpha" />
        <Combobox.Item value="b" label="Beta" />
      </Combobox>
    );
    fireEvent.focus(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByText('Alpha')).toBeDefined();
    expect(screen.getByText('Beta')).toBeDefined();
  });

  it('readOnly disables typing changes and selection', () => {
    const onValueChange = vi.fn();
    render(
      <Combobox
        label="Fruit"
        items={fruits}
        readOnly
        defaultValue="apple"
        onValueChange={onValueChange}
      />
    );
    const input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input.value).toBe('Apple');
    expect(input.readOnly).toBe(true);
    fireEvent.focus(input);
    fireEvent.click(screen.getAllByRole('option')[1]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('shows error and sets aria-invalid', () => {
    render(<Combobox label="Fruit" items={fruits} error="Required" />);
    const input = screen.getByRole('combobox');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Required')).toBeDefined();
  });

  it('supports async loadItems', async () => {
    vi.useFakeTimers();
    const loadItems = vi.fn(async (q: string) => {
      const all: ComboboxItemData[] = [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'in', label: 'India' },
      ];
      return all.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
    });
    render(<Combobox label="Country" loadItems={loadItems} debounceMs={100} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'united' } });

    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    vi.useRealTimers();

    await waitFor(() => {
      expect(loadItems).toHaveBeenCalled();
      const opts = screen.getAllByRole('option');
      expect(opts.length).toBe(2);
    });
  });
});
