import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export interface BlockEntry {
  id: string;
  source: string;
  description: string;
  components: string[];
  steps?: number;
}

const blockSearchRoots = [
  resolve(here, '../../../templates/src/configs'),
  resolve(here, '../../../../templates/src/configs'),
];

const componentRefRe = /component:\s*['"]([\w-]+)['"]/g;

let cache: BlockEntry[] | null = null;

export const loadBlocks = (): BlockEntry[] => {
  if (cache) return cache;
  const out: BlockEntry[] = [];
  for (const root of blockSearchRoots) {
    if (!existsSync(root) || !statSync(root).isDirectory()) continue;
    for (const file of readdirSync(root).filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))) {
      const full = join(root, file);
      const source = readFileSync(full, 'utf8');
      const components = new Set<string>();
      let m: RegExpExecArray | null;
      componentRefRe.lastIndex = 0;
      while ((m = componentRefRe.exec(source)) !== null) components.add(m[1]);
      const stepsMatch = source.match(/(\d+)Step/i);
      out.push({
        id: file.replace(/\.tsx?$/, ''),
        source: full,
        description: `Template config from ${file}`,
        components: [...components],
        steps: stepsMatch ? parseInt(stepsMatch[1], 10) : undefined,
      });
    }
    if (out.length) break;
  }
  cache = out;
  return cache;
};

export const resetBlockCache = (): void => {
  cache = null;
};
