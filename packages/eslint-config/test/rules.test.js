'use strict';
const { test } = require('node:test');
const { RuleTester } = require('eslint');

const noHardcodedColors = require('../rules/no-hardcoded-colors');
const noRawSpacing = require('../rules/no-raw-spacing');
const preferTokenImport = require('../rules/prefer-token-import');
const noInlineStyles = require('../rules/no-inline-styles');
const noRawSurface = require('../rules/no-raw-surface');
const noHardcodedRadius = require('../rules/no-hardcoded-radius');
const noHardcodedTypography = require('../rules/no-hardcoded-typography');

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
      {
        code: "import x from '@oneimpression/tokens';",
        errors: [{ messageId: 'preferAmplifyTokens' }],
      },
    ],
  });
});

test('no-inline-styles', () => {
  tester.run('no-inline-styles', noInlineStyles, {
    valid: [
      { code: "const A = () => <div style={styles}>x</div>;" },
      { code: "const A = ({pct}) => <div style={{ ['--w']: pct }}>x</div>;" },
    ],
    invalid: [
      {
        code: "const A = () => <div style={{ color: '#fff', padding: 10 }}>x</div>;",
        errors: [{ messageId: 'noInlineStyles' }],
      },
    ],
  });
});

test('no-raw-surface', () => {
  tester.run('no-raw-surface', noRawSurface, {
    valid: [
      {
        code: "const A = () => <div className=\"bg-[var(--surface-elevated)] ring-1 ring-[var(--border-default)]\">x</div>;",
      },
      { code: "const A = () => <div className=\"bg-[var(--surface-primary)]\">x</div>;" },
    ],
    invalid: [
      {
        code: "const A = () => <div className=\"bg-[var(--surface-elevated)] p-5\">x</div>;",
        errors: [{ messageId: 'noRawSurface' }],
      },
    ],
  });
});

test('no-hardcoded-radius', () => {
  tester.run('no-hardcoded-radius', noHardcodedRadius, {
    valid: [
      { code: "const A = () => <div className=\"rounded-[var(--radius-card)]\">x</div>;" },
      { code: "const A = () => <div className=\"rounded-full\">x</div>;" },
    ],
    invalid: [
      {
        code: "const A = () => <div className=\"rounded-lg\">x</div>;",
        errors: [{ messageId: 'noHardcodedRadius' }],
      },
      {
        code: "const A = () => <div className=\"rounded-[12px]\">x</div>;",
        errors: [{ messageId: 'noHardcodedRadius' }],
      },
    ],
  });
});

test('no-hardcoded-typography', () => {
  tester.run('no-hardcoded-typography', noHardcodedTypography, {
    valid: [
      { code: "const A = () => <div className=\"text-sm\">x</div>;" },
      { code: "const A = () => <div className=\"text-[var(--typography-body)]\">x</div>;" },
    ],
    invalid: [
      {
        code: "const A = () => <div className=\"text-[13px]\">x</div>;",
        errors: [{ messageId: 'noHardcodedTypography' }],
      },
    ],
  });
});
