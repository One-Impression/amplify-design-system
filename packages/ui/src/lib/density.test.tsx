import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DensityProvider, useDensity } from './density';
import { Button } from '../components/Button';

const Probe: React.FC = () => {
  const density = useDensity();
  return <span data-testid="density">{density}</span>;
};

describe('DensityProvider', () => {
  it('returns "comfortable" by default when no provider is in scope', () => {
    render(<Probe />);
    expect(screen.getByTestId('density').textContent).toBe('comfortable');
  });

  it('returns the value set by the nearest provider', () => {
    render(
      <DensityProvider density="compact">
        <Probe />
      </DensityProvider>
    );
    expect(screen.getByTestId('density').textContent).toBe('compact');
  });

  it('inner provider overrides outer', () => {
    render(
      <DensityProvider density="compact">
        <DensityProvider density="spacious">
          <Probe />
        </DensityProvider>
      </DensityProvider>
    );
    expect(screen.getByTestId('density').textContent).toBe('spacious');
  });
});

describe('Button density integration', () => {
  it('uses comfortable sizing by default (h-8 for size=sm) — backwards compatible', () => {
    render(<Button size="sm">Save</Button>);
    expect(screen.getByRole('button').className).toContain('h-8');
  });

  it('compact density makes size=sm render h-7 (atmosphere AT2 1px regression fix)', () => {
    render(
      <DensityProvider density="compact">
        <Button size="sm">Save</Button>
      </DensityProvider>
    );
    expect(screen.getByRole('button').className).toContain('h-7');
    expect(screen.getByRole('button').className).not.toContain('h-8');
  });

  it('spacious density makes size=md render h-11', () => {
    render(
      <DensityProvider density="spacious">
        <Button size="md">Save</Button>
      </DensityProvider>
    );
    expect(screen.getByRole('button').className).toContain('h-11');
  });

  it('density prop on component overrides ambient context', () => {
    render(
      <DensityProvider density="compact">
        <Button size="md" density="spacious">
          Save
        </Button>
      </DensityProvider>
    );
    expect(screen.getByRole('button').className).toContain('h-11');
  });

  it('preserves variant + text classes regardless of density (visual consistency check)', () => {
    render(
      <DensityProvider density="compact">
        <Button variant="primary" size="md">
          Save
        </Button>
      </DensityProvider>
    );
    const cls = screen.getByRole('button').className;
    expect(cls).toContain('bg-brand');
    expect(cls).toContain('text-white');
    expect(cls).toContain('rounded-md');
  });
});
