#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { renderPage } = require('./src/renderer.cjs');
const configs = require('./src/configs.cjs');

const outputDir = process.argv[2] || path.join(require('os').homedir(), 'Desktop');

console.log(`Rendering ${Object.keys(configs).length} designs...`);
const start = Date.now();

for (const [name, config] of Object.entries(configs)) {
  const html = renderPage(config);
  const filename = `template-${name}.html`;
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, html);

  // Validate completeness
  const hasCloseHtml = html.includes('</html>');
  const hasScript = html.includes('<script>');
  const hasCloseScript = html.includes('</script>');
  const functionCount = (html.match(/function /g) || []).length;
  const onclickCount = (html.match(/onclick/gi) || []).length;

  // Stepper/scroll layouts have 10+ functions; dashboard/detail/auth have fewer but are still complete
  const minFunctions = ['dashboard', 'detail', 'auth'].includes(config.layout) ? 3 : 10;
  const status = hasCloseHtml && hasScript && hasCloseScript && functionCount >= minFunctions
    ? '✓' : '✗';

  console.log(`  ${status} ${filename} — ${(html.length / 1024).toFixed(1)}KB | </html>:${hasCloseHtml} | <script>:${hasScript} | functions:${functionCount} | onclicks:${onclickCount}`);
}

console.log(`\nDone in ${Date.now() - start}ms — files saved to ${outputDir}`);
