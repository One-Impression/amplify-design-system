#!/usr/bin/env node
/**
 * Cross-package token validation (W3C DTCG format)
 * Ensures consistency across foundation, brand, creator, and atmosphere packages.
 *
 * Checks:
 * 1. All product packages have valid token files
 * 2. Foundation primitives cover required categories
 * 3. Product theme files reference only valid foundation tokens
 * 4. No broken {references} in resolved output
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGES_DIR = join(__dirname, '..', 'packages');
let errors = 0;
let warnings = 0;

function loadJsonFilesRecursive(dir) {
  const tokens = {};
  if (!existsSync(dir)) return tokens;

  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      deepMerge(tokens, loadJsonFilesRecursive(full));
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

function extractDTCGValues(obj, prefix = '') {
  const result = [];
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      result.push({ path, value: val.$value, type: val.$type || null });
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      result.push(...extractDTCGValues(val, path));
    }
  }
  return result;
}

function findBrokenRefs(obj, root, prefix = '') {
  const broken = [];
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      const v = val.$value;
      if (typeof v === 'string' && v.match(/^\{.+\}$/)) {
        const refPath = v.slice(1, -1).split('.');
        let current = root;
        for (const seg of refPath) {
          if (current && typeof current === 'object' && seg in current) {
            current = current[seg];
          } else {
            broken.push({ token: path, ref: v });
            current = null;
            break;
          }
        }
      }
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      broken.push(...findBrokenRefs(val, root, path));
    }
  }
  return broken;
}

// ── Validation ──
console.log('\n=== Token Package Validation (W3C DTCG) ===\n');

const packages = ['tokens-foundation', 'tokens-brand', 'tokens-creator', 'tokens-atmosphere'];
for (const pkg of packages) {
  const tokensDir = join(PACKAGES_DIR, pkg, 'tokens');
  if (!existsSync(tokensDir)) {
    console.log(`  Package ${pkg} tokens directory not found — skipping`);
    warnings++;
    continue;
  }

  const tokens = loadJsonFilesRecursive(tokensDir);
  const values = extractDTCGValues(tokens);
  console.log(`  ${pkg}: ${values.length} tokens loaded`);

  // Check for empty values
  for (const { path: tokenPath, value } of values) {
    if (value === '' || value === null || value === undefined) {
      console.log(`  ERROR ${tokenPath} has empty $value`);
      errors++;
    }
  }
}

// Check: Foundation primitives cover required categories
console.log('\n--- Foundation Primitives ---');
const primitivesDir = join(PACKAGES_DIR, 'tokens-foundation', 'tokens', 'primitives');
const requiredPrimitives = ['colors', 'spacing', 'radii', 'shadows', 'typography', 'z-index', 'breakpoints'];

for (const cat of requiredPrimitives) {
  const file = join(primitivesDir, `${cat}.json`);
  if (!existsSync(file)) {
    console.log(`  ERROR Foundation missing required primitive file: ${cat}.json`);
    errors++;
  } else {
    console.log(`  ${cat}.json exists`);
  }
}

// Check: Semantic files exist
const semanticDir = join(PACKAGES_DIR, 'tokens-foundation', 'tokens', 'semantic');
for (const theme of ['colors-light.json', 'colors-dark.json']) {
  if (!existsSync(join(semanticDir, theme))) {
    console.log(`  ERROR Foundation missing semantic file: ${theme}`);
    errors++;
  } else {
    console.log(`  semantic/${theme} exists`);
  }
}

// Check: Product theme files reference valid foundation tokens
console.log('\n--- Reference Integrity ---');
const foundationTokens = loadJsonFilesRecursive(join(PACKAGES_DIR, 'tokens-foundation', 'tokens'));

for (const pkg of ['tokens-brand', 'tokens-atmosphere', 'tokens-creator']) {
  const tokensDir = join(PACKAGES_DIR, pkg, 'tokens');
  if (!existsSync(tokensDir)) continue;

  const productTokens = loadJsonFilesRecursive(tokensDir);
  // Merge foundation + product to create full resolution context
  const combined = {};
  deepMerge(combined, foundationTokens);
  deepMerge(combined, productTokens);

  const broken = findBrokenRefs(productTokens, combined);
  if (broken.length > 0) {
    for (const { token, ref } of broken) {
      console.log(`  ERROR ${pkg}: ${token} has broken reference ${ref}`);
      errors++;
    }
  } else {
    console.log(`  ${pkg}: all references resolve`);
  }
}

// Summary
console.log(`\n=== Summary ===`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors > 0) {
  console.log('\nValidation failed');
  process.exit(1);
} else {
  console.log('\nAll checks passed');
}
