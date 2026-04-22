import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getTokensCSS } from './tokens';
import { getBaseCSS } from './base-css';
import { getInteractivityJS } from './interactivity';
import { layoutRegistry } from './layouts';
import { componentRegistry } from './registry';

export interface ScreenConfig {
  label: string;
  components: Array<{ component: string; props?: Record<string, unknown> }>;
}

export interface TemplateConfig {
  layout: string;
  product?: string;
  theme?: string;
  screens: ScreenConfig[];
  data?: Record<string, unknown>;
  meta?: { title?: string; [key: string]: unknown };
}

export function renderPage(config: TemplateConfig): string {
  const { layout, product = 'brand', screens, data, meta } = config;

  const LayoutComponent = layoutRegistry[layout];
  if (!LayoutComponent) throw new Error(`Unknown layout: ${layout}`);

  const context = { product, data, meta, screens, componentRegistry };
  const bodyHtml = renderToStaticMarkup(
    <LayoutComponent config={config} context={context} />
  );

  const tokensCSS = getTokensCSS(product);
  const baseCSS = getBaseCSS();
  const layoutCSS = LayoutComponent.getCSS?.() || '';
  const interactivityJS = getInteractivityJS(layout);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${meta?.title || 'Amplify \u2014 New Campaign'}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
${tokensCSS}
${baseCSS}
${layoutCSS}
</style>
</head>
<body>
${bodyHtml}
<script>
${interactivityJS}
</script>
</body>
</html>`;
}
