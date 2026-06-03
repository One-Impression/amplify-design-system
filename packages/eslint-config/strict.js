/**
 * @one-impression/eslint-config/strict — strict (error-level) flat config
 *
 * Same rules as the recommended preset, but every violation is an `error`
 * instead of `warn`. Use this preset in CI gates and when you want hard
 * enforcement for design-system compliance.
 *
 * Usage:
 *   import amplifyStrict from '@one-impression/eslint-config/strict';
 *   export default [...amplifyStrict];
 */
'use strict';

const recommended = require('./index.js');
const plugin = recommended.plugin;

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    plugins: {
      '@amplify-ai': plugin,
    },
    rules: {
      '@one-impression/no-hardcoded-colors': 'error',
      '@one-impression/no-raw-spacing': 'error',
      '@one-impression/prefer-token-import': 'error',
      '@one-impression/no-inline-styles': 'error',
      '@one-impression/no-raw-surface': 'error',
      '@one-impression/no-hardcoded-radius': 'error',
      '@one-impression/no-hardcoded-typography': 'error',
    },
  },
];

module.exports.plugin = plugin;
