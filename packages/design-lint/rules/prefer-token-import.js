/**
 * @amplify/design-lint — prefer-token-import
 *
 * Flags direct color imports from product/brand files that should be
 * Amplify token imports.
 *
 * Examples flagged:
 *   import { colors } from '../theme/colors';
 *   import palette from '@/styles/palette';
 *   import { violet600 } from 'src/styles/colors';
 *
 * Acceptable:
 *   import tokens from '@amplify-ai/tokens-foundation/js';
 *   import { colors } from '@amplify-ai/tokens-creator';
 *   @import "@amplify-ai/tokens-foundation/css";
 */
'use strict';

const SUSPECT_PATTERNS = [
  /(^|\/)theme\/colors$/,
  /(^|\/)theme\/palette$/,
  /(^|\/)styles\/colors$/,
  /(^|\/)styles\/palette$/,
  /(^|\/)constants\/colors$/,
  /(^|\/)design\/colors$/,
  /-tokens\/colors$/,
];

const ALLOWED_PREFIXES = [
  '@amplify-ai/',
  '@amplify/',
];

function isAllowed(source) {
  return ALLOWED_PREFIXES.some((p) => source.startsWith(p));
}

function isSuspect(source) {
  return SUSPECT_PATTERNS.some((re) => re.test(source));
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer @amplify-ai/tokens-* imports over product-local color/palette modules',
      recommended: true,
    },
    schema: [],
    messages: {
      preferTokenImport:
        'Local color import "{{source}}" — prefer @amplify-ai/tokens-foundation (or product token package).',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source && node.source.value;
        if (typeof source !== 'string') return;
        if (isAllowed(source)) return;
        if (isSuspect(source)) {
          context.report({
            node: node.source,
            messageId: 'preferTokenImport',
            data: { source },
          });
        }
      },
    };
  },
};
