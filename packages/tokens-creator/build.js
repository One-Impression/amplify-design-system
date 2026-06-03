// Delegates to shared build script.
// Runs the palette-validator first so a missing-token reference fails
// the build early with a clear pointer (instead of failing later in
// downstream consumer apps with a runtime missing-color).
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

execSync(`node ${join(__dirname, 'scripts/validate-palette.js')}`, { stdio: 'inherit' });
execSync(`node ${join(root, 'scripts/build-tokens.js')} creator`, { stdio: 'inherit' });
