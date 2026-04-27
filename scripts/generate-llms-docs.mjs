#!/usr/bin/env node
/**
 * Generate LLM-readable design system docs:
 *   - packages/ui/dist/llms.txt          (root index, llmstxt.org spec)
 *   - packages/ui/dist/llms/<Component>.md  (per-component rules + props)
 *   - packages/ui/dist/llms.json         (machine-readable mirror)
 *
 * Reads packages/ui/src/components/ at build time. Optional per-component
 * semantic overrides at packages/ui/src/components/<Name>/<Name>.llm.md
 * are merged in verbatim under the "Guidance" section.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const componentsDir = resolve(repoRoot, 'packages/ui/src/components');
const distDir = resolve(repoRoot, 'packages/ui/dist');
const docsDir = resolve(distDir, 'llms');

// Build-script logging: human-readable progress to stdout/stderr (low blast
// radius, runs once per build). The final summary line is structured JSON
// so log aggregators (CloudWatch, Datadog) can index doc-gen runs.
const log = (msg) => process.stdout.write(`[llms-docs] ${msg}\n`);
const warn = (msg) => process.stderr.write(`[llms-docs] ${msg}\n`);
const summary = (event, fields) =>
  process.stdout.write(JSON.stringify({ level: 'info', event, ...fields }) + '\n');

const TYPE_ALIAS_RE = /export\s+type\s+(\w+)\s*=\s*([^;]+);/g;
const INTERFACE_HEADER_RE = /export\s+interface\s+(\w+Props)(?:<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{/g;
const PROP_LINE_RE = /^\s*(\w+)(\??):\s*([^;]+);?\s*$/;
const FORWARD_REF_RE = /React\.forwardRef\s*</;
const SUBCOMPONENT_RE = /export\s+(?:const|function)\s+(\w+(?:Header|Title|Description|Content|Footer|Body|Item|Trigger|Group))/g;
const DEFAULT_VALUE_RE = /(\w+)\s*=\s*([^,\n}]+?)(?:[,\n}])/g;

/**
 * Extract the interface body using brace-depth counting so nested types
 * (e.g. `defaultValue?: { label: string; value: string }`) don't truncate
 * the match early. Returns null if no Props interface is found or braces
 * are unbalanced.
 */
const extractInterfaceBody = (source) => {
  INTERFACE_HEADER_RE.lastIndex = 0;
  const headerMatch = INTERFACE_HEADER_RE.exec(source);
  if (!headerMatch) return null;
  const start = headerMatch.index + headerMatch[0].length;
  let depth = 1;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return source.slice(start, i);
    }
  }
  return null;
};

/**
 * Split an interface body into prop declarations, respecting brace depth so
 * a multi-line nested object type stays on one logical "line".
 */
const splitPropDeclarations = (body) => {
  const out = [];
  let buf = '';
  let depth = 0;
  for (const ch of body) {
    if (ch === '{' || ch === '<' || ch === '(') depth++;
    else if (ch === '}' || ch === '>' || ch === ')') depth = Math.max(0, depth - 1);
    if ((ch === ';' || ch === '\n') && depth === 0) {
      const trimmed = buf.trim();
      if (trimmed) out.push(trimmed);
      buf = '';
      continue;
    }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
};

const extractEnum = (typeBody) => {
  const stripped = typeBody.trim();
  if (!stripped.includes('|')) return null;
  const values = stripped.split('|').map((v) => v.trim().replace(/^['"]|['"]$/g, ''));
  if (values.every((v) => /^[\w-]+$/.test(v))) return values;
  return null;
};

const extractFromSource = (filePath, name) => {
  const source = readFileSync(filePath, 'utf8');
  const aliases = new Map();
  TYPE_ALIAS_RE.lastIndex = 0;
  let m;
  while ((m = TYPE_ALIAS_RE.exec(source)) !== null) {
    const enumValues = extractEnum(m[2]);
    if (enumValues) aliases.set(m[1], enumValues);
  }
  const variants = aliases.get(`${name}Variant`) ?? null;
  const sizes = aliases.get(`${name}Size`) ?? null;
  const props = [];
  const body = extractInterfaceBody(source);
  if (body) {
    for (const decl of splitPropDeclarations(body)) {
      // Match: `name?: type` (type may span multiple lines, no semicolon since splitter strips it)
      const propMatch = /^(\w+)(\??):\s*([\s\S]+)$/.exec(decl);
      if (!propMatch) continue;
      const [, propName, optional, type] = propMatch;
      const cleanType = type.trim();
      props.push({
        name: propName,
        type: cleanType,
        optional: optional === '?',
        enumValues: aliases.get(cleanType) ?? extractEnum(cleanType),
      });
    }
  }
  const defaultsBlockMatch = source.match(/\(\s*\{([^}]+?)\},\s*ref\s*\)/s);
  if (defaultsBlockMatch) {
    DEFAULT_VALUE_RE.lastIndex = 0;
    let dv;
    while ((dv = DEFAULT_VALUE_RE.exec(defaultsBlockMatch[1])) !== null) {
      const prop = props.find((p) => p.name === dv[1]);
      if (prop) prop.defaultValue = dv[2].trim().replace(/^['"]|['"]$/g, '');
    }
  }
  const subcomponents = [];
  SUBCOMPONENT_RE.lastIndex = 0;
  let sub;
  while ((sub = SUBCOMPONENT_RE.exec(source)) !== null) {
    if (sub[1] !== name) subcomponents.push(sub[1]);
  }
  return {
    name,
    variants,
    sizes,
    props,
    hasForwardRef: FORWARD_REF_RE.test(source),
    subcomponents,
    declaresPropsInterface: /export\s+interface\s+\w+Props\b/.test(source),
  };
};

const findComponentFile = (dir, name) => {
  for (const candidate of [`${name}.tsx`, 'index.tsx', `${name}.ts`, 'index.ts']) {
    const full = join(dir, candidate);
    if (existsSync(full)) return full;
  }
  return null;
};

const renderProps = (props) => {
  if (props.length === 0) return '_(no props beyond standard HTML attributes)_';
  const lines = ['| Name | Type | Required | Default | Allowed values |', '|------|------|----------|---------|----------------|'];
  for (const p of props) {
    const allowed = p.enumValues ? p.enumValues.map((v) => `\`${v}\``).join(', ') : '—';
    const def = p.defaultValue ? `\`${p.defaultValue}\`` : '—';
    lines.push(`| \`${p.name}\` | \`${p.type}\` | ${p.optional ? 'no' : 'yes'} | ${def} | ${allowed} |`);
  }
  return lines.join('\n');
};

const renderExample = (c) => {
  const variantAttr = c.variants ? ` variant="${c.variants[0]}"` : '';
  const sizeAttr = c.sizes ? ` size="${c.sizes[c.sizes.length === 3 ? 1 : 0]}"` : '';
  const inner = c.subcomponents.length ? `\n  <${c.subcomponents[0]}>...</${c.subcomponents[0]}>\n` : 'children';
  return `\`\`\`tsx\nimport { ${c.name} } from '@amplify/ui';\n\n<${c.name}${variantAttr}${sizeAttr}>${inner}</${c.name}>\n\`\`\``;
};

const renderComponentDoc = (c, override) => {
  const sections = [];
  sections.push(`# ${c.name}`);
  sections.push(`> Auto-extracted from \`packages/ui/src/components/${c.name}/\`. Do not edit by hand — regenerated on every build.`);

  if (c.variants) sections.push(`## Variants\n\n${c.variants.map((v) => `- \`${v}\``).join('\n')}`);
  if (c.sizes) sections.push(`## Sizes\n\n${c.sizes.map((s) => `- \`${s}\``).join('\n')}`);

  sections.push(`## Props\n\n${renderProps(c.props)}`);

  if (c.subcomponents.length > 0) {
    sections.push(`## Subcomponents\n\n${c.subcomponents.map((s) => `- \`${s}\``).join('\n')}`);
  }

  sections.push(`## Forward ref\n\n${c.hasForwardRef ? `Yes — accepts \`ref\` and forwards to the underlying element.` : `No.`}`);

  sections.push(`## Example\n\n${renderExample(c)}`);

  if (override) {
    sections.push(`## Guidance\n\n${override.trim()}`);
  }

  sections.push(`## Import\n\n\`\`\`ts\nimport { ${c.name} } from '@amplify/ui';\n\`\`\``);

  return sections.join('\n\n') + '\n';
};

const main = () => {
  // Soft no-op when run in a context without the UI components dir (e.g.
  // a partial build, storybook-only build). This script is hooked into
  // the @amplify/ui build but should never hard-fail the parent build —
  // dist/ artifacts must still be produced.
  if (!existsSync(componentsDir)) {
    warn(`components dir not found, skipping doc generation: ${componentsDir}`);
    return;
  }
  if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
  if (!existsSync(docsDir)) mkdirSync(docsDir, { recursive: true });

  const dirs = readdirSync(componentsDir).filter((d) => statSync(join(componentsDir, d)).isDirectory());
  const components = [];
  const failures = [];
  const suspicious = [];

  for (const dir of dirs) {
    const filePath = findComponentFile(join(componentsDir, dir), dir);
    if (!filePath) {
      failures.push({ name: dir, reason: 'no entry .tsx/.ts file found' });
      continue;
    }
    let extracted;
    try {
      extracted = extractFromSource(filePath, dir);
    } catch (err) {
      failures.push({ name: dir, reason: err instanceof Error ? err.message : String(err) });
      continue;
    }
    // Safety net: a Props interface that yields zero props is almost always
    // an extraction failure (regex truncation, unusual syntax, etc.) rather
    // than a genuine zero-prop component. Surface as a warning.
    if (extracted.declaresPropsInterface && extracted.props.length === 0) {
      suspicious.push(dir);
    }
    const overridePath = join(componentsDir, dir, `${dir}.llm.md`);
    const override = existsSync(overridePath) ? readFileSync(overridePath, 'utf8') : null;
    const md = renderComponentDoc(extracted, override);
    writeFileSync(join(docsDir, `${dir}.md`), md);
    components.push(extracted);
  }

  components.sort((a, b) => a.name.localeCompare(b.name));

  // llms.txt — root index following llmstxt.org spec
  const lines = [];
  lines.push('# Amplify Canvas Design System');
  lines.push('');
  lines.push('> Canvas is the unified design system for Amplify products (Brand, Creator, Atmosphere). It ships React components, design tokens, and templates as `@amplify/ui`, `@amplify/tokens-*`, and `@amplify/templates`.');
  lines.push('');
  lines.push('Each component below has a per-component rule sheet listing variants, props, defaults, and allowed values. Use these to compose UI without inventing components or hardcoding values.');
  lines.push('');
  lines.push('## Components');
  lines.push('');
  for (const c of components) {
    const summary = [
      c.variants ? `${c.variants.length} variants` : null,
      c.sizes ? `${c.sizes.length} sizes` : null,
      `${c.props.length} props`,
    ].filter(Boolean).join(', ');
    lines.push(`- [${c.name}](llms/${c.name}.md): ${summary}`);
  }
  lines.push('');
  lines.push('## Tokens');
  lines.push('');
  lines.push('- `@amplify/tokens-foundation`: primitives (color, spacing, typography, shadow, radius, motion)');
  lines.push('- `@amplify/tokens-brand`: Brand product theme');
  lines.push('- `@amplify/tokens-atmosphere`: Atmosphere product theme');
  lines.push('- `@amplify/tokens-creator`: Creator product theme');
  lines.push('');
  lines.push('## Programmatic access');
  lines.push('');
  lines.push('- MCP server: `@amplify/mcp-server` exposes the same data via stdio + HTTP transports.');
  lines.push('- JSON mirror: `dist/llms.json` for tools that prefer structured data.');

  writeFileSync(join(distDir, 'llms.txt'), lines.join('\n') + '\n');

  // llms.json — machine-readable mirror
  const json = {
    generatedAt: new Date().toISOString(),
    componentCount: components.length,
    components: components.map((c) => ({
      name: c.name,
      variants: c.variants,
      sizes: c.sizes,
      props: c.props,
      hasForwardRef: c.hasForwardRef,
      subcomponents: c.subcomponents,
    })),
  };
  writeFileSync(join(distDir, 'llms.json'), JSON.stringify(json, null, 2));

  log(`wrote ${components.length} component docs → ${docsDir}`);
  log(`wrote llms.txt → ${distDir}/llms.txt`);
  log(`wrote llms.json → ${distDir}/llms.json`);
  if (failures.length) {
    warn(`${failures.length} components skipped:`);
    for (const f of failures) warn(`  - ${f.name}: ${f.reason}`);
  }
  if (suspicious.length) {
    warn(`${suspicious.length} components declare a Props interface but yielded zero props (likely regex truncation): ${suspicious.join(', ')}`);
  }
  summary('llms_docs_generated', {
    componentCount: components.length,
    failureCount: failures.length,
    suspiciousCount: suspicious.length,
  });
};

// Never hard-fail the parent build — surface errors loudly but exit 0.
try {
  main();
} catch (err) {
  warn(`unexpected failure: ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
}
