import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IconCallout } from './IconCallout';
import { IconGrid } from '../IconGrid/IconGrid';

describe('IconCallout / IconGrid', () => {
  it('renders title and description', () => {
    render(
      <IconCallout
        icon={<svg data-testid="icon" />}
        title="Lightning fast"
        description="Sub-second response times across the stack."
      />
    );
    expect(screen.getByText('Lightning fast')).toBeDefined();
    expect(screen.getByText(/sub-second/i)).toBeDefined();
    expect(screen.getByTestId('icon')).toBeDefined();
  });

  it('IconGrid lays out multiple callouts', () => {
    const { container } = render(
      <IconGrid columns={3}>
        <IconCallout title="A" />
        <IconCallout title="B" />
        <IconCallout title="C" />
      </IconGrid>
    );
    expect(container.querySelectorAll('article').length).toBe(3);
    // Mobile = 1 col; md+ = 3 cols (sm:grid-cols-2 then lg:grid-cols-3).
    expect(container.firstElementChild?.className).toMatch(/grid-cols-1/);
    expect(container.firstElementChild?.className).toMatch(/lg:grid-cols-3/);
  });
});
