import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractFromSource, type ExtractedComponent } from '../lib/extract-props.js';

const here = dirname(fileURLToPath(import.meta.url));

const candidateRoots = [
  resolve(here, '../../../ui/src/components'),
  resolve(here, '../../../../ui/src/components'),
  resolve(process.cwd(), 'packages/ui/src/components'),
];

const findComponentsRoot = (): string => {
  for (const root of candidateRoots) {
    if (existsSync(root) && statSync(root).isDirectory()) return root;
  }
  throw new Error(`Could not locate packages/ui/src/components. Tried: ${candidateRoots.join(', ')}`);
};

const findIndexFile = (componentDir: string, name: string): string | null => {
  for (const candidate of [`${name}.tsx`, 'index.tsx', `${name}.ts`, 'index.ts']) {
    const full = join(componentDir, candidate);
    if (existsSync(full)) return full;
  }
  return null;
};

let cache: ExtractedComponent[] | null = null;

export const loadComponentCatalog = (): ExtractedComponent[] => {
  if (cache) return cache;
  const root = findComponentsRoot();
  const dirs = readdirSync(root).filter((d) => statSync(join(root, d)).isDirectory());
  const out: ExtractedComponent[] = [];
  for (const dir of dirs) {
    const file = findIndexFile(join(root, dir), dir);
    if (!file) continue;
    try {
      out.push(extractFromSource(file, dir));
    } catch {
      // skip unparseable components rather than crash the server
    }
  }
  cache = out.sort((a, b) => a.name.localeCompare(b.name));
  return cache;
};

export const getComponent = (name: string): ExtractedComponent | undefined => {
  return loadComponentCatalog().find((c) => c.name.toLowerCase() === name.toLowerCase());
};

export const resetCatalogCache = (): void => {
  cache = null;
};
