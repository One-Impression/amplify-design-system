import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContentTypeCard } from './ContentTypeCard';

describe('ContentTypeCard (preset wrapper around <Card>)', () => {
  it('renders title, badge, price and pros list', () => {
    render(
      <ContentTypeCard
        badge="Reels"
        title="Short reel"
        price="₹12,000"
        pros={['One', 'Two']}
      />,
    );
    expect(screen.getByText('Short reel')).toBeDefined();
    expect(screen.getByText('Reels')).toBeDefined();
    expect(screen.getByText('₹12,000')).toBeDefined();
    expect(screen.getByText('One')).toBeDefined();
    expect(screen.getByText('Two')).toBeDefined();
  });

  it('shows the recommended ribbon when recommended=true', () => {
    render(
      <ContentTypeCard
        badge="Static"
        title="Post"
        price="₹4k"
        pros={[]}
        recommended
      />,
    );
    expect(screen.getByText('Recommended')).toBeDefined();
  });

  it('fires onSelect on click and on Enter/Space (a11y)', () => {
    const onSelect = vi.fn();
    render(
      <ContentTypeCard
        badge="Reels"
        title="Reel"
        price="₹12k"
        pros={[]}
        onSelect={onSelect}
      />,
    );
    const role = screen.getByRole('button');
    fireEvent.click(role);
    fireEvent.keyDown(role, { key: 'Enter' });
    fireEvent.keyDown(role, { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(3);
  });

  it('reflects selected state via aria-pressed', () => {
    render(
      <ContentTypeCard
        badge="Reels"
        title="Reel"
        price="₹12k"
        pros={[]}
        selected
        onSelect={() => undefined}
      />,
    );
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
  });

  it('renders cancelPolicy when supplied', () => {
    render(
      <ContentTypeCard
        badge="Reels"
        title="Reel"
        price="₹12k"
        pros={[]}
        cancelPolicy="Free cancellation up to 48h"
      />,
    );
    expect(screen.getByText('Free cancellation up to 48h')).toBeDefined();
  });
});
