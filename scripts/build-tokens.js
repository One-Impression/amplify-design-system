#!/usr/bin/env node
/**
 * Shared token build script for all @amplify/tokens-* packages.
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

const VALID_PACKAGES = ['foundation', 'brand', 'atmosphere', 'creator'];
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
    '/* Import in your globals.css: @import "@amplify/tokens-' + pkg + '/dist/tailwind.css"; */',
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

// 6. React Native JS (creator only)
function buildReactNative() {
  const colors = {};
  const fontSize = {};
  const spacing = {};

  for (const [key, value] of Object.entries(flat)) {
    if (key.startsWith('sdui-color-') || key.startsWith('theme-color-') || key.startsWith('semantic-')) {
      const name = key.replace(/^(sdui-color-|theme-color-|semantic-)/, '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      colors[name] = value;
    } else if (key.startsWith('color-')) {
      const name = key.replace(/^color-/, '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      colors[name] = value;
    } else if (key.startsWith('font-size-')) {
      const name = key.replace('font-size-', '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      const numVal = parseInt(String(value), 10);
      if (!isNaN(numVal)) fontSize[name] = numVal;
    } else if (key.startsWith('spacing-')) {
      const name = key.replace('spacing-', '');
      const numVal = parseInt(String(value), 10);
      if (!isNaN(numVal)) spacing[name] = numVal;
    }
  }

  return `/** Auto-generated React Native tokens — do not edit */
export const colors = ${JSON.stringify(colors, null, 2)};
export const fontSize = ${JSON.stringify(fontSize, null, 2)};
export const spacing = ${JSON.stringify(spacing, null, 2)};
`;
}

// 7. Dark mode CSS — loads dark semantic + dark product theme, outputs [data-theme="dark"] block
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
const darkCSS = buildDarkCSS();
writeFileSync(join(distDir, 'variables.css'), lightCSS + darkCSS);
writeFileSync(join(distDir, 'variables.scss'), buildSCSS());
writeFileSync(join(distDir, 'tokens.json'), buildJSON());
writeFileSync(join(distDir, 'tokens.js'), buildJS());
writeFileSync(join(distDir, 'tailwind.css'), buildTailwindPreset());

if (pkg === 'creator') {
  writeFileSync(join(distDir, 'tokens.native.js'), buildReactNative());
  console.log(`@amplify/tokens-${pkg}: built 6 artifacts (+ React Native)`);
} else {
  console.log(`@amplify/tokens-${pkg}: built 5 artifacts`);
}

// Fail build if any references could not be resolved
if (unresolvedRefs.length > 0) {
  console.error(`\nERROR: ${unresolvedRefs.length} unresolved reference(s) found:`);
  for (const ref of unresolvedRefs) {
    console.error(`  - ${ref}`);
  }
  console.error('Run "node scripts/validate-tokens.js" for details.');
  process.exit(1);
}
