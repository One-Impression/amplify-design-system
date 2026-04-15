/**
 * @amplify/eslint-config — Shared ESLint flat config
 *
 * Enforces Amplify design token usage across consuming projects.
 *
 * Usage (eslint.config.js):
 *   import amplifyConfig from '@amplify/eslint-config';
 *   export default [...amplifyConfig];
 *
 * Or CommonJS:
 *   const amplifyConfig = require('@amplify/eslint-config');
 *   module.exports = [...amplifyConfig];
 */

const noHardcodedColors = require('./rules/no-hardcoded-colors');
const noRawSpacing = require('./rules/no-raw-spacing');
const preferTokenImport = require('./rules/prefer-token-import');

const plugin = {
  meta: {
    name: '@amplify/eslint-plugin',
    version: '1.0.0',
  },
  rules: {
    'no-hardcoded-colors': noHardcodedColors,
    'no-raw-spacing': noRawSpacing,
    'prefer-token-import': preferTokenImport,
  },
};

module.exports = [
  {
    plugins: {
      '@amplify': plugin,
    },
    rules: {
      '@amplify/no-hardcoded-colors': 'warn',
      '@amplify/no-raw-spacing': 'warn',
      '@amplify/prefer-token-import': 'warn',
    },
  },
];
