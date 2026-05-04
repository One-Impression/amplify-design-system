/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { VariantCard } from './VariantCard';

afterEach(cleanup);

describe('VariantCard', () => {
  it('renders the name and lens tag', () => {
    render(<VariantCard state="empty" name="V1" lensTag="editorial" />);
    expect(screen.getByText('V1')).toBeDefined();
    expect(screen.getByTestId('variant-card-lens').textContent).toBe('editorial');
  });

  it('renders status text in header', () => {
    render(
      <VariantCard state="generating" name="V2" statusText="generating · 3.2s" />,
    );
    expect(screen.getByTestId('variant-card-status').textContent).toBe(
      'generating · 3.2s',
    );
  });

  it('empty state renders the empty placeholder', () => {
    render(<VariantCard state="empty" name="V1" />);
    expect(screen.getByTestId('variant-card-body-empty')).toBeDefined();
    expect(screen.getByText('No variant yet')).toBeDefined();
  });

  it('generating state renders the shimmer body with role="status"', () => {
    render(<VariantCard state="generating" name="V1" />);
    const generating = screen.getByTestId('variant-card-body-generating');
    expect(generating).toBeDefined();
    expect(generating.getAttribute('role')).toBe('status');
    expect(generating.getAttribute('aria-label')).toBe('Generating variant V1');
  });

  it('ready state renders children in the body slot', () => {
    render(
      <VariantCard state="ready" name="V1">
        <div data-testid="ready-body">hello</div>
      </VariantCard>,
    );
    expect(screen.getByTestId('ready-body')).toBeDefined();
  });

  it('error state renders role="alert" with the supplied message', () => {
    render(
      <VariantCard
        state="error"
        name="V1"
        errorMessage="Generation timed out"
      />,
    );
    const errorBody = screen.getByTestId('variant-card-body-error');
    expect(errorBody.getAttribute('role')).toBe('alert');
    expect(screen.getByText('Generation timed out')).toBeDefined();
  });

  it('error state renders Retry button only when onRetry is provided', () => {
    const onRetry = vi.fn();
    const { rerender } = render(
      <VariantCard state="error" name="V1" errorMessage="failed" />,
    );
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
    rerender(
      <VariantCard
        state="error"
        name="V1"
        errorMessage="failed"
        onRetry={onRetry}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('Retry click does NOT propagate to card onClick', () => {
    const onClick = vi.fn();
    const onRetry = vi.fn();
    render(
      <VariantCard
        state="error"
        name="V1"
        errorMessage="failed"
        onRetry={onRetry}
        onClick={onClick}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders score label with the correct variant data attribute', () => {
    render(
      <VariantCard
        state="ready"
        name="V1"
        scoreLabel="●● 91 council"
        scoreVariant="good"
      />,
    );
    const score = screen.getByTestId('variant-card-score');
    expect(score.textContent).toBe('●● 91 council');
    expect(score.getAttribute('data-score-variant')).toBe('good');
  });

  it('renders one footer button per action and fires onClick', () => {
    const lock = vi.fn();
    const fork = vi.fn();
    render(
      <VariantCard
        state="ready"
        name="V1"
        actions={[
          { id: 'l', label: 'Lock', onClick: lock },
          { id: 'f', label: 'Fork', onClick: fork },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Lock' }));
    fireEvent.click(screen.getByRole('button', { name: 'Fork' }));
    expect(lock).toHaveBeenCalledTimes(1);
    expect(fork).toHaveBeenCalledTimes(1);
  });

  it('action click does NOT bubble to the card onClick', () => {
    const onClick = vi.fn();
    const lock = vi.fn();
    render(
      <VariantCard
        state="ready"
        name="V1"
        onClick={onClick}
        actions={[{ id: 'l', label: 'Lock', onClick: lock }]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Lock' }));
    expect(lock).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('clicking the card fires onClick', () => {
    const onClick = vi.fn();
    render(<VariantCard state="ready" name="V1" onClick={onClick} />);
    const card = screen.getByRole('button', { name: 'Variant V1' });
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Enter / Space on the card fires onClick', () => {
    const onClick = vi.fn();
    render(<VariantCard state="ready" name="V1" onClick={onClick} />);
    const card = screen.getByRole('button', { name: 'Variant V1' });
    fireEvent.keyDown(card, { key: 'Enter' });
    fireEvent.keyDown(card, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('selected state sets aria-pressed=true (when interactive)', () => {
    render(
      <VariantCard state="ready" name="V1" selected onClick={() => undefined} />,
    );
    const card = screen.getByRole('button', { name: 'Variant V1' });
    expect(card.getAttribute('aria-pressed')).toBe('true');
  });

  it('non-interactive cards render as group, not button', () => {
    render(<VariantCard state="ready" name="V1" />);
    expect(screen.queryByRole('button', { name: 'Variant V1' })).toBeNull();
    expect(screen.getByRole('group', { name: 'Variant V1' })).toBeDefined();
  });

  it('exposes data-state for testing / styling hooks', () => {
    const { rerender } = render(<VariantCard state="empty" name="V1" />);
    expect(screen.getByRole('group').getAttribute('data-state')).toBe('empty');
    rerender(<VariantCard state="generating" name="V1" />);
    expect(screen.getByRole('group').getAttribute('data-state')).toBe('generating');
  });
});
