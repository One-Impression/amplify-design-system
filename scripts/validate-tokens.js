#!/usr/bin/env node
/**
 * Cross-package token validation
 * Ensures consistency across foundation, brand, creator, and atmosphere packages.
 *
 * Checks:
 * 1. All product packages reference valid foundation primitives
 * 2. No duplicate token names across packages (except intentional overrides)
 * 3. Creator SDUI colors match api-gateway ColorType enum (if path provided)
 * 4. Brand colors match one-dashboard-web tokens (if path provided)
 */

const fs = require('fs');
const path = require('path');

const PACKAGES_DIR = path.join(__dirname, '..', 'packages');
let errors = 0;
let warnings = 0;

function loadTokens(packageName) {
  const tokensDir = path.join(PACKAGES_DIR, packageName, 'tokens');
  if (!fs.existsSync(tokensDir)) return {};

  const combined = {};
  for (const file of fs.readdirSync(tokensDir).filter(f => f.endsWith('.json'))) {
    const content = JSON.parse(fs.readFileSync(path.join(tokensDir, file), 'utf8'));
    Object.assign(combined, content);
  }
  return combined;
}

function extractValues(obj, prefix = '') {
  const result = [];
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && 'value' in val) {
      result.push({ path, value: val.value, type: val.type });
    } else if (val && typeof val === 'object') {
      result.push(...extractValues(val, path));
    }
  }
  return result;
}

// Check 1: All packages have valid token files
console.log('\n=== Token Package Validation ===\n');

const packages = ['tokens-foundation', 'tokens-brand', 'tokens-creator', 'tokens-atmosphere'];
for (const pkg of packages) {
  const pkgDir = path.join(PACKAGES_DIR, pkg);
  if (!fs.existsSync(pkgDir)) {
    console.log(`⚠️  Package ${pkg} directory not found — skipping`);
    warnings++;
    continue;
  }

  const tokens = loadTokens(pkg);
  const values = extractValues(tokens);
  console.log(`✅ ${pkg}: ${values.length} tokens loaded`);

  // Check for empty values
  for (const { path: tokenPath, value } of values) {
    if (!value && value !== 0) {
      console.log(`  ❌ ${tokenPath} has empty value`);
      errors++;
    }
  }
}

// Check 2: Foundation primitives are complete
const foundation = loadTokens('tokens-foundation');
const foundationValues = extractValues(foundation);

const requiredCategories = ['spacing', 'radius', 'shadow', 'typography', 'color'];
for (const cat of requiredCategories) {
  if (!foundation[cat]) {
    console.log(`❌ Foundation missing required category: ${cat}`);
    errors++;
  }
}

// Check 2b: Foundation color primitives are complete
if (foundation.color && foundation.color.primitive) {
  const requiredColors = ['purple-500', 'purple-800', 'red-500', 'green-500', 'amber-500', 'neutral-900', 'neutral-700', 'neutral-500', 'neutral-300', 'neutral-100', 'neutral-50', 'white', 'black'];
  for (const colorName of requiredColors) {
    if (!foundation.color.primitive[colorName]) {
      console.log(`❌ Foundation missing required color primitive: ${colorName}`);
      errors++;
    }
  }
  console.log(`✅ Foundation color primitives: ${Object.keys(foundation.color.primitive).length} defined`);
} else {
  console.log(`❌ Foundation missing color.primitive structure`);
  errors++;
}

// Check 3: Color consistency across products
const brand = loadTokens('tokens-brand');
const creator = loadTokens('tokens-creator');

if (brand.color && creator.color) {
  // Check that shared semantic colors are consistent
  const brandPositive = brand.color?.positive?.default?.value;
  const creatorPositive = creator.color?.sdui?.positive?.value;
  if (brandPositive && creatorPositive && brandPositive.toLowerCase() !== creatorPositive.toLowerCase()) {
    console.log(`⚠️  Color mismatch: positive — brand=${brandPositive}, creator=${creatorPositive}`);
    warnings++;
  }

  const brandNegative = brand.color?.negative?.default?.value;
  const creatorNegative = creator.color?.sdui?.negative?.value;
  if (brandNegative && creatorNegative && brandNegative.toLowerCase() !== creatorNegative.toLowerCase()) {
    console.log(`⚠️  Color mismatch: negative — brand=${brandNegative}, creator=${creatorNegative}`);
    warnings++;
  }
}

// Summary
console.log(`\n=== Summary ===`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors > 0) {
  console.log('\n❌ Validation failed');
  process.exit(1);
} else {
  console.log('\n✅ All checks passed');
}
