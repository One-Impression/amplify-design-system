import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders brand + link columns + legal', () => {
    render(
      <Footer>
        <Footer.Brand logo="Amplify" tagline="Run influencer campaigns at scale." />
        <Footer.LinkColumn title="Product">
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
        </Footer.LinkColumn>
        <Footer.LinkColumn title="Company">
          <a href="/about">About</a>
        </Footer.LinkColumn>
        <Footer.Legal copyright="© 2026 Amplify">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </Footer.Legal>
      </Footer>
    );
    expect(screen.getByText('Amplify')).toBeDefined();
    expect(screen.getByText('Product')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
    expect(screen.getByText('© 2026 Amplify')).toBeDefined();
  });

  it('newsletter calls onSubmit with the typed email', () => {
    const onSubmit = vi.fn();
    render(
      <Footer>
        <Footer.Brand logo="Amplify" />
        <Footer.Newsletter onSubmit={onSubmit} buttonLabel="Sign up" />
      </Footer>
    );
    const input = document.querySelector('input[type="email"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'hi@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(onSubmit).toHaveBeenCalledWith('hi@example.com');
  });
});
