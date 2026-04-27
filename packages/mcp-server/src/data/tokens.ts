import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export interface TokenEntry {
  name: string;
  value: string;
  type: string;
  pkg: string;
}

const tokenPackageRoots = [
  resolve(here, '../../../tokens-foundation/tokens'),
  resolve(here, '../../../tokens-brand/tokens'),
  resolve(here, '../../../tokens-atmosphere/tokens'),
  resolve(here, '../../../tokens-creator/tokens'),
  resolve(here, '../../../../tokens-foundation/tokens'),
  resolve(here, '../../../../tokens-brand/tokens'),
  resolve(here, '../../../../tokens-atmosphere/tokens'),
  resolve(here, '../../../../tokens-creator/tokens'),
];

const walk = (dir: string, out: string[] = []): string[] => {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith('.json')) out.push(full);
  }
  return out;
};

const flatten = (
  obj: Record<string, unknown>,
  pkg: string,
  prefix: string,
  out: TokenEntry[]
): void => {
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object' && '$value' in (val as Record<string, unknown>)) {
      const v = val as { $value: unknown; $type?: string };
      out.push({
        name: prefix ? `${prefix}.${key}` : key,
        value: String(v.$value),
        type: v.$type ?? 'unknown',
        pkg,
      });
    } else if (val && typeof val === 'object') {
      flatten(val as Record<string, unknown>, pkg, prefix ? `${prefix}.${key}` : key, out);
    }
  }
};

let cache: TokenEntry[] | null = null;

export const loadTokens = (): TokenEntry[] => {
  if (cache) return cache;
  const out: TokenEntry[] = [];
  const seen = new Set<string>();
  for (const root of tokenPackageRoots) {
    if (seen.has(root)) continue;
    seen.add(root);
    const pkg = root.split('/').slice(-2, -1)[0] ?? 'unknown';
    for (const file of walk(root)) {
      try {
        const json = JSON.parse(readFileSync(file, 'utf8'));
        flatten(json, pkg, '', out);
      } catch {
        // skip malformed token files
      }
    }
  }
  cache = out;
  return cache;
};

export const resetTokenCache = (): void => {
  cache = null;
};
