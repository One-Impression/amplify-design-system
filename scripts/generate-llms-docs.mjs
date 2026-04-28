#!/usr/bin/env node
/**
 * Generate LLM-readable design system docs from the JSON contracts produced
 * by packages/ui/scripts/generate-contracts.mjs. Reads the contracts (single
 * source of truth) — no parallel regex extraction.
 *
 * Outputs (under packages/ui/dist/):
 *   - llms.txt          — root index, llmstxt.org spec
 *   - llms/<Name>.md    — per-component rules
 *   - llms.json         — flattened machine-readable mirror (legacy compat)
 *
 * Optional per-component semantic overrides at
 * packages/ui/src/components/<Name>/<Name>.llm.md get merged in verbatim
 * under a "Guidance" section.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const componentsDir = resolve(repoRoot, 'packages/ui/src/components');
const distDir = resolve(repoRoot, 'packages/ui/dist');
const contractsDir = resolve(distDir, 'contracts');
const manifestPath = resolve(distDir, 'contracts.json');
const docsDir = resolve(distDir, 'llms');

const log = (msg) => process.stdout.write(`[llms-docs] ${msg}\n`);
const warn = (msg) => process.stderr.write(`[llms-docs] ${msg}\n`);
const summary = (event, fields) =>
  process.stdout.write(JSON.stringify({ level: 'info', event, ...fields }) + '\n');

/**
 * Strip ` | undefined` (TS auto-adds it to every optional prop) and escape
 * `|` for markdown table cells.
 */
const formatType = (type, optional) => {
  let cleaned = optional ? type.replace(/\s*\|\s*undefined\b/g, '') : type;
  return cleaned.replace(/\|/g, '\\|');
};

const renderProps = (props) => {
  if (props.length === 0) return '_(no own props beyond inherited HTML attributes)_';
  const lines = ['| Name | Type | Required | Default | Allowed values |', '|------|------|----------|---------|----------------|'];
  for (const p of props) {
    const allowed = p.enumValues ? p.enumValues.map((v) => `\`${v}\``).join(', ') : '—';
    const def = p.default ? `\`${p.default}\`` : '—';
    lines.push(`| \`${p.name}\` | \`${formatType(p.type, p.optional)}\` | ${p.optional ? 'no' : 'yes'} | ${def} | ${allowed} |`);
  }
  return lines.join('\n');
};

const renderExample = (c) => {
  const variantAttr = c.variants ? ` variant="${c.variants[0]}"` : '';
  const sizeAttr = c.sizes ? ` size="${c.sizes[c.sizes.length === 3 ? 1 : 0]}"` : '';
  const inner = c.subcomponents.length ? `\n  <${c.subcomponents[0]}>...</${c.subcomponents[0]}>\n` : 'children';
  return `\`\`\`tsx\nimport { ${c.name} } from '@amplify-ai/ui';\n\n<${c.name}${variantAttr}${sizeAttr}>${inner}</${c.name}>\n\`\`\``;
};

const renderLifecycle = (lifecycle) => {
  if (!lifecycle || lifecycle.status === 'unknown') return null;
  const badge = {
    alpha: '🚧 **Alpha** — early stage; breaking changes likely',
    beta: '⚠️ **Beta** — feature-complete, polishing; minor changes possible',
    stable: '✅ **Stable** — production-ready, semver-stable',
    deprecated: '🛑 **Deprecated** — slated for removal',
  }[lifecycle.status];
  if (!badge) return null;
  const lines = [badge];
  lines.push(`Added in v${lifecycle.since}.`);
  if (lifecycle.status === 'deprecated') {
    if (lifecycle.replacedBy) lines.push(`Replaced by: \`${lifecycle.replacedBy}\`.`);
    if (lifecycle.deprecatedSince) lines.push(`Deprecated since v${lifecycle.deprecatedSince}.`);
    if (lifecycle.removalTarget) lines.push(`Scheduled for removal in v${lifecycle.removalTarget}.`);
  }
  if (lifecycle.notes) lines.push(`Notes: ${lifecycle.notes}`);
  return `## Lifecycle\n\n${lines.join(' ')}`;
};

const renderComponentDoc = (c, override) => {
  const sections = [];
  sections.push(`# ${c.name}`);
  sections.push(`> Auto-extracted from \`${c.filePath}\`. Do not edit by hand — regenerated on every build.`);

  const lifecycleSection = renderLifecycle(c.lifecycle);
  if (lifecycleSection) sections.push(lifecycleSection);

  if (c.variants) sections.push(`## Variants\n\n${c.variants.map((v) => `- \`${v}\``).join('\n')}`);
  if (c.sizes) sections.push(`## Sizes\n\n${c.sizes.map((s) => `- \`${s}\``).join('\n')}`);

  sections.push(`## Props\n\n${renderProps(c.props)}`);

  if (c.inherits?.from?.length) {
    sections.push(
      `## Inherited props\n\nExtends \`${c.inherits.from.join('`, `')}\` — adds ${c.inherits.propCount} standard HTML/React attributes (omitted from this doc).`
    );
  }

  if (c.subcomponents.length > 0) {
    sections.push(`## Subcomponents\n\n${c.subcomponents.map((s) => `- \`${s}\``).join('\n')}`);
  }

  sections.push(`## Forward ref\n\n${c.kind === 'forwardRef' ? `Yes — accepts \`ref\` and forwards to the underlying element.` : `No.`}`);

  sections.push(`## Example\n\n${renderExample(c)}`);

  if (override) {
    sections.push(`## Guidance\n\n${override.trim()}`);
  }

  sections.push(`## Import\n\n\`\`\`ts\nimport { ${c.name} } from '@amplify-ai/ui';\n\`\`\``);

  return sections.join('\n\n') + '\n';
};

const main = () => {
  if (!existsSync(manifestPath)) {
    warn(`contracts manifest not found at ${manifestPath} — run packages/ui prebuild first`);
    return;
  }
  if (!existsSync(docsDir)) mkdirSync(docsDir, { recursive: true });

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const components = [];
  for (const entry of manifest.components) {
    const contractPath = resolve(distDir, entry.contract);
    if (!existsSync(contractPath)) {
      warn(`contract missing for ${entry.name}: ${contractPath}`);
      continue;
    }
    const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
    const overridePath = join(componentsDir, contract.name, `${contract.name}.llm.md`);
    const override = existsSync(overridePath) ? readFileSync(overridePath, 'utf8') : null;
    writeFileSync(join(docsDir, `${contract.name}.md`), renderComponentDoc(contract, override));
    components.push(contract);
  }

  components.sort((a, b) => a.name.localeCompare(b.name));

  // llms.txt — root index following llmstxt.org spec
  const lines = [];
  lines.push('# Amplify Canvas Design System');
  lines.push('');
  lines.push('> Canvas is the unified design system for Amplify products (Brand, Creator, Atmosphere). It ships React components, design tokens, and templates as `@amplify-ai/ui`, `@amplify-ai/tokens-*`, and `@amplify-ai/templates`.');
  lines.push('');
  lines.push('Each component below has a per-component rule sheet listing variants, props, defaults, and allowed values. Use these to compose UI without inventing components or hardcoding values.');
  lines.push('');
  lines.push('## Components');
  lines.push('');
  const statusBadge = {
    alpha: ' 🚧',
    beta: ' ⚠️',
    stable: '',
    deprecated: ' 🛑',
    unknown: '',
  };
  for (const c of components) {
    const summaryStr = [
      c.variants ? `${c.variants.length} variants` : null,
      c.sizes ? `${c.sizes.length} sizes` : null,
      `${c.props.length} props`,
    ].filter(Boolean).join(', ');
    const badge = statusBadge[c.lifecycle?.status || 'unknown'] || '';
    lines.push(`- [${c.name}](llms/${c.name}.md)${badge}: ${summaryStr}`);
  }
  lines.push('');
  lines.push('## Tokens');
  lines.push('');
  lines.push('- `@amplify-ai/tokens-foundation`: primitives (color, spacing, typography, shadow, radius, motion)');
  lines.push('- `@amplify-ai/tokens-brand`: Brand product theme');
  lines.push('- `@amplify-ai/tokens-atmosphere`: Atmosphere product theme');
  lines.push('- `@amplify-ai/tokens-creator`: Creator product theme');
  lines.push('');
  lines.push('## Programmatic access');
  lines.push('');
  lines.push('- MCP server: `@amplify-ai/mcp-server` exposes the same data via stdio + HTTP transports.');
  lines.push('- JSON contracts: `dist/contracts/<Component>.json` — TS-API-extracted, single source of truth.');
  lines.push('- JSON mirror: `dist/llms.json` for tools that prefer flattened structured data.');

  writeFileSync(join(distDir, 'llms.txt'), lines.join('\n') + '\n');

  // llms.json — flattened mirror (legacy compatibility for consumers that
  // already read this file). Now sourced from contracts.
  const json = {
    generatedAt: new Date().toISOString(),
    componentCount: components.length,
    statusBreakdown: components.reduce((acc, c) => {
      const s = c.lifecycle?.status || 'unknown';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {}),
    components: components.map((c) => ({
      name: c.name,
      variants: c.variants,
      sizes: c.sizes,
      props: c.props,
      inherits: c.inherits,
      kind: c.kind,
      subcomponents: c.subcomponents,
      lifecycle: c.lifecycle,
    })),
  };
  writeFileSync(join(distDir, 'llms.json'), JSON.stringify(json, null, 2));

  log(`wrote ${components.length} component docs → ${docsDir}`);
  log(`wrote llms.txt → ${distDir}/llms.txt`);
  log(`wrote llms.json → ${distDir}/llms.json`);
  summary('llms_docs_generated', {
    componentCount: components.length,
  });
};

try {
  main();
} catch (err) {
  warn(`unexpected failure: ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
}
