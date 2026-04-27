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

const TYPE_ALIAS_RE = /export\s+type\s+(\w+)\s*=\s*([^;]+);/g;
const INTERFACE_RE = /export\s+interface\s+(\w+Props)(?:\s+extends\s+[^{]+)?\s*\{([^}]*)\}/s;
const PROP_LINE_RE = /^\s*(\w+)(\??):\s*([^;]+);?\s*$/;
const FORWARD_REF_RE = /React\.forwardRef\s*</;
const SUBCOMPONENT_RE = /export\s+(?:const|function)\s+(\w+(?:Header|Title|Description|Content|Footer|Body|Item|Trigger|Group))/g;
const DEFAULT_VALUE_RE = /(\w+)\s*=\s*([^,\n}]+?)(?:[,\n}])/g;

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
  const interfaceMatch = INTERFACE_RE.exec(source);
  if (interfaceMatch) {
    for (const line of interfaceMatch[2].split('\n')) {
      const propMatch = PROP_LINE_RE.exec(line);
      if (!propMatch) continue;
      const [, propName, optional, type] = propMatch;
      props.push({
        name: propName,
        type: type.trim(),
        optional: optional === '?',
        enumValues: aliases.get(type.trim()) ?? extractEnum(type),
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
  if (!existsSync(componentsDir)) {
    console.error(`[llms-docs] components dir not found: ${componentsDir}`);
    process.exit(1);
  }
  if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
  if (!existsSync(docsDir)) mkdirSync(docsDir, { recursive: true });

  const dirs = readdirSync(componentsDir).filter((d) => statSync(join(componentsDir, d)).isDirectory());
  const components = [];
  const failures = [];

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

  console.log(`[llms-docs] wrote ${components.length} component docs → ${docsDir}`);
  console.log(`[llms-docs] wrote llms.txt → ${distDir}/llms.txt`);
  console.log(`[llms-docs] wrote llms.json → ${distDir}/llms.json`);
  if (failures.length) {
    console.error(`[llms-docs] ${failures.length} components skipped:`);
    for (const f of failures) console.error(`  - ${f.name}: ${f.reason}`);
  }
};

main();
