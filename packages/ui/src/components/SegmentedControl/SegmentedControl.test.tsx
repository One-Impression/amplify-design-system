/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { SegmentedControl, type SegmentedControlOption } from './SegmentedControl';
import { DensityProvider } from '../../lib/density';

afterEach(cleanup);

type Mode = 'grid' | 'map' | 'list';
const options: SegmentedControlOption<Mode>[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map' },
  { value: 'list', label: 'List' },
];

describe('SegmentedControl', () => {
  it('renders a radiogroup with the given aria-label', () => {
    render(
      <SegmentedControl<Mode>
        value="grid"
        options={options}
        onChange={() => undefined}
        ariaLabel="View mode"
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'View mode' });
    expect(group).toBeDefined();
  });

  it('renders one radio per option', () => {
    render(
      <SegmentedControl<Mode>
        value="grid"
        options={options}
        onChange={() => undefined}
        ariaLabel="View mode"
      />,
    );
    expect(screen.getAllByRole('radio')).toHaveLength(options.length);
  });

  it('marks the active option with aria-checked=true and the rest false', () => {
    render(
      <SegmentedControl<Mode>
        value="map"
        options={options}
        onChange={() => undefined}
        ariaLabel="View mode"
      />,
    );
    expect(
      screen.getByRole('radio', { name: 'Grid' }).getAttribute('aria-checked'),
    ).toBe('false');
    expect(
      screen.getByRole('radio', { name: 'Map' }).getAttribute('aria-checked'),
    ).toBe('true');
    expect(
      screen.getByRole('radio', { name: 'List' }).getAttribute('aria-checked'),
    ).toBe('false');
  });

  it('clicking an option fires onChange with that value', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl<Mode>
        value="grid"
        options={options}
        onChange={onChange}
        ariaLabel="View mode"
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Map' }));
    expect(onChange).toHaveBeenCalledWith('map');
  });

  it('roving tabindex — only the active option is tabbable', () => {
    render(
      <SegmentedControl<Mode>
        value="map"
        options={options}
        onChange={() => undefined}
        ariaLabel="View mode"
      />,
    );
    expect(
      screen.getByRole('radio', { name: 'Grid' }).getAttribute('tabindex'),
    ).toBe('-1');
    expect(
      screen.getByRole('radio', { name: 'Map' }).getAttribute('tabindex'),
    ).toBe('0');
    expect(
      screen.getByRole('radio', { name: 'List' }).getAttribute('tabindex'),
    ).toBe('-1');
  });

  it('ArrowRight on a segment cycles to the next option (and selects it)', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl<Mode>
        value="grid"
        options={options}
        onChange={onChange}
        ariaLabel="View mode"
      />,
    );
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Grid' }), {
      key: 'ArrowRight',
    });
    expect(onChange).toHaveBeenCalledWith('map');
  });

  it('ArrowLeft on the first option wraps to the last', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl<Mode>
        value="grid"
        options={options}
        onChange={onChange}
        ariaLabel="View mode"
      />,
    );
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Grid' }), {
      key: 'ArrowLeft',
    });
    expect(onChange).toHaveBeenCalledWith('list');
  });

  it('ArrowDown / ArrowUp also navigate (mirrors W3C radiogroup pattern)', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl<Mode>
        value="map"
        options={options}
        onChange={onChange}
        ariaLabel="View mode"
      />,
    );
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Map' }), {
      key: 'ArrowDown',
    });
    expect(onChange).toHaveBeenLastCalledWith('list');
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Map' }), {
      key: 'ArrowUp',
    });
    expect(onChange).toHaveBeenLastCalledWith('grid');
  });

  it('Enter selects the focused option', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl<Mode>
        value="grid"
        options={options}
        onChange={onChange}
        ariaLabel="View mode"
      />,
    );
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Map' }), {
      key: 'Enter',
    });
    expect(onChange).toHaveBeenCalledWith('map');
  });

  it('Space selects the focused option', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl<Mode>
        value="grid"
        options={options}
        onChange={onChange}
        ariaLabel="View mode"
      />,
    );
    fireEvent.keyDown(screen.getByRole('radio', { name: 'List' }), {
      key: ' ',
    });
    expect(onChange).toHaveBeenCalledWith('list');
  });

  it('Home jumps to the first option, End to the last', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl<Mode>
        value="map"
        options={options}
        onChange={onChange}
        ariaLabel="View mode"
      />,
    );
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Map' }), {
      key: 'Home',
    });
    expect(onChange).toHaveBeenLastCalledWith('grid');
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Map' }), {
      key: 'End',
    });
    expect(onChange).toHaveBeenLastCalledWith('list');
  });

  it('disabled — aria-disabled set, click does NOT fire onChange', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl<Mode>
        value="grid"
        options={options}
        onChange={onChange}
        ariaLabel="View mode"
        disabled
      />,
    );
    expect(
      screen.getByRole('radiogroup').getAttribute('aria-disabled'),
    ).toBe('true');
    fireEvent.click(screen.getByRole('radio', { name: 'Map' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disabled — keyboard navigation does NOT fire onChange', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl<Mode>
        value="grid"
        options={options}
        onChange={onChange}
        ariaLabel="View mode"
        disabled
      />,
    );
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Grid' }), {
      key: 'ArrowRight',
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders an icon when provided', () => {
    const opts: SegmentedControlOption<Mode>[] = [
      {
        value: 'grid',
        label: 'Grid',
        icon: <span data-testid="grid-icon">⊞</span>,
      },
      { value: 'map', label: 'Map' },
    ];
    render(
      <SegmentedControl<Mode>
        value="grid"
        options={opts}
        onChange={() => undefined}
        ariaLabel="View mode"
      />,
    );
    expect(screen.getByTestId('grid-icon')).toBeDefined();
  });

  it('honours ariaLabel override per option', () => {
    const opts: SegmentedControlOption<Mode>[] = [
      { value: 'grid', label: 'G', ariaLabel: 'Grid view' },
      { value: 'map', label: 'M', ariaLabel: 'Map view' },
    ];
    render(
      <SegmentedControl<Mode>
        value="grid"
        options={opts}
        onChange={() => undefined}
        ariaLabel="View mode"
      />,
    );
    expect(
      screen.getByRole('radio', { name: 'Grid view' }),
    ).toBeDefined();
  });

  it('exposes data-active on the active segment', () => {
    render(
      <SegmentedControl<Mode>
        value="map"
        options={options}
        onChange={() => undefined}
        ariaLabel="View mode"
      />,
    );
    expect(
      screen
        .getByTestId('segmented-control-option-map')
        .getAttribute('data-active'),
    ).toBe('true');
    expect(
      screen
        .getByTestId('segmented-control-option-grid')
        .getAttribute('data-active'),
    ).toBe('false');
  });

  it('renders sm size by default-as-md and md when specified', () => {
    const { container, rerender } = render(
      <SegmentedControl<Mode>
        value="grid"
        options={options}
        onChange={() => undefined}
        ariaLabel="View mode"
        size="sm"
      />,
    );
    const wrap = container.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(wrap.getAttribute('data-size')).toBe('sm');

    rerender(
      <SegmentedControl<Mode>
        value="grid"
        options={options}
        onChange={() => undefined}
        ariaLabel="View mode"
        size="md"
      />,
    );
    expect(wrap.getAttribute('data-size')).toBe('md');
  });

  it('density=compact forces sm sizing even if size=md', () => {
    const { container } = render(
      <DensityProvider density="compact">
        <SegmentedControl<Mode>
          value="grid"
          options={options}
          onChange={() => undefined}
          ariaLabel="View mode"
          size="md"
        />
      </DensityProvider>,
    );
    const wrap = container.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(wrap.getAttribute('data-size')).toBe('sm');
    expect(wrap.getAttribute('data-density')).toBe('compact');
  });

  it('does NOT inject hardcoded hex colours into the rendered DOM', () => {
    const { container } = render(
      <SegmentedControl<Mode>
        value="grid"
        options={options}
        onChange={() => undefined}
        ariaLabel="View mode"
      />,
    );
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });

  it('handles 2-option case (the most common — Grid|Map)', () => {
    const onChange = vi.fn();
    const twoOpts: SegmentedControlOption<'grid' | 'map'>[] = [
      { value: 'grid', label: 'Grid' },
      { value: 'map', label: 'Map' },
    ];
    render(
      <SegmentedControl<'grid' | 'map'>
        value="grid"
        options={twoOpts}
        onChange={onChange}
        ariaLabel="View mode"
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Map' }));
    expect(onChange).toHaveBeenCalledWith('map');
  });
});
