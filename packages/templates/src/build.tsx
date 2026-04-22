import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { renderPage } from './render';
import { orderingConfigs } from './configs/ordering';

const outDir = join(import.meta.dirname, '..', 'dist', 'html');
mkdirSync(outDir, { recursive: true });

let passed = 0;
let failed = 0;

for (const [name, config] of Object.entries(orderingConfigs)) {
  try {
    const html = renderPage(config);

    // Validate: </html> present
    if (!html.includes('</html>')) throw new Error('Missing </html> closing tag');

    // Validate: <script> present
    if (!html.includes('<script>')) throw new Error('Missing <script> tag');

    // Validate: has enough functions (> 10)
    const fnMatches = html.match(/function\s+\w+/g);
    const fnCount = fnMatches ? fnMatches.length : 0;
    if (fnCount < 10) throw new Error(`Only ${fnCount} functions found, expected > 10`);

    const filePath = join(outDir, `${name}.html`);
    writeFileSync(filePath, html, 'utf-8');
    console.log(`[OK] ${name} -> ${filePath} (${(html.length / 1024).toFixed(1)}KB, ${fnCount} functions)`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${(err as Error).message}`);
    failed++;
  }
}

console.log(`\nBuild complete: ${passed} passed, ${failed} failed out of ${Object.keys(orderingConfigs).length} configs`);

if (failed > 0) {
  process.exit(1);
}
