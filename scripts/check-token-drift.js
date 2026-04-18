#!/usr/bin/env node

// Token Drift Checker -- Phase 6 of Design System Unification
//
// Scans source files for hardcoded hex colors and reports any that are not
// in the design system token allowlist. Designed to run in CI on PRs.
//
// Usage:
//   node check-token-drift.js --scan <glob> --exclude <dir> --tokens <path>
//       [--baseline <file>] [--generate-baseline]
//
// Arguments:
//   --scan <glob>          Glob pattern for files to scan (repeat for multiple)
//   --exclude <dir>        Directory prefix to exclude (repeat for multiple)
//   --tokens <path>        Path to amplify-design-system root
//   --baseline <file>      Path to baseline JSON (grandfathered violations)
//   --generate-baseline    Generate baseline from current state and exit
//
// Modes:
//   Default:             Compare found hex colors against tokens + baseline. Exit 1 if new violations.
//   --generate-baseline: Output a baseline JSON of all currently-used hex colors.
//
// Zero dependencies -- uses only Node.js built-ins (fs, path).

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const scanPatterns = [];
const excludePatterns = [];
let tokensDir = null;
let baselinePath = null;
let generateBaseline = false;

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--scan':
      scanPatterns.push(args[++i]);
      break;
    case '--exclude':
      excludePatterns.push(args[++i]);
      break;
    case '--tokens':
      tokensDir = args[++i];
      break;
    case '--baseline':
      baselinePath = args[++i];
      break;
    case '--generate-baseline':
      generateBaseline = true;
      break;
    default:
      console.error(`Unknown argument: ${args[i]}`);
      process.exit(2);
  }
}

if (scanPatterns.length === 0) {
  console.error('Error: at least one --scan pattern is required');
  process.exit(2);
}

// ---------------------------------------------------------------------------
// File matching (simple, zero-dep)
// ---------------------------------------------------------------------------

// Parse a glob pattern like "src/**/*.scss" into { prefix, extensions }
// Supports: dir/**/*.ext and dir/**/*.{ext1,ext2}
function parsePattern(pattern) {
  const normalized = pattern.replace(/\\/g, '/');

  // Extract the directory prefix (everything before the first *)
  const firstStar = normalized.indexOf('*');
  const prefix = firstStar >= 0 ? normalized.substring(0, firstStar) : normalized;

  // Extract extensions from the tail (e.g., "*.scss" or "*.{ts,tsx}")
  const extensions = [];
  const extMatch = normalized.match(/\*\.(\{[^}]+\}|\w+)$/);
  if (extMatch) {
    const extPart = extMatch[1];
    if (extPart.startsWith('{') && extPart.endsWith('}')) {
      extensions.push(...extPart.slice(1, -1).split(',').map(e => '.' + e.trim()));
    } else {
      extensions.push('.' + extPart);
    }
  }

  return { prefix: prefix.replace(/\/$/, ''), extensions };
}

function matchesPattern(relPath, pattern) {
  const { prefix, extensions } = parsePattern(pattern);

  // File must be under the prefix directory
  if (prefix && !relPath.startsWith(prefix)) return false;

  // File must match one of the extensions
  if (extensions.length > 0) {
    return extensions.some(ext => relPath.endsWith(ext));
  }

  return true;
}

function walkDir(dir, baseDir) {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      // Skip excluded directories early
      const dirRel = relPath + '/';
      if (excludePatterns.some(function(ex) {
        return dirRel.startsWith(ex) || dirRel.startsWith('./' + ex) || ('/' + dirRel).includes('/' + ex);
      })) {
        continue;
      }
      results.push.apply(results, walkDir(fullPath, baseDir));
    } else if (entry.isFile()) {
      results.push({ fullPath: fullPath, relPath: relPath });
    }
  }
  return results;
}

function findFiles(baseDir) {
  const allFiles = walkDir(baseDir, baseDir);
  return allFiles.filter(function(item) {
    var relPath = item.relPath;
    // Check exclusions
    for (var j = 0; j < excludePatterns.length; j++) {
      var ex = excludePatterns[j];
      if (relPath.startsWith(ex) || relPath.startsWith('./' + ex) || ('/' + relPath + '/').includes('/' + ex)) return false;
    }
    // Check at least one scan pattern matches
    return scanPatterns.some(function(pat) { return matchesPattern(relPath, pat); });
  });
}

// ---------------------------------------------------------------------------
// Token extraction — pull all hex colors from design system token JSON files
// ---------------------------------------------------------------------------

function extractHexFromValue(value) {
  if (typeof value !== 'string') return [];
  const matches = value.match(/#[0-9a-fA-F]{3,8}/g) || [];
  return matches.map(c => c.toLowerCase());
}

function extractAllTokenColors(obj) {
  const colors = new Set();
  if (!obj || typeof obj !== 'object') return colors;

  if ('value' in obj && typeof obj.value === 'string') {
    for (const hex of extractHexFromValue(obj.value)) {
      colors.add(hex);
    }
    return colors;
  }

  for (const val of Object.values(obj)) {
    if (val && typeof val === 'object') {
      for (const c of extractAllTokenColors(val)) {
        colors.add(c);
      }
    }
  }
  return colors;
}

function loadTokenColors(designSystemRoot) {
  const colors = new Set();
  const packagesDir = path.join(designSystemRoot, 'packages');
  const packages = ['tokens-foundation', 'tokens-brand', 'tokens-creator', 'tokens-atmosphere'];

  for (const pkg of packages) {
    const tokDir = path.join(packagesDir, pkg, 'tokens');
    if (!fs.existsSync(tokDir)) continue;
    for (const file of fs.readdirSync(tokDir).filter(f => f.endsWith('.json'))) {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(tokDir, file), 'utf8'));
        for (const c of extractAllTokenColors(content)) {
          colors.add(c);
        }
      } catch {
        // skip malformed JSON
      }
    }
  }

  // Also add universal safe colors
  const universals = [
    '#000', '#000000', '#fff', '#ffffff', '#fff0', '#0000', '#00000000',
    '#transparent', '#333', '#333333', '#666', '#666666', '#999', '#999999',
    '#ccc', '#cccccc', '#eee', '#eeeeee', '#ddd', '#dddddd',
  ];
  for (const c of universals) colors.add(c.toLowerCase());

  return colors;
}

// ---------------------------------------------------------------------------
// Source scanning — find hex colors in files
// ---------------------------------------------------------------------------

const HEX_REGEX = /#[0-9a-fA-F]{3,8}\b/g;

// Lines to skip: comments, SVG data URIs, image imports, sourcemap refs
function shouldSkipLine(line) {
  const trimmed = line.trim();
  if (trimmed.startsWith('//')) return true;
  if (trimmed.startsWith('*')) return true;  // block comment body
  if (trimmed.startsWith('/*') && trimmed.endsWith('*/')) return true;
  if (trimmed.includes('sourceMappingURL')) return true;
  if (trimmed.includes('data:image')) return true;
  return false;
}

function scanFile(filePath) {
  const findings = [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (shouldSkipLine(line)) continue;

    let match;
    HEX_REGEX.lastIndex = 0;
    while ((match = HEX_REGEX.exec(line)) !== null) {
      const hex = match[0].toLowerCase();
      // Skip 3-char or less if they look like IDs or anchors (context heuristic)
      // Keep actual 3-digit and 6/8-digit hex colors
      const hexDigits = hex.slice(1);
      if (hexDigits.length !== 3 && hexDigits.length !== 4 &&
          hexDigits.length !== 6 && hexDigits.length !== 8) {
        continue;
      }
      findings.push({
        file: filePath,
        line: i + 1,
        column: match.index + 1,
        color: hex,
        context: line.trim().substring(0, 120),
      });
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const cwd = process.cwd();

// 1. Find files to scan
const files = findFiles(cwd);
if (files.length === 0) {
  console.log('No files matched the scan patterns.');
  process.exit(0);
}

// 2. Scan all files
const allFindings = [];
for (const { fullPath, relPath } of files) {
  const findings = scanFile(fullPath);
  for (const f of findings) {
    f.file = relPath;  // Use relative path for readability
  }
  allFindings.push(...findings);
}

// 3. Load token allowlist
let tokenColors = new Set();
if (tokensDir) {
  tokenColors = loadTokenColors(tokensDir);
}

// 4. Load baseline (grandfathered violations)
let baseline = {};
if (baselinePath && fs.existsSync(baselinePath) && !generateBaseline) {
  try {
    baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  } catch {
    console.error(`Warning: could not parse baseline at ${baselinePath}`);
  }
}

// 5. Classify findings
const newViolations = [];
const existingViolations = [];
const tokenMatches = [];

for (const finding of allFindings) {
  if (tokenColors.has(finding.color)) {
    tokenMatches.push(finding);
    continue;
  }

  const key = `${finding.file}:${finding.color}`;
  const fileKey = finding.file;

  // Check if this specific file+color combo is in baseline
  if (baseline[fileKey] && baseline[fileKey].includes(finding.color)) {
    existingViolations.push(finding);
  } else {
    newViolations.push(finding);
  }
}

// ---------------------------------------------------------------------------
// Generate baseline mode
// ---------------------------------------------------------------------------

if (generateBaseline) {
  const baselineData = {};
  for (const finding of allFindings) {
    if (tokenColors.has(finding.color)) continue;  // Skip token-valid colors
    if (!baselineData[finding.file]) {
      baselineData[finding.file] = [];
    }
    if (!baselineData[finding.file].includes(finding.color)) {
      baselineData[finding.file].push(finding.color);
    }
  }

  // Sort for stable output
  const sorted = {};
  for (const key of Object.keys(baselineData).sort()) {
    sorted[key] = baselineData[key].sort();
  }

  const outputPath = baselinePath || path.join(cwd, 'token-drift-baseline.json');
  fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2) + '\n');
  const totalColors = Object.values(sorted).reduce((sum, arr) => sum + arr.length, 0);
  const totalFiles = Object.keys(sorted).length;
  console.log(`Baseline generated: ${outputPath}`);
  console.log(`  ${totalFiles} files with ${totalColors} grandfathered hex colors`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log('\n=== Token Drift Check ===\n');
console.log(`Files scanned: ${files.length}`);
console.log(`Total hex colors found: ${allFindings.length}`);
console.log(`Token-valid: ${tokenMatches.length}`);
console.log(`Grandfathered (baseline): ${existingViolations.length}`);
console.log(`New violations: ${newViolations.length}`);

// Existing violations — warnings
if (existingViolations.length > 0) {
  console.log(`\n--- Grandfathered violations (${existingViolations.length}) ---`);
  const byFile = {};
  for (const v of existingViolations) {
    if (!byFile[v.file]) byFile[v.file] = [];
    byFile[v.file].push(v);
  }
  for (const [file, violations] of Object.entries(byFile)) {
    const uniqueColors = [...new Set(violations.map(v => v.color))];
    console.log(`::warning file=${file}::${uniqueColors.length} grandfathered hex colors: ${uniqueColors.join(', ')}`);
  }
}

// New violations — errors
if (newViolations.length > 0) {
  console.log(`\n--- NEW violations (${newViolations.length}) ---`);
  for (const v of newViolations) {
    console.log(`::error file=${v.file},line=${v.line},col=${v.column}::Hardcoded hex color ${v.color} — use a design token instead. Context: ${v.context}`);
  }
  console.log(`\n[FAIL] ${newViolations.length} new hardcoded hex color(s) found. Use design system tokens instead.`);
  process.exit(1);
} else {
  console.log('\n[PASS] No new hardcoded hex colors introduced.');
  process.exit(0);
}
