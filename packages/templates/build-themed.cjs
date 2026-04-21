#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { renderPage } = require('./src/renderer.cjs');
const configs = require('./src/configs.cjs');

const outputDir = process.argv[2] || path.join(require('os').homedir(), 'Desktop');
const themes = ['default', 'minimal-clean', 'bold-gradient', 'warm-earthy', 'modern-teal'];
const themeLabels = { 'default': 'Violet (Default)', 'minimal-clean': 'Minimal Clean', 'bold-gradient': 'Bold Dark', 'warm-earthy': 'Warm Earthy', 'modern-teal': 'Modern Teal' };

// Only 6-step for themed variations
const targetConfigs = ['6step-stepper', '6step-scroll'];

console.log(`Rendering ${targetConfigs.length} layouts × ${themes.length} themes = ${targetConfigs.length * themes.length} designs...`);
const start = Date.now();

for (const configName of targetConfigs) {
  const baseConfig = configs[configName];
  for (const theme of themes) {
    const config = { ...baseConfig, theme, meta: { ...baseConfig.meta, title: `Amplify — 6-Step ${baseConfig.layout === 'scroll' ? 'Scroll' : 'Stepper'} (${themeLabels[theme]})` } };
    const html = renderPage(config);
    const filename = `theme-${theme}-6step-${baseConfig.layout}.html`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, html);

    const hasScript = html.includes('</script>');
    const fns = (html.match(/function /g) || []).length;
    console.log(`  ✓ ${filename} — ${(html.length / 1024).toFixed(1)}KB | functions:${fns} | complete:${hasScript}`);
  }
}

console.log(`\nDone in ${Date.now() - start}ms`);
