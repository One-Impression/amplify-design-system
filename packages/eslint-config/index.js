/**
 * @one-impression/eslint-config — Shared ESLint flat config
 *
 * Enforces Amplify design token usage across consuming projects.
 *
 * Usage (eslint.config.js):
 *   import amplifyConfig from '@one-impression/eslint-config';
 *   export default [...amplifyConfig];
 *
 * Or CommonJS:
 *   const amplifyConfig = require('@one-impression/eslint-config');
 *   module.exports = [...amplifyConfig];
 */

const noHardcodedColors = require('./rules/no-hardcoded-colors');
const noRawSpacing = require('./rules/no-raw-spacing');
const preferTokenImport = require('./rules/prefer-token-import');
const noInlineStyles = require('./rules/no-inline-styles');
const noRawSurface = require('./rules/no-raw-surface');
const noHardcodedRadius = require('./rules/no-hardcoded-radius');
const noHardcodedTypography = require('./rules/no-hardcoded-typography');

const plugin = {
  meta: {
    name: '@one-impression/eslint-plugin',
    version: '2.0.0',
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
    plugins: {
      '@one-impression': plugin,
    },
    rules: {
      '@one-impression/no-hardcoded-colors': 'warn',
      '@one-impression/no-raw-spacing': 'warn',
      '@one-impression/prefer-token-import': 'warn',
      '@one-impression/no-inline-styles': 'warn',
      '@one-impression/no-raw-surface': 'warn',
      '@one-impression/no-hardcoded-radius': 'warn',
      '@one-impression/no-hardcoded-typography': 'warn',
    },
  },
];
