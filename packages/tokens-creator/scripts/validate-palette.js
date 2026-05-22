#!/usr/bin/env node
/**
 * Build-time invariant: every palette entry must resolve to a real
 * token in EVERY theme JSON. Build fails on any missing reference.
 *
 * Catches the failure mode of a runtime missing-color on the creator's
 * phone by surfacing it at design-system build time instead — the
 * BFF emits palette.text.strong, the renderer resolves it against the
 * active theme's `sdui.color.neutral-strong` value, and BOTH halves
 * must agree about that path existing.
 *
 * Run: node packages/tokens-creator/scripts/validate-palette.js
 * Wired into: packages/tokens-creator/build.js (runs before the
 * style-dictionary build step).
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = join(__dirname, '..');

const THEME_FILES = ['theme-light.json', 'theme-dark.json'];

// ── Load palette from sibling palette.js ──────────────────────────────────
async function loadPalette() {
  const palettePath = join(PACKAGE_ROOT, 'palette.js');
  const module = await import(palettePath);
  return module.palette;
}

// ── Load theme JSON ───────────────────────────────────────────────────────
function loadTheme(filename) {
  const path = join(PACKAGE_ROOT, 'tokens', filename);
  return JSON.parse(readFileSync(path, 'utf8'));
}

// ── Walk a token string path (e.g. "sdui.color.neutral-strong") against
//    the theme JSON and confirm it leads to a valid `$value`. ──────────────
function lookupToken(themeRoot, tokenPath) {
  const segments = tokenPath.split('.');
  let current = themeRoot;
  for (const seg of segments) {
    if (current && typeof current === 'object' && seg in current) {
      current = current[seg];
    } else {
      return undefined;
    }
  }
  // Final node must have $value (DTCG token shape)
  if (current && typeof current === 'object' && '$value' in current) {
    return current.$value;
  }
  return undefined;
}

// ── Collect all leaf token strings from the nested palette object ─────────
function collectPaletteLeaves(palette, pathPrefix = []) {
  const leaves = [];
  for (const [key, value] of Object.entries(palette)) {
    const currentPath = [...pathPrefix, key];
    if (typeof value === 'string') {
      leaves.push({ alias: currentPath.join('.'), token: value });
    } else if (value && typeof value === 'object') {
      leaves.push(...collectPaletteLeaves(value, currentPath));
    }
  }
  return leaves;
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  const palette = await loadPalette();
  const leaves = collectPaletteLeaves(palette);
  const themes = THEME_FILES.map((filename) => ({
    name: filename.replace('.json', ''),
    data: loadTheme(filename),
  }));

  const failures = [];
  for (const theme of themes) {
    for (const { alias, token } of leaves) {
      const resolved = lookupToken(theme.data, token);
      if (resolved === undefined) {
        failures.push({ theme: theme.name, alias, token });
      }
    }
  }

  if (failures.length > 0) {
    console.error('');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`PALETTE VALIDATION FAILED — ${failures.length} unresolved alias(es)`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    for (const f of failures) {
      console.error(`  ✗ palette.${f.alias} → "${f.token}"  not found in ${f.theme}.json`);
    }
    console.error('');
    console.error('Fix order:');
    console.error('  1. Add the missing token to BOTH tokens/theme-light.json AND theme-dark.json');
    console.error('  2. Re-run build');
    console.error('  3. (Optional) Update PALETTE-DESIGN.md if the alias name changed');
    console.error('');
    process.exit(1);
  }

  console.log(
    `✓ palette: ${leaves.length} aliases × ${themes.length} themes — all resolve`
  );
}

main().catch((err) => {
  console.error('Palette validation script error:', err);
  process.exit(1);
});
