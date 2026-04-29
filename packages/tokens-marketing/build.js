// tokens-marketing — concatenate src/*.css into dist/index.css
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, 'src');
const DIST = join(__dirname, 'dist');

const FILES = ['type.css', 'spacing.css', 'motion.css', 'surfaces.css', 'gradients.css'];

mkdirSync(DIST, { recursive: true });

const header = '/* @amplify/tokens-marketing — auto-bundled, do not edit dist/ directly */\n\n';
const body = FILES.map((f) => {
  const path = join(SRC, f);
  return `/* ── ${f} ── */\n${readFileSync(path, 'utf8')}\n`;
}).join('\n');

writeFileSync(join(DIST, 'index.css'), header + body);
console.log(`@amplify/tokens-marketing: bundled ${FILES.length} files → dist/index.css`);
