#!/usr/bin/env node
/**
 * Validate all assets in this package.
 * - SVGs: must start with <?xml or <svg and contain valid root tag close
 * - HTML signatures: must contain inline style attributes and no <script> tags
 * - JSON manifest: must parse as JSON
 *
 * Exits non-zero if any asset fails. Intended for CI.
 *
 * Mirrors brand-oportunities/validate.js semantics.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, 'assets');

const errors = [];
let total = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      walk(p);
    } else {
      validateOne(p);
    }
  }
}

function validateOne(p) {
  total += 1;
  const rel = relative(__dirname, p);
  const ext = extname(p);
  const content = readFileSync(p, 'utf8');

  if (ext === '.svg' || ext === '.png') {
    // .png files in this package are SVG sources by spec — validate as SVG
    if (!content.includes('<svg')) {
      errors.push(`${rel}: missing <svg root element`);
    }
    if (!content.includes('</svg>')) {
      errors.push(`${rel}: missing </svg> close tag`);
    }
    if (!content.includes('viewBox=')) {
      errors.push(`${rel}: missing viewBox attribute (required for responsive scaling)`);
    }
  } else if (ext === '.html') {
    if (!content.includes('style="')) {
      errors.push(`${rel}: email signature must use inline style attributes`);
    }
    if (content.includes('<script')) {
      errors.push(`${rel}: <script> tags forbidden in email signatures`);
    }
  } else if (ext === '.webmanifest') {
    try {
      JSON.parse(content);
    } catch (e) {
      errors.push(`${rel}: invalid JSON — ${e.message}`);
    }
  }
}

walk(ROOT);

if (errors.length > 0) {
  console.error(`@one-impression/brand-hexcoded: ${errors.length} validation error(s) across ${total} assets:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`@one-impression/brand-hexcoded: all ${total} assets valid`);
