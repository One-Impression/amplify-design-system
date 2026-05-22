/**
 * Tests for the palette module.
 *
 * The build-time validator (scripts/validate-palette.js) is the
 * authoritative check that every palette entry resolves in every theme.
 * These tests catch shape + format regressions separately:
 *   - Every leaf value matches the canonical SDUI token regex
 *   - Snapshot of the palette object shape (prevents accidental
 *     rename / removal of a public entry — a breaking change for
 *     downstream BFF consumers)
 */

import { describe, it, expect } from 'vitest';
import { palette } from './palette.js';

const SDUI_TOKEN_REGEX = /^sdui\.[a-z-]+\.[a-z0-9-]+$/;

describe('palette — format', () => {
  function collectLeaves(obj, path = []) {
    const leaves = [];
    for (const [key, value] of Object.entries(obj)) {
      const p = [...path, key];
      if (typeof value === 'string') {
        leaves.push({ path: p.join('.'), value });
      } else if (value && typeof value === 'object') {
        leaves.push(...collectLeaves(value, p));
      }
    }
    return leaves;
  }

  it('every leaf value matches the canonical SDUI token regex', () => {
    const leaves = collectLeaves(palette);
    expect(leaves.length).toBeGreaterThan(0);
    for (const { path, value } of leaves) {
      expect(value, `palette.${path}`).toMatch(SDUI_TOKEN_REGEX);
    }
  });

  it('all six SDUI token families are represented', () => {
    const leaves = collectLeaves(palette);
    const families = new Set(leaves.map((l) => l.value.split('.')[1]));
    expect(families).toContain('color');
    expect(families).toContain('font-size');
    expect(families).toContain('font-weight');
    expect(families).toContain('spacing');
    expect(families).toContain('radius');
    expect(families).toContain('icon-size');
    expect(families).toContain('border-width');
  });
});

describe('palette — shape stability (snapshot)', () => {
  it('top-level keys are stable', () => {
    expect(Object.keys(palette).sort()).toEqual(
      [
        'borderWidth',
        'brand',
        'font',
        'icon',
        'radius',
        'spacing',
        'status',
        'surface',
        'text',
        'weight',
      ].sort(),
    );
  });

  it('text group has expected keys', () => {
    expect(Object.keys(palette.text).sort()).toEqual(
      ['inverse', 'medium', 'strong', 'subtle', 'weak'].sort(),
    );
  });

  it('font + spacing + radius + icon + borderWidth have expected size shorthand', () => {
    // Smoke-check that the shorthand scales are intact
    expect(palette.font.md).toBeDefined();
    expect(palette.spacing.md).toBeDefined();
    expect(palette.radius.md).toBeDefined();
    expect(palette.icon.md).toBeDefined();
    expect(palette.borderWidth.thin).toBeDefined();
  });

  it('status group covers positive / notice / negative + weak variants', () => {
    expect(palette.status.positive).toBeDefined();
    expect(palette.status.positiveWeak).toBeDefined();
    expect(palette.status.notice).toBeDefined();
    expect(palette.status.noticeWeak).toBeDefined();
    expect(palette.status.negative).toBeDefined();
    expect(palette.status.negativeWeak).toBeDefined();
  });
});

describe('palette — immutability', () => {
  it('top-level object is frozen', () => {
    expect(Object.isFrozen(palette)).toBe(true);
  });

  it('nested groups are frozen', () => {
    expect(Object.isFrozen(palette.text)).toBe(true);
    expect(Object.isFrozen(palette.surface)).toBe(true);
    expect(Object.isFrozen(palette.status)).toBe(true);
    expect(Object.isFrozen(palette.font)).toBe(true);
    expect(Object.isFrozen(palette.spacing)).toBe(true);
  });
});
