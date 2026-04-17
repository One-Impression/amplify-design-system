/**
 * @amplify/tokens-brand — Style Dictionary v4 build script
 *
 * Generates:
 *   dist/variables.css   — CSS custom properties (--amplify-brand-*)
 *   dist/variables.scss  — SCSS variables ($amplify-brand-*)
 *   dist/tokens.json     — flat JSON export
 *   dist/tokens.js       — ES module export
 *   dist/tailwind-preset.js — Tailwind CSS preset
 */

const StyleDictionary = require('style-dictionary');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// 1. Load raw token files (foundation first, then product overrides)
// ---------------------------------------------------------------------------
const foundation = require('../tokens-foundation/tokens/colors.json');
const colors = require('./tokens/colors.json');
const typography = require('./tokens/typography.json');

// ---------------------------------------------------------------------------
// 1b. Resolve foundation references in brand tokens
//     Brand tokens may contain {color.primitive.*} or {color.semantic.*}
//     references that point to foundation values.
// ---------------------------------------------------------------------------
function resolveRef(ref, sources) {
  const match = ref.match(/^\{(.+)\}$/);
  if (!match) return ref;
  const path = match[1].split('.');
  let current = null;
  for (const src of sources) {
    current = src;
    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = null;
        break;
      }
    }
    if (current !== null) break;
  }
  if (current && typeof current === 'object' && 'value' in current) {
    return resolveRef(current.value, sources);
  }
  return current || ref;
}

function resolveTokenTree(obj, sources) {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object' && 'value' in val) {
      result[key] = { ...val, value: resolveRef(val.value, sources) };
    } else if (val && typeof val === 'object') {
      result[key] = resolveTokenTree(val, sources);
    } else {
      result[key] = val;
    }
  }
  return result;
}

const resolvedColors = resolveTokenTree(colors, [colors, foundation]);

// Merge into a single token tree
const allTokens = { ...resolvedColors, ...typography };

// ---------------------------------------------------------------------------
// 2. Helper — recursively walk the token tree and collect leaf values
// ---------------------------------------------------------------------------
function flattenTokens(obj, prefix = '') {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}-${key}` : key;
    if (val && typeof val === 'object' && 'value' in val) {
      result[path] = val.value;
    } else if (val && typeof val === 'object') {
      Object.assign(result, flattenTokens(val, path));
    }
  }
  return result;
}

const flat = flattenTokens(allTokens);

// ---------------------------------------------------------------------------
// 3. Generate dist/variables.css
// ---------------------------------------------------------------------------
function buildCSS() {
  const lines = [':root {'];
  for (const [key, value] of Object.entries(flat)) {
    lines.push(`  --amplify-brand-${key}: ${value};`);
  }
  lines.push('}', '');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 4. Generate dist/variables.scss
// ---------------------------------------------------------------------------
function buildSCSS() {
  const lines = [];
  for (const [key, value] of Object.entries(flat)) {
    lines.push(`$amplify-brand-${key}: ${value};`);
  }
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 5. Generate dist/tokens.json
// ---------------------------------------------------------------------------
function buildJSON() {
  return JSON.stringify(flat, null, 2) + '\n';
}

// ---------------------------------------------------------------------------
// 6. Generate dist/tokens.js
// ---------------------------------------------------------------------------
function buildJS() {
  const lines = ['/** Auto-generated — do not edit */', ''];
  for (const [key, value] of Object.entries(flat)) {
    const camel = key.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
    lines.push(`export const ${camel} = ${JSON.stringify(value)};`);
  }
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 7. Generate dist/tailwind-preset.js
// ---------------------------------------------------------------------------
function buildTailwindPreset() {
  // Read raw token values directly to build the Tailwind theme
  const c = colors.color;
  const t = typography.typography.size;

  const preset = `/** Auto-generated Tailwind CSS preset — do not edit */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '${c.brand.primary.value}',
          secondary: '${c.brand.secondary.value}',
          light: '${c.brand.light.value}',
          dark: '${c.brand.dark.value}',
        },
        positive: {
          DEFAULT: '${c.positive.default.value}',
          light: '${c.positive.light.value}',
        },
        negative: {
          DEFAULT: '${c.negative.default.value}',
          light: '${c.negative.light.value}',
        },
        warning: {
          DEFAULT: '${c.warning.default.value}',
          light: '${c.warning.light.value}',
        },
        neutral: {
          900: '${c.neutral['900'].value}',
          700: '${c.neutral['700'].value}',
          500: '${c.neutral['500'].value}',
          200: '${c.neutral['200'].value}',
          100: '${c.neutral['100'].value}',
        },
        surface: {
          DEFAULT: '${c.surface.default.value}',
          raised: '${c.surface.raised.value}',
          overlay: '${c.surface.overlay.value}',
        },
        border: {
          DEFAULT: '${c.border.default.value}',
          strong: '${c.border.strong.value}',
          brand: '${c.border.brand.value}',
        },
      },
      fontSize: {
        display: '${t.display.value}',
        'heading-lg': '${t['heading-lg'].value}',
        'heading-md': '${t['heading-md'].value}',
        'heading-sm': '${t['heading-sm'].value}',
        'body-lg': '${t['body-lg'].value}',
        'body-md': '${t['body-md'].value}',
        'body-sm': '${t['body-sm'].value}',
        mono: '${t.mono.value}',
      },
      backgroundImage: {
        'gradient-brand': '${c.gradient.brand.value}',
        'gradient-brand-soft': '${c.gradient['brand-soft'].value}',
      },
      boxShadow: {
        brand: '${c.shadow.brand.value}',
      },
    },
  },
};
`;
  return preset;
}

// ---------------------------------------------------------------------------
// 8. Write all outputs
// ---------------------------------------------------------------------------
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(path.join(distDir, 'variables.css'), buildCSS());
fs.writeFileSync(path.join(distDir, 'variables.scss'), buildSCSS());
fs.writeFileSync(path.join(distDir, 'tokens.json'), buildJSON());
fs.writeFileSync(path.join(distDir, 'tokens.js'), buildJS());
fs.writeFileSync(path.join(distDir, 'tailwind-preset.js'), buildTailwindPreset());

console.log('@amplify/tokens-brand — built 5 artifacts to dist/');
