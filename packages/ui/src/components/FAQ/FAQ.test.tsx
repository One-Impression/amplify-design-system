import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQ } from './FAQ';

const items = [
  { id: 'q1', question: 'What is Amplify?', answer: 'A creator marketing platform.' },
  { id: 'q2', question: 'How much does it cost?', answer: 'Starts at $0.' },
  { id: 'q3', question: 'Do you offer support?', answer: 'Yes, 24/7 via email.' },
];

describe('FAQ', () => {
  it('renders all questions', () => {
    render(<FAQ items={items} />);
    expect(screen.getByText('What is Amplify?')).toBeDefined();
    expect(screen.getByText('How much does it cost?')).toBeDefined();
    expect(screen.getByText('Do you offer support?')).toBeDefined();
  });

  it('toggles open state via aria-expanded', () => {
    render(<FAQ items={items} />);
    const btn = screen.getByRole('button', { name: 'What is Amplify?' });
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(btn);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('single mode auto-collapses other items', () => {
    render(<FAQ items={items} mode="single" />);
    const btn1 = screen.getByRole('button', { name: 'What is Amplify?' });
    const btn2 = screen.getByRole('button', { name: 'How much does it cost?' });
    fireEvent.click(btn1);
    fireEvent.click(btn2);
    expect(btn1.getAttribute('aria-expanded')).toBe('false');
    expect(btn2.getAttribute('aria-expanded')).toBe('true');
  });

  it('multi mode keeps multiple items open', () => {
    render(<FAQ items={items} mode="multi" />);
    const btn1 = screen.getByRole('button', { name: 'What is Amplify?' });
    const btn2 = screen.getByRole('button', { name: 'How much does it cost?' });
    fireEvent.click(btn1);
    fireEvent.click(btn2);
    expect(btn1.getAttribute('aria-expanded')).toBe('true');
    expect(btn2.getAttribute('aria-expanded')).toBe('true');
  });

  it('emits valid FAQPage JSON-LD by default', () => {
    const { container } = render(<FAQ items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent ?? '{}');
    expect(data['@type']).toBe('FAQPage');
    expect(Array.isArray(data.mainEntity)).toBe(true);
    expect(data.mainEntity).toHaveLength(3);
    expect(data.mainEntity[0]['@type']).toBe('Question');
    expect(data.mainEntity[0].name).toBe('What is Amplify?');
    expect(data.mainEntity[0].acceptedAnswer.text).toBe('A creator marketing platform.');
  });

  it('omits JSON-LD when emitJsonLd=false', () => {
    const { container } = render(<FAQ items={items} emitJsonLd={false} />);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});
