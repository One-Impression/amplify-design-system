const getTokensCSS = require('./tokens.cjs');
const getBaseCSS = require('./base-css.cjs');
const { renderAll } = require('./registry.cjs');

// Import all component renderers (they self-register)
require('./components/ordering/goal-cards.cjs');
require('./components/ordering/product-scanner.cjs');
require('./components/ordering/content-type.cjs');
require('./components/ordering/budget-section.cjs');
require('./components/ordering/brief-editor.cjs');
require('./components/ordering/script-preview.cjs');
require('./components/ordering/checkout.cjs');
require('./components/ordering/success-modal.cjs');
require('./components/ordering/repeat-banner.cjs');
require('./components/ordering/wallet-card.cjs');
require('./components/ordering/intelligence.cjs');

// Theme registry
const themes = {};
try {
  themes['default'] = () => '';
  themes['minimal-clean'] = require('./themes/minimal-clean.cjs');
  themes['bold-gradient'] = require('./themes/bold-gradient.cjs');
  themes['warm-earthy'] = require('./themes/warm-earthy.cjs');
  themes['modern-teal'] = require('./themes/modern-teal.cjs');
} catch (e) { /* themes are optional */ }

function renderPage(config) {
  const { product = 'brand', layout, screens, data, meta, theme = 'default' } = config;

  const layoutMap = {
    'scroll': './layouts/scroll.cjs',
    'stepper': './layouts/stepper.cjs',
    'stepper-editorial': './layouts/stepper-editorial.cjs',
  };
  const layoutRenderer = require(layoutMap[layout] || layoutMap['stepper']);

  const themeFn = themes[theme] || themes['default'];
  const themeCSS = themeFn();

  const context = { product, data, meta, screens };
  const body = layoutRenderer(config, context);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${meta?.title || 'Amplify — New Campaign'}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
${getTokensCSS(product)}
${getBaseCSS()}
${layoutRenderer.getCSS ? layoutRenderer.getCSS() : ''}
${themeCSS}
</style>
</head>
<body>
${body}
</body>
</html>`;
}

module.exports = { renderPage };
