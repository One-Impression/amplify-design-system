/**
 * Shared SVG/chart utility helpers used by data viz primitives.
 * Hand-rolled (no chart lib dep) — keeps @amplify-ai/ui zero-runtime-dep aside from clsx.
 */

/** Default chart colour palette — references CSS vars defined in @amplify/tokens-* */
// TODO(phase-a): swap to design-token CSS vars once tokens-foundation v2.x ships
export const DEFAULT_CHART_COLORS = [
  'var(--amp-semantic-accent, #7c3aed)',
  'var(--amp-semantic-status-info, #2563eb)',
  'var(--amp-semantic-status-success, #16a34a)',
  'var(--amp-semantic-status-warning, #d97706)',
  'var(--amp-semantic-status-error, #dc2626)',
  'var(--amp-semantic-accent-2, #ec4899)',
  'var(--amp-semantic-accent-3, #06b6d4)',
  'var(--amp-semantic-accent-4, #84cc16)',
];

export function pickColor(index: number, colors: readonly string[] = DEFAULT_CHART_COLORS): string {
  return colors[index % colors.length];
}

/** Linear scale: maps a value in [domainMin, domainMax] to [rangeMin, rangeMax]. */
export function linearScale(
  value: number,
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number
): number {
  if (domainMax === domainMin) return rangeMin;
  const t = (value - domainMin) / (domainMax - domainMin);
  return rangeMin + t * (rangeMax - rangeMin);
}

/** Compute "nice" tick values for a numeric axis. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) return [min];
  const range = niceNumber(max - min, false);
  const step = niceNumber(range / (count - 1), true);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + 1e-9; v += step) {
    ticks.push(parseFloat(v.toFixed(10)));
  }
  return ticks;
}

function niceNumber(range: number, round: boolean): number {
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / Math.pow(10, exponent);
  let niceFraction: number;
  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }
  return niceFraction * Math.pow(10, exponent);
}

/** Format number for axis labels (compact: 1.2K, 3.4M). */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e9) return (value / 1e9).toFixed(abs >= 1e10 ? 0 : 1) + 'B';
  if (abs >= 1e6) return (value / 1e6).toFixed(abs >= 1e7 ? 0 : 1) + 'M';
  if (abs >= 1e3) return (value / 1e3).toFixed(abs >= 1e4 ? 0 : 1) + 'K';
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

/** Build a smooth-ish SVG path for a polyline (linear segments). */
export function buildLinePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ');
}

/** Build a closed area path (line + bottom edge) for area charts / sparklines. */
export function buildAreaPath(
  points: Array<{ x: number; y: number }>,
  baselineY: number
): string {
  if (points.length === 0) return '';
  const line = buildLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L${last.x.toFixed(2)},${baselineY.toFixed(2)} L${first.x.toFixed(2)},${baselineY.toFixed(2)} Z`;
}

/** Compute SVG arc for pie/donut slices. cx,cy = center; r = radius. */
export function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number
): string {
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  const x0 = cx + rOuter * Math.cos(startAngle);
  const y0 = cy + rOuter * Math.sin(startAngle);
  const x1 = cx + rOuter * Math.cos(endAngle);
  const y1 = cy + rOuter * Math.sin(endAngle);
  if (rInner <= 0) {
    return `M${cx},${cy} L${x0},${y0} A${rOuter},${rOuter} 0 ${largeArc} 1 ${x1},${y1} Z`;
  }
  const xi0 = cx + rInner * Math.cos(endAngle);
  const yi0 = cy + rInner * Math.sin(endAngle);
  const xi1 = cx + rInner * Math.cos(startAngle);
  const yi1 = cy + rInner * Math.sin(startAngle);
  return [
    `M${x0},${y0}`,
    `A${rOuter},${rOuter} 0 ${largeArc} 1 ${x1},${y1}`,
    `L${xi0},${yi0}`,
    `A${rInner},${rInner} 0 ${largeArc} 0 ${xi1},${yi1}`,
    'Z',
  ].join(' ');
}

/** Sum helper that ignores NaN/undefined. */
export function sum(values: ReadonlyArray<number | null | undefined>): number {
  let total = 0;
  for (const v of values) {
    if (typeof v === 'number' && Number.isFinite(v)) total += v;
  }
  return total;
}

/** Min/max across nested arrays of numbers (multi-series). */
export function extentMulti(seriesValues: ReadonlyArray<ReadonlyArray<number>>): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const row of seriesValues) {
    for (const v of row) {
      if (!Number.isFinite(v)) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  return [min, max];
}
