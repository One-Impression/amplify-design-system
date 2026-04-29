'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { RuleTester } = require('eslint');

const noHardcodedColors = require('../rules/no-hardcoded-colors');
const noRawSpacing = require('../rules/no-raw-spacing');
const preferTokenImport = require('../rules/prefer-token-import');

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

test('no-hardcoded-colors', () => {
  tester.run('no-hardcoded-colors', noHardcodedColors, {
    valid: [
      { code: "const c = 'var(--amp-color-violet-600)';" },
      { code: "const c = tokens.color.violet600;" },
      { code: "import x from 'some/path';" },
    ],
    invalid: [
      {
        code: "const c = '#FF0000';",
        errors: [{ messageId: 'noHardcodedColor' }],
      },
      {
        code: "const c = '#abc';",
        errors: [{ messageId: 'noHardcodedColor' }],
      },
    ],
  });
});

test('no-raw-spacing', () => {
  tester.run('no-raw-spacing', noRawSpacing, {
    valid: [
      { code: "const s = { padding: 'var(--amp-spacing-md)' };" },
      { code: "const s = { padding: 0 };" },
      { code: "const s = { width: '50%' };" },
    ],
    invalid: [
      {
        code: "const s = { padding: '12px' };",
        errors: [{ messageId: 'noRawSpacing' }],
      },
      {
        code: "const s = { margin: 16 };",
        errors: [{ messageId: 'noRawSpacing' }],
      },
    ],
  });
});

test('prefer-token-import', () => {
  tester.run('prefer-token-import', preferTokenImport, {
    valid: [
      { code: "import x from '@amplify-ai/tokens-foundation';" },
      { code: "import x from 'react';" },
    ],
    invalid: [
      {
        code: "import x from './theme/colors';",
        errors: [{ messageId: 'preferTokenImport' }],
      },
      {
        code: "import x from 'src/styles/palette';",
        errors: [{ messageId: 'preferTokenImport' }],
      },
    ],
  });
});
