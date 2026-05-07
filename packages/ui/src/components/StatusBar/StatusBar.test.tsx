/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { StatusBar, type StatusBarItem } from './StatusBar';
import { DensityProvider } from '../../lib/density';

afterEach(cleanup);

const baseItems: StatusBarItem[] = [
  { id: 'model', label: 'Model', value: 'opus-4-7' },
  { id: 'sha', label: 'SHA', value: '87dce7a', variant: 'mono' },
  { id: 'generations', label: 'Gens', value: '12' },
];

describe('StatusBar', () => {
  it('renders a region with default aria-label="Status"', () => {
    render(<StatusBar items={baseItems} />);
    const region = screen.getByRole('region', { name: 'Status' });
    expect(region).toBeDefined();
  });

  it('honours a caller-provided aria-label', () => {
    render(<StatusBar items={baseItems} aria-label="Cockpit footer" />);
    expect(screen.getByRole('region', { name: 'Cockpit footer' })).toBeDefined();
  });

  it('renders one dt/dd pair per item', () => {
    render(<StatusBar items={baseItems} />);
    const list = screen.getByTestId('status-bar-list');
    const dts = list.querySelectorAll('dt');
    const dds = list.querySelectorAll('dd');
    expect(dts).toHaveLength(baseItems.length);
    expect(dds).toHaveLength(baseItems.length);
  });

  it('renders the label and value for each item', () => {
    render(<StatusBar items={baseItems} />);
    expect(screen.getByText('Model')).toBeDefined();
    expect(screen.getByText('opus-4-7')).toBeDefined();
    expect(screen.getByText('SHA')).toBeDefined();
    expect(screen.getByText('87dce7a')).toBeDefined();
  });

  it('exposes data-variant for styling hooks (mono / default)', () => {
    render(<StatusBar items={baseItems} />);
    expect(
      screen.getByTestId('status-bar-item-model').getAttribute('data-variant'),
    ).toBe('default');
    expect(
      screen.getByTestId('status-bar-item-sha').getAttribute('data-variant'),
    ).toBe('mono');
  });

  it('renders mono values with the monospace font class', () => {
    render(<StatusBar items={baseItems} />);
    const monoCell = screen
      .getByTestId('status-bar-item-sha')
      .querySelector('dd');
    expect(monoCell?.className).toContain('font-mono');
  });

  it('default cells do NOT get the monospace class', () => {
    render(<StatusBar items={baseItems} />);
    const defaultCell = screen
      .getByTestId('status-bar-item-model')
      .querySelector('dd');
    expect(defaultCell?.className).not.toContain('font-mono');
  });

  it('truncate=true applies the truncate class and a title attribute', () => {
    const items: StatusBarItem[] = [
      {
        id: 'long',
        label: 'Path',
        value: '/very/long/path/that/should/truncate/in/the/cell',
        truncate: true,
      },
    ];
    render(<StatusBar items={items} />);
    const dd = screen.getByTestId('status-bar-item-long').querySelector('dd');
    expect(dd?.className).toContain('truncate');
    expect(dd?.getAttribute('title')).toBe(
      '/very/long/path/that/should/truncate/in/the/cell',
    );
  });

  it('does NOT add a title attribute when truncate is unset', () => {
    render(<StatusBar items={baseItems} />);
    const dd = screen.getByTestId('status-bar-item-model').querySelector('dd');
    expect(dd?.getAttribute('title')).toBeNull();
  });

  it('honours maxWidth on the value cell', () => {
    const items: StatusBarItem[] = [
      { id: 'm', label: 'M', value: 'x', maxWidth: '12rem' },
    ];
    render(<StatusBar items={items} />);
    const dd = screen.getByTestId('status-bar-item-m').querySelector('dd');
    expect((dd as HTMLElement | null)?.style.maxWidth).toBe('12rem');
  });

  it('align="between" pushes the last item to the right', () => {
    render(<StatusBar items={baseItems} align="between" />);
    const last = screen.getByTestId('status-bar-item-generations');
    expect(last.className).toContain('ml-auto');
  });

  it('align="start" does NOT push any item', () => {
    render(<StatusBar items={baseItems} align="start" />);
    const last = screen.getByTestId('status-bar-item-generations');
    expect(last.className).not.toContain('ml-auto');
  });

  it('exposes data-align on the dl wrapper', () => {
    render(<StatusBar items={baseItems} align="between" />);
    expect(
      screen.getByTestId('status-bar-list').getAttribute('data-align'),
    ).toBe('between');
  });

  it('renders ReactNode values (icon + text) without crashing', () => {
    const items: StatusBarItem[] = [
      {
        id: 'rich',
        label: 'Status',
        value: (
          <span>
            <span data-testid="status-icon" aria-hidden="true">
              {'•'}
            </span>
            <span>Live</span>
          </span>
        ),
      },
    ];
    render(<StatusBar items={items} />);
    expect(screen.getByTestId('status-icon')).toBeDefined();
    expect(screen.getByText('Live')).toBeDefined();
  });

  it('does NOT inject hardcoded hex colours into the rendered DOM', () => {
    const { container } = render(<StatusBar items={baseItems} />);
    // Every colour must come from a CSS variable.
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });

  it('honours density context — compact reduces vertical padding', () => {
    const { container: compact } = render(
      <DensityProvider density="compact">
        <StatusBar items={baseItems} />
      </DensityProvider>,
    );
    const compactRegion = compact.querySelector('[role="region"]') as HTMLElement;
    expect(compactRegion.className).toContain('py-0.5');

    cleanup();

    const { container: spacious } = render(
      <DensityProvider density="spacious">
        <StatusBar items={baseItems} />
      </DensityProvider>,
    );
    const spaciousRegion = spacious.querySelector('[role="region"]') as HTMLElement;
    expect(spaciousRegion.className).toContain('py-1.5');
  });

  it('renders nothing-but-the-region when items=[]', () => {
    render(<StatusBar items={[]} />);
    const region = screen.getByRole('region', { name: 'Status' });
    expect(region.querySelectorAll('dt')).toHaveLength(0);
    expect(region.querySelectorAll('dd')).toHaveLength(0);
  });
});
