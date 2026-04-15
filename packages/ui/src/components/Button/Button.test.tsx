import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDefined();
    expect(button.disabled).toBe(false);
  });

  it('sets aria-busy and disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.disabled).toBe(true);
  });

  it('renders icon on the left by default', () => {
    const icon = <span data-testid="icon">*</span>;
    render(<Button icon={icon}>Label</Button>);
    const button = screen.getByRole('button');
    const iconEl = screen.getByTestId('icon');
    // Icon should come before the text node
    const children = Array.from(button.childNodes);
    const iconIndex = children.indexOf(iconEl);
    const textIndex = children.findIndex((n) => n.textContent === 'Label' && n.nodeType === Node.TEXT_NODE || (n as Element).textContent === 'Label');
    expect(iconIndex).toBeLessThan(textIndex);
  });

  it('renders icon on the right when iconPosition is right', () => {
    const icon = <span data-testid="icon">*</span>;
    render(
      <Button icon={icon} iconPosition="right">
        Label
      </Button>
    );
    const button = screen.getByRole('button');
    const iconEl = screen.getByTestId('icon');
    const children = Array.from(button.childNodes);
    const iconIndex = children.indexOf(iconEl);
    const textIndex = children.findIndex((n) => n.textContent === 'Label' && n !== iconEl);
    expect(iconIndex).toBeGreaterThan(textIndex);
  });

  it('forwards ref to the underlying button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toContain('Ref test');
  });
});
