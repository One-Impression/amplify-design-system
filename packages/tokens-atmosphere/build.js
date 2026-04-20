// Delegates to shared build script
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
execSync(`node ${join(root, 'scripts/build-tokens.js')} atmosphere`, { stdio: 'inherit' });
