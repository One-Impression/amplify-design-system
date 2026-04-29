/**
 * @amplify/design-lint — strict (error-level) flat config
 *
 * Same rules as the recommended preset, but every violation is an `error`
 * instead of `warn`. Use this preset in CI gates and when you want hard
 * enforcement for design-system compliance.
 *
 * Usage:
 *   import amplifyStrict from '@amplify/design-lint/strict';
 *   export default [...amplifyStrict];
 */
'use strict';

const recommended = require('./index.js');
const plugin = recommended.plugin;

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    plugins: {
      '@amplify': plugin,
    },
    rules: {
      '@amplify/no-hardcoded-colors': 'error',
      '@amplify/no-raw-spacing': 'error',
      '@amplify/prefer-token-import': 'error',
    },
  },
];

module.exports.plugin = plugin;
