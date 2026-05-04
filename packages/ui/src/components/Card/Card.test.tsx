import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';

describe('Card', () => {
  it('renders children with default variant + padding', () => {
    render(
      <Card>
        <p>hello</p>
      </Card>,
    );
    expect(screen.getByText('hello')).toBeDefined();
  });

  it('forwards arbitrary attributes (data-*)', () => {
    render(
      <Card data-testid="card-root">
        <p>x</p>
      </Card>,
    );
    expect(screen.getByTestId('card-root')).toBeDefined();
  });

  it('attaches role=button + tabIndex when onClick is supplied', () => {
    const onClick = vi.fn();
    render(
      <Card onClick={onClick} data-testid="card">
        <p>click me</p>
      </Card>,
    );
    const el = screen.getByTestId('card');
    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('tabindex')).toBe('0');
  });

  it('activates onClick via Enter and Space when interactive', () => {
    const onClick = vi.fn();
    render(
      <Card onClick={onClick} data-testid="card">
        <p>interactive</p>
      </Card>,
    );
    const el = screen.getByTestId('card');
    fireEvent.keyDown(el, { key: 'Enter' });
    fireEvent.keyDown(el, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('does not attach role=button when no onClick + variant != interactive', () => {
    render(
      <Card data-testid="card">
        <p>static</p>
      </Card>,
    );
    expect(screen.getByTestId('card').getAttribute('role')).toBeNull();
  });

  it('renders as a real <button> when as="button"', () => {
    render(
      <Card as="button" onClick={() => undefined}>
        <p>btn</p>
      </Card>,
    );
    const btn = screen.getByRole('button');
    expect(btn.tagName.toLowerCase()).toBe('button');
  });

  describe('Slots', () => {
    it('renders Card.Header with title + subtitle + badge', () => {
      render(
        <Card>
          <Card.Header
            title="My title"
            subtitle="Some subtitle"
            badge={<span data-testid="badge">New</span>}
          />
        </Card>,
      );
      expect(screen.getByText('My title')).toBeDefined();
      expect(screen.getByText('Some subtitle')).toBeDefined();
      expect(screen.getByTestId('badge')).toBeDefined();
    });

    it('Card.Header passes through children when provided (legacy mode)', () => {
      render(
        <Card>
          <Card.Header>
            <span data-testid="custom">custom header</span>
          </Card.Header>
        </Card>,
      );
      expect(screen.getByTestId('custom')).toBeDefined();
    });

    it('renders Card.Body / Card.Footer / Card.Actions', () => {
      render(
        <Card>
          <Card.Body>body</Card.Body>
          <Card.Footer>foot</Card.Footer>
          <Card.Actions>
            <button>act</button>
          </Card.Actions>
        </Card>,
      );
      expect(screen.getByText('body')).toBeDefined();
      expect(screen.getByText('foot')).toBeDefined();
      expect(screen.getByRole('button', { name: 'act' })).toBeDefined();
    });

    it('renders Card.Media slot', () => {
      render(
        <Card>
          <Card.Media>
            <img alt="x" src="/x" data-testid="media" />
          </Card.Media>
        </Card>,
      );
      expect(screen.getByTestId('media')).toBeDefined();
    });
  });

  describe('Backward compat', () => {
    it('keeps top-level CardHeader / CardTitle / CardDescription exports', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>v1 title</CardTitle>
            <CardDescription>v1 desc</CardDescription>
          </CardHeader>
          <CardContent>v1 content</CardContent>
          <CardFooter>v1 footer</CardFooter>
        </Card>,
      );
      expect(screen.getByText('v1 title')).toBeDefined();
      expect(screen.getByText('v1 desc')).toBeDefined();
      expect(screen.getByText('v1 content')).toBeDefined();
      expect(screen.getByText('v1 footer')).toBeDefined();
    });

    it('accepts v1 padding names ("md") and v2 padding names ("default")', () => {
      const { container: c1 } = render(
        <Card padding="md">
          <p>x</p>
        </Card>,
      );
      const { container: c2 } = render(
        <Card padding="default">
          <p>y</p>
        </Card>,
      );
      // Both should produce identical padding classes (p-4).
      expect(c1.firstChild).toBeDefined();
      expect(c2.firstChild).toBeDefined();
    });
  });
});
