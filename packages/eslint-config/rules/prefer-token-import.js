/**
 * @amplify-ai/eslint-config — prefer-token-import
 *
 * Flags direct color/token imports from product-local or legacy modules that
 * should be Amplify token imports instead.
 *
 * Examples flagged:
 *   import { colors } from '../theme/colors';
 *   import palette from '@/styles/palette';
 *   import { violet600 } from 'src/styles/colors';
 *   import x from '@oneimpression/tokens';
 *   import x from '../design-tokens';
 *
 * Acceptable:
 *   import tokens from '@amplify-ai/tokens-foundation/js';
 *   import { colors } from '@amplify-ai/tokens-creator';
 *   @import "@amplify-ai/tokens-foundation/css";
 */
'use strict';

// Patterns that indicate a product-local or legacy token/color/palette import
const SUSPECT_PATTERNS = [
  /(^|\/)theme\/colors$/,
  /(^|\/)theme\/palette$/,
  /(^|\/)styles\/colors$/,
  /(^|\/)styles\/palette$/,
  /(^|\/)constants\/colors$/,
  /(^|\/)design\/colors$/,
  /-tokens\/colors$/,
];

// Legacy patterns with explicit replacement suggestions
const LEGACY_PATTERNS = [
  { pattern: /^@oneimpression\/tokens/, suggested: '@amplify-ai/tokens-brand' },
  { pattern: /\.\.\/.*styles\/colors/, suggested: '@amplify-ai/tokens-creator or @amplify-ai/tokens-brand' },
  { pattern: /\.\.\/.*design-tokens/, suggested: '@amplify-ai/tokens-brand' },
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
        'Prefer @amplify-ai/tokens-* imports over product-local or legacy color/palette/token modules',
      recommended: true,
    },
    schema: [],
    messages: {
      preferTokenImport:
        'Local color import "{{source}}" — prefer @amplify-ai/tokens-foundation (or product token package).',
      preferAmplifyTokens:
        'Import from "{{suggested}}" instead of legacy path "{{source}}".',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source && node.source.value;
        if (typeof source !== 'string') return;
        if (isAllowed(source)) return;

        // Legacy patterns w/ specific suggestion
        for (const { pattern, suggested } of LEGACY_PATTERNS) {
          if (pattern.test(source)) {
            context.report({
              node: node.source,
              messageId: 'preferAmplifyTokens',
              data: { source, suggested },
            });
            return;
          }
        }

        // Suspect product-local color modules
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
