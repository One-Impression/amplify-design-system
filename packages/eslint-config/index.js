/**
 * @amplify-ai/eslint-config — Shared ESLint flat config (recommended preset)
 *
 * Enforces Amplify design token usage across consuming projects.
 *
 * Usage (eslint.config.js):
 *   import amplifyConfig from '@amplify-ai/eslint-config';
 *   export default [...amplifyConfig];
 *
 * Or CommonJS:
 *   const amplifyConfig = require('@amplify-ai/eslint-config');
 *   module.exports = [...amplifyConfig];
 *
 * For hard CI enforcement (every violation = error), use the strict preset:
 *   import amplifyStrict from '@amplify-ai/eslint-config/strict';
 *   export default [...amplifyStrict];
 */
'use strict';

const noHardcodedColors = require('./rules/no-hardcoded-colors');
const noRawSpacing = require('./rules/no-raw-spacing');
const preferTokenImport = require('./rules/prefer-token-import');
const noInlineStyles = require('./rules/no-inline-styles');
const noRawSurface = require('./rules/no-raw-surface');
const noHardcodedRadius = require('./rules/no-hardcoded-radius');
const noHardcodedTypography = require('./rules/no-hardcoded-typography');

const plugin = {
  meta: {
    name: '@amplify-ai/eslint-plugin',
    version: '2.1.0',
  },
  rules: {
    'no-hardcoded-colors': noHardcodedColors,
    'no-raw-spacing': noRawSpacing,
    'prefer-token-import': preferTokenImport,
    'no-inline-styles': noInlineStyles,
    'no-raw-surface': noRawSurface,
    'no-hardcoded-radius': noHardcodedRadius,
    'no-hardcoded-typography': noHardcodedTypography,
  },
};

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    plugins: {
      '@amplify-ai': plugin,
    },
    rules: {
      '@amplify-ai/no-hardcoded-colors': 'warn',
      '@amplify-ai/no-raw-spacing': 'warn',
      '@amplify-ai/prefer-token-import': 'warn',
      '@amplify-ai/no-inline-styles': 'warn',
      '@amplify-ai/no-raw-surface': 'warn',
      '@amplify-ai/no-hardcoded-radius': 'warn',
      '@amplify-ai/no-hardcoded-typography': 'warn',
    },
  },
];

module.exports.plugin = plugin;
