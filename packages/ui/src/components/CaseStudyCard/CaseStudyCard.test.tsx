import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseStudyCard } from './CaseStudyCard';

describe('CaseStudyCard', () => {
  it('renders quote, customer name and stats', () => {
    render(
      <CaseStudyCard
        quote="3x ROAS in 30 days"
        customerName="Maya Singh"
        customerRole="Head of Growth, Acme"
        stats={[
          { value: '3.2x', label: 'ROAS' },
          { value: '+87%', label: 'Conversion' },
        ]}
      />
    );
    expect(screen.getByText(/3x ROAS in 30 days/)).toBeDefined();
    expect(screen.getByText('Maya Singh')).toBeDefined();
    expect(screen.getByText('3.2x')).toBeDefined();
    expect(screen.getByText('+87%')).toBeDefined();
  });

  it('renders as an anchor when href is provided', () => {
    const { container } = render(
      <CaseStudyCard href="/stories/acme" quote="q" customerName="X" />
    );
    expect(container.querySelector('a')).not.toBeNull();
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/stories/acme');
  });

  it('renders as an article when no href', () => {
    const { container } = render(<CaseStudyCard quote="q" customerName="X" />);
    expect(container.querySelector('article')).not.toBeNull();
    expect(container.querySelector('a')).toBeNull();
  });
});
