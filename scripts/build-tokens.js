#!/usr/bin/env node
/**
 * Shared token build script for all @amplify-ai/tokens-* packages.
 *
 * Reads W3C DTCG-format token JSON files, resolves {references},
 * and generates platform-specific outputs:
 *   - CSS custom properties (variables.css)
 *   - SCSS variables (variables.scss)
 *   - Flat JSON (tokens.json)
 *   - ES module JS (tokens.js)
 *   - React Native JS (tokens.native.js) — creator only
 *   - Tailwind v4 CSS preset (tailwind.css)
 *
 * Usage: node scripts/build-tokens.js <package-name>
 *   e.g. node scripts/build-tokens.js foundation
 *        node scripts/build-tokens.js brand
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const VALID_PACKAGES = ['foundation', 'brand', 'atmosphere', 'creator', 'studio', 'oportunities'];
const pkg = process.argv[2];
if (!pkg || !VALID_PACKAGES.includes(pkg)) {
  console.error(`Usage: node scripts/build-tokens.js <${VALID_PACKAGES.join('|')}>`);
  process.exit(1);
}

// ── Load all JSON token files recursively ──
function loadJsonFiles(dir) {
  const tokens = {};
  if (!existsSync(dir)) return tokens;

  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      Object.assign(tokens, loadJsonFiles(full));
    } else if (entry.endsWith('.json')) {
      const data = JSON.parse(readFileSync(full, 'utf8'));
      deepMerge(tokens, data);
    }
  }
  return tokens;
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && !('$value' in source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

// ── Resolve {reference.path} values ──
const unresolvedRefs = [];

function resolveValue(val, root) {
  if (typeof val !== 'string') return val;
  const match = val.match(/^\{(.+)\}$/);
  if (!match) return val;

  const path = match[1].split('.');
  let current = root;
  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      unresolvedRefs.push(val);
      console.warn(`WARNING: unresolved reference ${val}`);
      return val; // unresolved — keep as-is
    }
  }
  if (current && typeof current === 'object' && '$value' in current) {
    return resolveValue(current.$value, root);
  }
  if (typeof current === 'string') return resolveValue(current, root);
  return current ?? val;
}

function resolveAll(obj, root) {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object' && '$value' in val) {
      result[key] = { ...val, $value: resolveValue(val.$value, root) };
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = resolveAll(val, root);
    } else {
      result[key] = val;
    }
  }
  return result;
}

// ── Flatten to key-value pairs ──
function flatten(obj, prefix = '', sep = '-') {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue; // skip $type, $description
    const path = prefix ? `${prefix}${sep}${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      result[path] = val.$value;
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flatten(val, path, sep));
    }
  }
  return result;
}

// ── Load tokens ──
const foundationDir = join(ROOT, 'packages/tokens-foundation/tokens');
const primitivesDir = join(foundationDir, 'primitives');
const semanticDir = join(foundationDir, 'semantic');
const packageDir = join(ROOT, `packages/tokens-${pkg}/tokens`);

/**
 * Load foundation tokens deterministically:
 * 1. Always load primitives (stable base values)
 * 2. Load ONLY colors-light.json for the default theme (avoids non-deterministic
 *    deep-merge of light+dark which define the same semantic keys)
 * 3. Overlay product tokens on top
 */
let allTokens = {};

// Foundation primitives always loaded
allTokens = loadJsonFiles(primitivesDir);

// Semantic: explicitly load light theme as default
const lightSemanticFile = join(semanticDir, 'colors-light.json');
if (existsSync(lightSemanticFile)) {
  deepMerge(allTokens, JSON.parse(readFileSync(lightSemanticFile, 'utf8')));
}

// Product tokens overlay (if not foundation itself)
if (pkg !== 'foundation') {
  // For product packages, load only theme-light.json as default
  const themeLightFile = join(packageDir, 'theme-light.json');
  if (existsSync(themeLightFile)) {
    deepMerge(allTokens, JSON.parse(readFileSync(themeLightFile, 'utf8')));
  }
}

// Resolve all references
const resolved = resolveAll(allTokens, allTokens);
const flat = flatten(resolved);

// ── CSS prefix ──
const PREFIX = pkg === 'foundation' ? 'amp' : `amp-${pkg}`;

// ── Generate outputs ──
const distDir = join(ROOT, `packages/tokens-${pkg}/dist`);
mkdirSync(distDir, { recursive: true });

// 1. CSS custom properties
function buildCSS() {
  const lightTokens = flatten(resolveAll(allTokens, allTokens));
  const lines = ['/* Auto-generated by build-tokens.js — do not edit */', ':root {'];
  for (const [key, value] of Object.entries(lightTokens)) {
    if (typeof value === 'string' || typeof value === 'number') {
      lines.push(`  --${PREFIX}-${key}: ${value};`);
    }
  }
  lines.push('}', '');
  return lines.join('\n');
}

// 2. SCSS variables
function buildSCSS() {
  const lines = ['// Auto-generated by build-tokens.js — do not edit'];
  for (const [key, value] of Object.entries(flat)) {
    if (typeof value === 'string' || typeof value === 'number') {
      lines.push(`$${PREFIX}-${key}: ${value};`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

// 3. Flat JSON
function buildJSON() {
  const out = {};
  for (const [key, value] of Object.entries(flat)) {
    if (typeof value === 'string' || typeof value === 'number') {
      out[`${PREFIX}-${key}`] = value;
    }
  }
  return JSON.stringify(out, null, 2) + '\n';
}

// 4. ES module JS
function buildJS() {
  const lines = ['/** Auto-generated by build-tokens.js — do not edit */', ''];
  for (const [key, value] of Object.entries(flat)) {
    if (typeof value === 'string' || typeof value === 'number') {
      const camel = key.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      lines.push(`export const ${camel} = ${JSON.stringify(value)};`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

// 5. Tailwind v4 CSS preset
function buildTailwindPreset() {
  const lines = [
    '/* Auto-generated Tailwind v4 preset — do not edit */',
    '/* Import in your globals.css: @import "@amplify-ai/tokens-' + pkg + '/dist/tailwind.css"; */',
    '',
    '@theme {',
  ];

  // Map tokens to Tailwind theme variables
  for (const [key, value] of Object.entries(flat)) {
    if (typeof value !== 'string' && typeof value !== 'number') continue;
    // Colors
    if (key.startsWith('color-') || key.startsWith('semantic-') || key.startsWith('theme-color-')) {
      lines.push(`  --color-${key}: ${value};`);
    }
    // Spacing
    else if (key.startsWith('spacing-')) {
      lines.push(`  --spacing-${key.replace('spacing-', '')}: ${value};`);
    }
    // Radius
    else if (key.startsWith('radius-')) {
      lines.push(`  --radius-${key.replace('radius-', '')}: ${value};`);
    }
    // Shadows
    else if (key.startsWith('shadow-') && !key.includes('dark')) {
      lines.push(`  --shadow-${key.replace('shadow-', '')}: ${value};`);
    }
    // Font sizes
    else if (key.startsWith('font-size-')) {
      lines.push(`  --text-${key.replace('font-size-', '')}: ${value};`);
    }
  }

  lines.push('}', '');
  return lines.join('\n');
}

// 5b. Tailwind v4 consumer preset (Issue #88)
// Brand-style packages only. Maps Canvas's class names (bg-brand, text-primary,
// etc.) to the existing theme-color / semantic tier so consumers can
// `@import "@amplify-ai/tokens-<pkg>/preset"` instead of inlining a hand-rolled
// @theme bridge. Self-contained — re-emits the same primitives + semantic +
// theme-color block as tailwind.css plus the consumer alias layer below.
function buildConsumerPreset() {
  if (!['brand', 'atmosphere', 'creator'].includes(pkg)) return null;

  const lines = [
    '/* Auto-generated Tailwind v4 consumer preset — do not edit */',
    '/* Closes Issue #88: ship semantic class names (bg-brand, text-primary, ...)',
    ' * for Canvas component consumers. Self-contained — no need to also',
    ' * @import "@amplify-ai/tokens-' + pkg + '/tailwind". */',
    '/* Usage: @import "@amplify-ai/tokens-' + pkg + '/preset"; */',
    '',
    '@theme {',
  ];

  // Re-emit existing tailwind.css @theme block (primitives + semantic + theme-color)
  for (const [key, value] of Object.entries(flat)) {
    if (typeof value !== 'string' && typeof value !== 'number') continue;
    if (key.startsWith('color-') || key.startsWith('semantic-') || key.startsWith('theme-color-')) {
      lines.push(`  --color-${key}: ${value};`);
    } else if (key.startsWith('spacing-')) {
      lines.push(`  --spacing-${key.replace('spacing-', '')}: ${value};`);
    } else if (key.startsWith('radius-')) {
      lines.push(`  --radius-${key.replace('radius-', '')}: ${value};`);
    } else if (key.startsWith('shadow-') && !key.includes('dark')) {
      lines.push(`  --shadow-${key.replace('shadow-', '')}: ${value};`);
    } else if (key.startsWith('font-size-')) {
      lines.push(`  --text-${key.replace('font-size-', '')}: ${value};`);
    }
  }

  // Consumer alias layer — Canvas's class names → theme-color / semantic source
  // Per Issue #88. Mappings are provisional; canonical answers live with the
  // design-system team. Open design questions surfaced in PR #__ description.
  lines.push('');
  lines.push('  /* Consumer aliases (Canvas class-name layer) — Issue #88 */');

  const aliasMap = {
    // Brand / accent — theme-color tier (product-specific overrides)
    'brand': 'theme-color-accent',
    'brand-dark': 'theme-color-accent-hover',
    'brand-light': 'theme-color-accent-light',
    'accent': 'semantic-accent',
    'accent-subtle': 'semantic-accent-subtle',

    // Surfaces — semantic-bg-* tier
    'surface': 'semantic-bg-surface',
    'surface-overlay': 'semantic-bg-overlay',
    'base': 'semantic-bg-primary',
    'raised': 'semantic-bg-raised',
    'sunken': 'semantic-bg-sunken',
    'subtle': 'semantic-bg-sunken', // best-fit; flagged for review

    // Text — semantic-text-* tier
    'primary': 'semantic-text-primary',
    'secondary': 'semantic-text-secondary',
    'tertiary': 'semantic-text-muted', // best-fit; flagged for review
    'muted': 'semantic-text-muted',
    'faint': 'semantic-text-disabled',
    'inverse': 'semantic-text-inverse',

    // Status — semantic-status-* tier
    'positive': 'semantic-status-success',
    'positive-light': 'semantic-status-success-bg',
    'negative': 'semantic-status-error',
    'negative-light': 'semantic-status-error-bg',
    'warning': 'semantic-status-warning',
    'warning-light': 'semantic-status-warning-bg',

    // Borders — semantic-border-* tier
    'border-default': 'semantic-border-default',
    'border-strong': 'semantic-border-strong',
    'border-subtle': 'semantic-border-subtle',
    'border-accent': 'semantic-border-accent',
  };

  for (const [aliasName, sourceKey] of Object.entries(aliasMap)) {
    if (flat[sourceKey] === undefined) {
      console.warn(`@amplify-ai/tokens-${pkg}: preset alias "${aliasName}" → "${sourceKey}" not found in flat tree, skipping`);
      continue;
    }
    lines.push(`  --color-${aliasName}: var(--color-${sourceKey});`);
  }

  lines.push('}', '');
  return lines.join('\n');
}

// 6. React Native JS (creator only)
function buildReactNative() {
  const colors = {};
  const fontSize = {};
  const spacing = {};
  // SDUI-specific token buckets — consumed by useToken('sdui.*') in the creator app
  const sduiSpacing = {};
  const sduiFontSize = {};
  const sduiFontWeight = {};
  const sduiIconSize = {};
  const sduiRadius = {};
  const sduiBorderWidth = {};
  const sduiComponentButton = {};

  for (const [key, value] of Object.entries(flat)) {
    // ── SDUI tokens (sdui-* prefix) ──
    if (key.startsWith('sdui-color-')) {
      const name = key.replace(/^sdui-color-/, '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      colors[name] = value;
    } else if (key.startsWith('sdui-spacing-')) {
      const name = key.replace('sdui-spacing-', '');
      const numVal = parseInt(String(value), 10);
      if (!isNaN(numVal)) sduiSpacing[name] = numVal;
    } else if (key.startsWith('sdui-font-size-')) {
      const name = key.replace('sdui-font-size-', '');
      const numVal = parseInt(String(value), 10);
      if (!isNaN(numVal)) sduiFontSize[name] = numVal;
    } else if (key.startsWith('sdui-font-weight-')) {
      const name = key.replace('sdui-font-weight-', '');
      const numVal = parseInt(String(value), 10);
      if (!isNaN(numVal)) sduiFontWeight[name] = numVal;
    } else if (key.startsWith('sdui-icon-size-')) {
      const name = key.replace('sdui-icon-size-', '');
      const numVal = parseInt(String(value), 10);
      if (!isNaN(numVal)) sduiIconSize[name] = numVal;
    } else if (key.startsWith('sdui-radius-')) {
      const name = key.replace('sdui-radius-', '');
      const numVal = parseInt(String(value), 10);
      if (!isNaN(numVal)) sduiRadius[name] = numVal;
    } else if (key.startsWith('sdui-border-width-')) {
      const name = key.replace('sdui-border-width-', '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      const numVal = parseInt(String(value), 10);
      if (!isNaN(numVal)) sduiBorderWidth[name] = numVal;
    } else if (key.startsWith('sdui-component-button-')) {
      const name = key.replace('sdui-component-button-', '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      const numVal = parseInt(String(value), 10);
      if (!isNaN(numVal)) sduiComponentButton[name] = numVal;
    }
    // ── Theme / semantic / primitive color tokens ──
    else if (key.startsWith('theme-color-') || key.startsWith('semantic-')) {
      const name = key.replace(/^(theme-color-|semantic-)/, '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      colors[name] = value;
    } else if (key.startsWith('color-')) {
      const name = key.replace(/^color-/, '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      colors[name] = value;
    }
    // ── Generic (non-sdui) font-size and spacing tokens ──
    else if (key.startsWith('font-size-')) {
      const name = key.replace('font-size-', '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      const numVal = parseInt(String(value), 10);
      if (!isNaN(numVal)) fontSize[name] = numVal;
    } else if (key.startsWith('spacing-')) {
      const name = key.replace('spacing-', '');
      const numVal = parseInt(String(value), 10);
      if (!isNaN(numVal)) spacing[name] = numVal;
    }
  }

  // Build sdui namespace — flat lookup for useToken('sdui.spacing.xs') etc.
  const sdui = {
    color: {},
    spacing: sduiSpacing,
    fontSize: sduiFontSize,
    fontWeight: sduiFontWeight,
    iconSize: sduiIconSize,
    radius: sduiRadius,
    borderWidth: sduiBorderWidth,
    component: { button: sduiComponentButton },
  };
  // Populate sdui.color from the sdui-color-* entries already in colors
  for (const [key, value] of Object.entries(flat)) {
    if (key.startsWith('sdui-color-')) {
      const name = key.replace(/^sdui-color-/, '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      sdui.color[name] = value;
    }
  }

  return `/** Auto-generated React Native tokens — do not edit */
export const colors = ${JSON.stringify(colors, null, 2)};
export const fontSize = ${JSON.stringify(fontSize, null, 2)};
export const spacing = ${JSON.stringify(spacing, null, 2)};

/**
 * SDUI token namespace — all sdui.* tokens grouped for useToken() resolution.
 * Usage: import { sdui } from '@amplify-ai/tokens-creator/react-native';
 *        const value = sdui.spacing.xs; // 4
 */
export const sdui = ${JSON.stringify(sdui, null, 2)};
`;
}

// 7. Product-agnostic semantic aliases — emits --amp-semantic-* aliases that
//    resolve to whichever product theme is loaded. Canvas v2 primitives in
//    @amplify-ai/ui (BriefStrip, HistoryStrip, CouncilRail, VariantCard,
//    StatusBar, SegmentedControl) hard-code Tailwind arbitrary classes
//    referencing the agnostic --amp-semantic-* family. Without these aliases,
//    every primitive renders unstyled in every consumer.
//
//    Mechanism:
//    - For every product package (brand/atmosphere/creator/studio), each
//      alias points to the product-prefixed source: `--amp-semantic-bg-surface:
//      var(--amp-brand-semantic-bg-surface)` etc. Dark mode cascades
//      automatically through the var() indirection.
//    - For foundation, source vars are already `--amp-semantic-*` (foundation
//      uses the unprefixed `amp` namespace). We emit only aliases whose
//      target name differs from the source name; identity aliases would
//      create self-referencing CSS variables.
//
//    Source: STUDIO_DESIGN_PLAN.md §3.1 (Magic Studio docs). Replaces the
//    per-app hotfix in magic-studio/src/app/globals.css.
const SEMANTIC_ALIASES = [
  // Backgrounds
  ['bg-surface',          'semantic-bg-surface'],
  ['bg-base',             'semantic-bg-primary'],
  ['bg-canvas',           'semantic-bg-sunken'],
  ['bg-subtle',           'semantic-bg-sunken'],
  ['bg-sunken',           'semantic-bg-sunken'],
  ['bg-raised',           'semantic-bg-raised'],
  ['bg-accent',           'semantic-accent'],
  ['bg-accent-subtle',    'semantic-accent-subtle'],
  ['bg-success-subtle',   'semantic-status-success-bg'],
  ['bg-warning-subtle',   'semantic-status-warning-bg'],
  ['bg-error-subtle',     'semantic-status-error-bg'],
  ['bg-info-subtle',      'semantic-status-info-bg'],
  // Text
  ['text-default',        'semantic-text-primary'],
  ['text-primary',        'semantic-text-primary'],
  ['text-secondary',      'semantic-text-secondary'],
  ['text-tertiary',       'semantic-text-muted'],
  ['text-muted',          'semantic-text-muted'],
  ['text-inverse',        'semantic-text-inverse'],
  ['text-on-accent',      'semantic-text-inverse'],
  ['text-accent',         'semantic-text-accent'],
  // Status
  ['status-success',      'semantic-status-success'],
  ['status-warning',      'semantic-status-warning'],
  ['status-error',        'semantic-status-error'],
  ['status-info',         'semantic-status-info'],
  ['status-error-bg',     'semantic-status-error-bg'],
  ['status-warning-bg',   'semantic-status-warning-bg'],
  ['status-success-bg',   'semantic-status-success-bg'],
  ['status-info-bg',      'semantic-status-info-bg'],
  // Borders
  ['border-default',      'semantic-border-default'],
  ['border-strong',       'semantic-border-strong'],
  ['border-subtle',       'semantic-border-subtle'],
  ['border-accent',       'semantic-border-accent'],
  ['border-success',      'semantic-status-success'],
  ['border-error',        'semantic-status-error'],
  ['border-warning',      'semantic-status-warning'],
  ['border-info',         'semantic-status-info'],
  ['border-focus',        'semantic-border-focus'],
  // Accent
  ['accent',              'semantic-accent'],
  ['accent-light',        'semantic-accent-light'],
  ['accent-primary',      'semantic-accent'],
  ['accent-soft',         'semantic-accent-light'],
];

function buildSemanticAliases() {
  const lines = [
    '',
    '/* ──────────────────────────────────────────────────────────────────',
    '   Product-agnostic semantic aliases — resolve to active product theme.',
    '   Consumed by Canvas v2 primitives in @amplify-ai/ui via Tailwind',
    '   arbitrary classes (e.g. bg-[var(--amp-semantic-bg-accent-subtle)]).',
    '   Dark mode cascades through var() indirection automatically.',
    '   ────────────────────────────────────────────────────────────────── */',
    ':root {',
  ];
  for (const [aliasName, sourceName] of SEMANTIC_ALIASES) {
    const target = `--amp-semantic-${aliasName}`;
    const source = `--${PREFIX}-${sourceName}`;
    // Skip identity aliases (foundation case) — `--amp-semantic-bg-surface:
    // var(--amp-semantic-bg-surface)` would self-cycle. Foundation already
    // emits these names directly in the main :root block above.
    if (target === source) continue;
    lines.push(`  ${target}: var(${source});`);
  }
  lines.push('}', '');
  return lines.join('\n');
}

// 8. Dark mode CSS — loads dark semantic + dark product theme, outputs [data-theme="dark"] block
function buildDarkCSS() {
  const darkSemanticFile = join(semanticDir, 'colors-dark.json');
  const darkThemeFile = join(packageDir, 'theme-dark.json');
  const hasDarkSemantic = existsSync(darkSemanticFile);
  const hasDarkTheme = pkg !== 'foundation' && existsSync(darkThemeFile);

  if (!hasDarkSemantic && !hasDarkTheme) return '';

  let darkTokens = loadJsonFiles(primitivesDir);
  if (hasDarkSemantic) {
    deepMerge(darkTokens, JSON.parse(readFileSync(darkSemanticFile, 'utf8')));
  }
  if (hasDarkTheme) {
    deepMerge(darkTokens, JSON.parse(readFileSync(darkThemeFile, 'utf8')));
  }

  const darkResolved = resolveAll(darkTokens, darkTokens);
  const darkFlat = flatten(darkResolved);

  const lines = ['', '/* Dark mode overrides */', '[data-theme="dark"] {'];
  for (const [key, value] of Object.entries(darkFlat)) {
    if (typeof value === 'string' || typeof value === 'number') {
      lines.push(`  --${PREFIX}-${key}: ${value};`);
    }
  }
  lines.push('}', '', '@media (prefers-color-scheme: dark) {', '  :root:not([data-theme="light"]) {');
  for (const [key, value] of Object.entries(darkFlat)) {
    if (typeof value === 'string' || typeof value === 'number') {
      lines.push(`    --${PREFIX}-${key}: ${value};`);
    }
  }
  lines.push('  }', '}');
  return lines.join('\n');
}

// ── Write outputs ──
const lightCSS = buildCSS();
const aliasCSS = buildSemanticAliases();
const darkCSS = buildDarkCSS();
writeFileSync(join(distDir, 'variables.css'), lightCSS + aliasCSS + darkCSS);
writeFileSync(join(distDir, 'variables.scss'), buildSCSS());
writeFileSync(join(distDir, 'tokens.json'), buildJSON());
writeFileSync(join(distDir, 'tokens.js'), buildJS());
writeFileSync(join(distDir, 'tailwind.css'), buildTailwindPreset());

const consumerPreset = buildConsumerPreset();
if (consumerPreset !== null) {
  writeFileSync(join(distDir, 'preset.css'), consumerPreset);
}

const baseCount = 5;
const presetCount = consumerPreset !== null ? 1 : 0;
const rnCount = pkg === 'creator' ? 1 : 0;
const extras = [];
if (presetCount) extras.push('+ consumer preset');
if (rnCount) extras.push('+ React Native');
const total = baseCount + presetCount + rnCount;
const suffix = extras.length ? ` (${extras.join(', ')})` : '';

if (pkg === 'creator') {
  writeFileSync(join(distDir, 'tokens.native.js'), buildReactNative());
}
console.log(`@amplify-ai/tokens-${pkg}: built ${total} artifacts${suffix}`);

// Fail build if any references could not be resolved
if (unresolvedRefs.length > 0) {
  console.error(`\nERROR: ${unresolvedRefs.length} unresolved reference(s) found:`);
  for (const ref of unresolvedRefs) {
    console.error(`  - ${ref}`);
  }
  console.error('Run "node scripts/validate-tokens.js" for details.');
  process.exit(1);
}
