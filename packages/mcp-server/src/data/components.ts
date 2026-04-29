import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractFromSource, type ExtractedComponent } from '../lib/extract-props.js';

const here = dirname(fileURLToPath(import.meta.url));

interface ContractEntry {
  name: string;
  contract: string;
}

interface ContractsManifest {
  componentCount: number;
  components: ContractEntry[];
}

interface PropContract {
  name: string;
  type: string;
  optional: boolean;
  default?: string;
  enumValues?: string[] | null;
}

interface ComponentContract {
  name: string;
  filePath: string;
  kind: string;
  variants: string[] | null;
  sizes: string[] | null;
  props: PropContract[];
  inherits?: { from: string[]; propCount: number };
  subcomponents: string[];
}

const candidateContractsManifests = [
  resolve(here, '../../../ui/dist/contracts.json'),
  resolve(here, '../../../../ui/dist/contracts.json'),
  resolve(process.cwd(), 'packages/ui/dist/contracts.json'),
  resolve(process.cwd(), 'node_modules/@amplify-ai/ui/dist/contracts.json'),
];

const candidateComponentRoots = [
  resolve(here, '../../../ui/src/components'),
  resolve(here, '../../../../ui/src/components'),
  resolve(process.cwd(), 'packages/ui/src/components'),
];

const findContractsManifest = (): string | null => {
  for (const path of candidateContractsManifests) {
    if (existsSync(path)) return path;
  }
  return null;
};

const findComponentsRoot = (): string => {
  for (const root of candidateComponentRoots) {
    if (existsSync(root) && statSync(root).isDirectory()) return root;
  }
  throw new Error(`Could not locate packages/ui/src/components. Tried: ${candidateComponentRoots.join(', ')}`);
};

const findIndexFile = (componentDir: string, name: string): string | null => {
  for (const candidate of [`${name}.tsx`, 'index.tsx', `${name}.ts`, 'index.ts']) {
    const full = join(componentDir, candidate);
    if (existsSync(full)) return full;
  }
  return null;
};

const contractToExtracted = (c: ComponentContract, filePath: string): ExtractedComponent => {
  return {
    name: c.name,
    filePath,
    variants: c.variants ?? undefined,
    sizes: c.sizes ?? undefined,
    props: c.props.map((p) => ({
      name: p.name,
      type: p.type,
      optional: p.optional,
      defaultValue: p.default,
      enumValues: p.enumValues ?? undefined,
    })),
    hasForwardRef: c.kind === 'forwardRef',
    subcomponents: c.subcomponents,
  };
};

const loadFromContracts = (manifestPath: string): ExtractedComponent[] => {
  const manifestDir = dirname(manifestPath);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as ContractsManifest;
  const out: ExtractedComponent[] = [];
  for (const entry of manifest.components) {
    const contractPath = resolve(manifestDir, entry.contract);
    if (!existsSync(contractPath)) continue;
    try {
      const contract = JSON.parse(readFileSync(contractPath, 'utf8')) as ComponentContract;
      out.push(contractToExtracted(contract, contractPath));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[canvas-mcp] skip malformed contract "${entry.name}": ${msg}`);
    }
  }
  return out;
};

const loadFromFilesystem = (): ExtractedComponent[] => {
  const root = findComponentsRoot();
  const dirs = readdirSync(root).filter((d) => statSync(join(root, d)).isDirectory());
  const out: ExtractedComponent[] = [];
  for (const dir of dirs) {
    const file = findIndexFile(join(root, dir), dir);
    if (!file) continue;
    try {
      out.push(extractFromSource(file, dir));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[canvas-mcp] skip unparseable component "${dir}": ${msg}`);
    }
  }
  return out;
};

let cache: ExtractedComponent[] | null = null;

/**
 * Load the component catalog. Prefers JSON contracts emitted by
 * `packages/ui` build (proper TS-API extraction, captures inherited props
 * and JSDoc) — falls back to filesystem regex extraction so the server
 * works in development before the first build.
 */
export const loadComponentCatalog = (): ExtractedComponent[] => {
  if (cache) return cache;
  const manifestPath = findContractsManifest();
  const out = manifestPath ? loadFromContracts(manifestPath) : loadFromFilesystem();
  cache = out.sort((a, b) => a.name.localeCompare(b.name));
  return cache;
};

export const getComponent = (name: string): ExtractedComponent | undefined => {
  return loadComponentCatalog().find((c) => c.name.toLowerCase() === name.toLowerCase());
};

export const resetCatalogCache = (): void => {
  cache = null;
};
