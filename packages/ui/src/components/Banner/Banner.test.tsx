import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders message and title', () => {
    render(<Banner variant="info" title="Heads up" message="Hello world" />);
    expect(screen.getByText('Heads up')).toBeDefined();
    expect(screen.getByText('Hello world')).toBeDefined();
  });

  it('uses role="alert" for warning + error variants', () => {
    const { rerender } = render(<Banner variant="warning" message="warn" />);
    expect(screen.getByRole('alert')).toBeDefined();
    rerender(<Banner variant="error" message="err" />);
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('uses role="status" for info + success', () => {
    const { rerender } = render(<Banner variant="info" message="info" />);
    expect(screen.getByRole('status')).toBeDefined();
    rerender(<Banner variant="success" message="ok" />);
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('fires onDismiss when dismiss button clicked', () => {
    const onDismiss = vi.fn();
    render(
      <Banner variant="info" message="msg" dismissible onDismiss={onDismiss} />
    );
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders action slot', () => {
    render(
      <Banner
        variant="info"
        message="msg"
        actions={<button data-testid="cta">Go</button>}
      />
    );
    expect(screen.getByTestId('cta')).toBeDefined();
  });
});
