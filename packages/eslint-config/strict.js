/**
 * @amplify-ai/eslint-config/strict — strict (error-level) flat config
 *
 * Same rules as the recommended preset, but every violation is an `error`
 * instead of `warn`. Use this preset in CI gates and when you want hard
 * enforcement for design-system compliance.
 *
 * Usage:
 *   import amplifyStrict from '@amplify-ai/eslint-config/strict';
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
      '@amplify-ai/no-hardcoded-colors': 'error',
      '@amplify-ai/no-raw-spacing': 'error',
      '@amplify-ai/prefer-token-import': 'error',
      '@amplify-ai/no-inline-styles': 'error',
      '@amplify-ai/no-raw-surface': 'error',
      '@amplify-ai/no-hardcoded-radius': 'error',
      '@amplify-ai/no-hardcoded-typography': 'error',
    },
  },
];

module.exports.plugin = plugin;
