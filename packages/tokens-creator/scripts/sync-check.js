#!/usr/bin/env node
/**
 * sync-check.js — Verify tokens/colors.json stays in sync with api-gateway ColorType enum.
 *
 * Usage:
 *   node scripts/sync-check.js /path/to/api-gateway/src/apigateway/mobile_ui/ui_kit/properties/color_type.py
 *
 * The Python enum is expected to look like:
 *
 *   class ColorType(str, Enum):
 *       neutralStrong = "neutralStrong"    # #1D252D
 *       neutralMedium = "neutralMedium"    # #7C8085
 *       ...
 *
 * Exit code 0  — all tokens match
 * Exit code 1  — mismatches, missing, or extra tokens found
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// 1. Read and parse the Python enum
// ---------------------------------------------------------------------------

const enumPath = process.argv[2];
if (!enumPath) {
  console.error('Usage: node scripts/sync-check.js <path-to-color_type.py>');
  process.exit(1);
}

if (!fs.existsSync(enumPath)) {
  console.error(`File not found: ${enumPath}`);
  process.exit(1);
}

const enumSource = fs.readFileSync(enumPath, 'utf-8');

/**
 * Parse enum members.
 * Matches lines like:
 *   neutralStrong = "neutralStrong"    # #1D252D
 *   primary = "primary"               # #6531FF
 *
 * Returns Map<camelCaseName, hexOrNull>
 */
function parseColorEnum(src) {
  const members = new Map();
  // Match: <identifier> = "<value>"  optionally followed by # <hex>
  const re = /^\s+(\w+)\s*=\s*["'](\w+)["']\s*(?:#\s*(#[0-9A-Fa-f]{6,8}))?\s*$/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    const name = m[1];       // camelCase enum member name
    const hex = m[3] || null; // hex from comment, if present
    members.set(name, hex);
  }
  return members;
}

const enumMembers = parseColorEnum(enumSource);

if (enumMembers.size === 0) {
  console.error('Warning: parsed 0 enum members — check the enum format.');
  console.error('Expected: class ColorType(str, Enum) with members like  neutralStrong = "neutralStrong"');
  process.exit(1);
}

console.log(`Parsed ${enumMembers.size} enum members from ${path.basename(enumPath)}`);

// ---------------------------------------------------------------------------
// 2. Read tokens/colors.json
// ---------------------------------------------------------------------------

const tokensPath = path.join(__dirname, '..', 'tokens', 'colors.json');
const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));
const sduiTokens = tokensData.color?.sdui || {};

/** Convert kebab-case token key to camelCase (to match enum names) */
function toCamelCase(str) {
  return str.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase());
}

// Build map: camelCaseName -> hex value
const tokenMap = new Map();
for (const [key, def] of Object.entries(sduiTokens)) {
  tokenMap.set(toCamelCase(key), def.value?.toUpperCase());
}

console.log(`Found ${tokenMap.size} SDUI tokens in tokens/colors.json\n`);

// ---------------------------------------------------------------------------
// 3. Compare
// ---------------------------------------------------------------------------

let issues = 0;

// Check each enum member exists in tokens and hex matches
for (const [name, enumHex] of enumMembers) {
  if (!tokenMap.has(name)) {
    console.error(`MISSING TOKEN: enum has "${name}" but tokens/colors.json does not`);
    issues++;
    continue;
  }
  if (enumHex) {
    const tokenHex = tokenMap.get(name);
    const normalizedEnumHex = enumHex.toUpperCase();
    if (tokenHex !== normalizedEnumHex) {
      console.error(
        `HEX MISMATCH: "${name}" — enum says ${normalizedEnumHex}, token says ${tokenHex}`
      );
      issues++;
    }
  }
}

// Check for extra tokens not in the enum
for (const name of tokenMap.keys()) {
  if (!enumMembers.has(name)) {
    console.error(`EXTRA TOKEN: tokens/colors.json has "${name}" but enum does not`);
    issues++;
  }
}

// ---------------------------------------------------------------------------
// 4. Result
// ---------------------------------------------------------------------------

if (issues === 0) {
  console.log('All tokens are in sync with the ColorType enum.');
  process.exit(0);
} else {
  console.error(`\n${issues} issue(s) found — tokens are OUT OF SYNC.`);
  process.exit(1);
}
