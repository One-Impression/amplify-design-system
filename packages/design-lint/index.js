/**
 * @amplify/design-lint — recommended (warn-level) flat config
 *
 * Usage (eslint.config.js):
 *   import amplifyLint from '@amplify/design-lint';
 *   export default [...amplifyLint];
 *
 * Or CommonJS:
 *   const amplifyLint = require('@amplify/design-lint');
 *   module.exports = [...amplifyLint];
 */
'use strict';

const noHardcodedColors = require('./rules/no-hardcoded-colors');
const noRawSpacing = require('./rules/no-raw-spacing');
const preferTokenImport = require('./rules/prefer-token-import');

const plugin = {
  meta: {
    name: '@amplify/design-lint',
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
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
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

module.exports.plugin = plugin;
