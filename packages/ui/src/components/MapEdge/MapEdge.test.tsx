/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MapEdge, buildEdgePath } from './MapEdge';

afterEach(cleanup);

/**
 * SVG components must be rendered inside an <svg> element for jsdom to give us
 * the same node tree the browser would. Helper wrapper avoids repeating it.
 */
function renderInSvg(children: React.ReactNode) {
  return render(<svg data-testid="svg-host">{children}</svg>);
}

describe('MapEdge', () => {
  it('renders a single <path> element (no wrapper)', () => {
    const { container } = renderInSvg(
      <MapEdge fromX={0} fromY={0} toX={100} toY={100} />,
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    const paths = svg!.querySelectorAll('path');
    expect(paths).toHaveLength(1);
  });

  it('uses the cubic-bezier path produced by buildEdgePath()', () => {
    const { container } = renderInSvg(
      <MapEdge fromX={0} fromY={0} toX={100} toY={50} />,
    );
    const path = container.querySelector('path');
    expect(path).not.toBeNull();
    expect(path!.getAttribute('d')).toBe(buildEdgePath(0, 0, 100, 50));
  });

  it('buildEdgePath returns "M fromX fromY C ..." with control points at 50% dx', () => {
    expect(buildEdgePath(0, 0, 200, 100)).toBe(
      'M 0 0 C 100 0, 100 100, 200 100',
    );
    expect(buildEdgePath(20, 30, 220, 30)).toBe(
      'M 20 30 C 120 30, 120 30, 220 30',
    );
  });

  it('handles inverted (right-to-left) edges symmetrically', () => {
    expect(buildEdgePath(200, 0, 0, 100)).toBe(
      'M 200 0 C 100 0, 100 100, 0 100',
    );
  });

  it('renders dashed by default and undashed when dashed=false', () => {
    const { container, rerender } = renderInSvg(
      <MapEdge fromX={0} fromY={0} toX={50} toY={50} />,
    );
    let path = container.querySelector('path');
    expect(path?.getAttribute('stroke-dasharray')).toBe('6 4');
    expect(path?.getAttribute('data-dashed')).toBe('true');

    rerender(
      <svg>
        <MapEdge fromX={0} fromY={0} toX={50} toY={50} dashed={false} />
      </svg>,
    );
    path = container.querySelector('path');
    expect(path?.getAttribute('stroke-dasharray')).toBeNull();
    expect(path?.getAttribute('data-dashed')).toBe('false');
  });

  it('exposes data-active on the path so consumers can target it', () => {
    const { container, rerender } = renderInSvg(
      <MapEdge fromX={0} fromY={0} toX={50} toY={50} active />,
    );
    let path = container.querySelector('path');
    expect(path?.getAttribute('data-active')).toBe('true');

    rerender(
      <svg>
        <MapEdge fromX={0} fromY={0} toX={50} toY={50} />
      </svg>,
    );
    path = container.querySelector('path');
    expect(path?.getAttribute('data-active')).toBe('false');
  });

  it('uses token-driven stroke colour (no hex) for active and idle states', () => {
    const { container, rerender } = renderInSvg(
      <MapEdge fromX={0} fromY={0} toX={50} toY={50} active />,
    );
    let path = container.querySelector('path');
    expect(path?.getAttribute('stroke')).toContain('--amp-semantic-border-accent');

    rerender(
      <svg>
        <MapEdge fromX={0} fromY={0} toX={50} toY={50} />
      </svg>,
    );
    path = container.querySelector('path');
    expect(path?.getAttribute('stroke')).toContain('--amp-semantic-border-subtle');
  });

  it('thicker stroke when active', () => {
    const { container, rerender } = renderInSvg(
      <MapEdge fromX={0} fromY={0} toX={50} toY={50} />,
    );
    let path = container.querySelector('path');
    const idleWidth = parseFloat(path!.getAttribute('stroke-width') ?? '0');

    rerender(
      <svg>
        <MapEdge fromX={0} fromY={0} toX={50} toY={50} active />
      </svg>,
    );
    path = container.querySelector('path');
    const activeWidth = parseFloat(path!.getAttribute('stroke-width') ?? '0');

    expect(activeWidth).toBeGreaterThan(idleWidth);
  });

  it('forwards className to the path element', () => {
    const { container } = renderInSvg(
      <MapEdge
        fromX={0}
        fromY={0}
        toX={50}
        toY={50}
        className="my-custom-edge"
      />,
    );
    const path = container.querySelector('path');
    expect(path?.getAttribute('class') ?? '').toContain('my-custom-edge');
  });

  it('renders fill=none so the curve is a stroke, not a filled shape', () => {
    const { container } = renderInSvg(
      <MapEdge fromX={0} fromY={0} toX={50} toY={50} />,
    );
    const path = container.querySelector('path');
    expect(path?.getAttribute('fill')).toBe('none');
  });
});
