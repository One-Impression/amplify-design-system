#!/usr/bin/env tsx
/**
 * build-icons.ts — Icon manifest pipeline for @one-impression/tokens-creator.
 *
 * Reads SVG files from icons/, sanitises them, and emits:
 *   - dist/icons/manifest.json   — full icon catalog
 *   - dist/icons/essentials.json — bootstrap subset (~10 icons)
 *   - dist/icons/version.txt     — manifest version
 *   - dist/icons/manifest.d.ts   — TypeScript IconName literal-union type
 *
 * Usage: npx tsx packages/tokens-creator/scripts/build-icons.ts
 *   or:  npm run build:icons -w packages/tokens-creator
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '..');
const ICONS_DIR = join(PACKAGE_ROOT, 'icons');
const DIST_DIR = join(PACKAGE_ROOT, 'dist', 'icons');

const MANIFEST_VERSION = '1.0.0';

/**
 * Essential icons — the ~10 most commonly used icons that should be bundled
 * into the bootstrap payload. The creator app loads these before the full
 * manifest to avoid layout shift on first render.
 *
 * Names must match SVG filenames (without .svg extension).
 */
const ESSENTIAL_ICON_NAMES = [
  'arrow-left',
  'arrow-right',
  'check',
  'check-circle',
  'chevron-down',
  'chevron-right',
  'close',
  'home',
  'menu',
  'search',
];

// ── SVG Sanitisation ──────────────────────────────────────────────────────

/**
 * Sanitise an SVG string for consistent rendering across platforms:
 * - Strip XML declarations and DOCTYPE
 * - Normalise whitespace (collapse multi-line to single-line content)
 * - Remove comments
 * - Ensure viewBox is present (don't strip it — RN needs it for scaling)
 * - Remove width/height attributes from root <svg> (let container control size)
 * - Strip any embedded <script> tags (security)
 */
function sanitiseSvg(raw: string): string {
  let svg = raw;

  // Strip XML declaration
  svg = svg.replace(/<\?xml[^?]*\?>\s*/gi, '');

  // Strip DOCTYPE
  svg = svg.replace(/<!DOCTYPE[^>]*>\s*/gi, '');

  // Strip HTML/XML comments
  svg = svg.replace(/<!--[\s\S]*?-->/g, '');

  // Strip <script> tags entirely (security)
  svg = svg.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Remove width and height from root <svg> tag (keep viewBox)
  svg = svg.replace(
    /(<svg\s[^>]*?)(\s(?:width|height)=["'][^"']*["'])/gi,
    '$1',
  );
  // Run twice in case both width and height are present
  svg = svg.replace(
    /(<svg\s[^>]*?)(\s(?:width|height)=["'][^"']*["'])/gi,
    '$1',
  );

  // Collapse whitespace — normalise runs of spaces/newlines to single space
  svg = svg.replace(/\s+/g, ' ').trim();

  return svg;
}

// ── Main Pipeline ─────────────────────────────────────────────────────────

function main() {
  // Ensure output directory exists
  mkdirSync(DIST_DIR, { recursive: true });

  // Read all .svg files from icons/
  if (!existsSync(ICONS_DIR)) {
    console.warn(`Warning: icons directory not found at ${ICONS_DIR}`);
    console.warn('Creating empty manifest. Populate icons/ and rebuild.');
    writeEmptyManifest();
    return;
  }

  const svgFiles = readdirSync(ICONS_DIR)
    .filter((f) => f.endsWith('.svg'))
    .sort();

  if (svgFiles.length === 0) {
    console.warn('Warning: No SVG files found in icons/. Creating empty manifest.');
    console.warn('See icons/README.md for instructions on populating the directory.');
    writeEmptyManifest();
    return;
  }

  console.log(`Found ${svgFiles.length} SVG files in icons/`);

  // Build full icon map
  const icons: Record<string, string> = {};
  for (const file of svgFiles) {
    const name = basename(file, '.svg');
    const raw = readFileSync(join(ICONS_DIR, file), 'utf-8');
    icons[name] = sanitiseSvg(raw);
  }

  const iconNames = Object.keys(icons);

  // ── manifest.json ──
  const manifest = {
    version: MANIFEST_VERSION,
    count: iconNames.length,
    icons,
  };
  writeFileSync(
    join(DIST_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );
  console.log(`  manifest.json: ${iconNames.length} icons`);

  // ── essentials.json ──
  const essentialIcons: Record<string, string> = {};
  const foundEssentials: string[] = [];
  const missingEssentials: string[] = [];

  for (const name of ESSENTIAL_ICON_NAMES) {
    if (icons[name]) {
      essentialIcons[name] = icons[name];
      foundEssentials.push(name);
    } else {
      missingEssentials.push(name);
    }
  }

  const essentials = {
    version: MANIFEST_VERSION,
    count: foundEssentials.length,
    icons: essentialIcons,
  };
  writeFileSync(
    join(DIST_DIR, 'essentials.json'),
    JSON.stringify(essentials, null, 2) + '\n',
  );
  console.log(`  essentials.json: ${foundEssentials.length}/${ESSENTIAL_ICON_NAMES.length} essential icons`);

  if (missingEssentials.length > 0) {
    console.warn(`  Warning: ${missingEssentials.length} essential icons not found: ${missingEssentials.join(', ')}`);
  }

  // ── version.txt ──
  writeFileSync(join(DIST_DIR, 'version.txt'), MANIFEST_VERSION + '\n');
  console.log(`  version.txt: ${MANIFEST_VERSION}`);

  // ── manifest.d.ts ──
  writeTypeDefinition(iconNames);
  console.log(`  manifest.d.ts: IconName union of ${iconNames.length} literals`);

  console.log(`\n@one-impression/tokens-creator: icon manifest built (${iconNames.length} icons, v${MANIFEST_VERSION})`);
}

/**
 * Write an empty manifest when no SVGs are present.
 * This allows the build to succeed and consumers to import the types
 * even before icons are populated.
 */
function writeEmptyManifest() {
  const emptyManifest = {
    version: MANIFEST_VERSION,
    count: 0,
    icons: {},
  };
  writeFileSync(
    join(DIST_DIR, 'manifest.json'),
    JSON.stringify(emptyManifest, null, 2) + '\n',
  );

  const emptyEssentials = {
    version: MANIFEST_VERSION,
    count: 0,
    icons: {},
  };
  writeFileSync(
    join(DIST_DIR, 'essentials.json'),
    JSON.stringify(emptyEssentials, null, 2) + '\n',
  );

  writeFileSync(join(DIST_DIR, 'version.txt'), MANIFEST_VERSION + '\n');

  // Empty type — `never` means no valid icon names yet
  const dts = [
    '/** Auto-generated by build-icons.ts — do not edit */',
    '',
    '/** No icons found. Populate icons/ directory and rebuild. */',
    'export type IconName = never;',
    '',
  ].join('\n');
  writeFileSync(join(DIST_DIR, 'manifest.d.ts'), dts);

  console.log('Empty manifest written to dist/icons/');
}

/**
 * Generate a TypeScript definition file with a literal-union IconName type.
 */
function writeTypeDefinition(iconNames: string[]) {
  const lines: string[] = [
    '/** Auto-generated by build-icons.ts — do not edit */',
    '',
  ];

  if (iconNames.length === 0) {
    lines.push('/** No icons found. Populate icons/ directory and rebuild. */');
    lines.push('export type IconName = never;');
  } else {
    lines.push('/**');
    lines.push(` * Union of all ${iconNames.length} icon names in the manifest.`);
    lines.push(' * Used for type-safe icon references in the creator app.');
    lines.push(' */');
    lines.push('export type IconName =');

    for (let i = 0; i < iconNames.length; i++) {
      const separator = i === iconNames.length - 1 ? ';' : '';
      lines.push(`  | "${iconNames[i]}"${separator}`);
    }
  }

  lines.push('');
  writeFileSync(join(DIST_DIR, 'manifest.d.ts'), lines.join('\n'));
}

// ── Run ──
main();
