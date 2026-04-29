/**
 * @amplify-ai/eslint-config — no-hardcoded-colors
 *
 * Flags hex colour literals (#fff, #ff0000, #FF000080) in:
 *   - JSX style props: style={{ color: '#FF0000' }}
 *   - className strings: className="text-[#abc]"
 *   - JS object properties: const styles = { color: '#abc' }
 *   - Tagged template literals (CSS-in-JS): css`color: #abc;`
 *   - Plain CSS string literals
 *
 * Acceptable: CSS variables (var(--amplify-*) / var(--amp-*)) or token JS imports.
 */
'use strict';

// Match: #abc, #abcd, #aabbcc, #aabbccdd
const HEX_RE = /#(?:[0-9a-fA-F]{3,4}\b|[0-9a-fA-F]{6}\b|[0-9a-fA-F]{8}\b)/;

function checkString(context, node, value) {
  if (typeof value !== 'string') return;
  const m = value.match(HEX_RE);
  if (!m) return;
  context.report({
    node,
    messageId: 'noHardcodedColor',
    data: { color: m[0] },
  });
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow hardcoded hex colour literals; require Amplify design tokens (CSS vars or @amplify-ai/tokens-* imports)',
      recommended: true,
    },
    schema: [],
    messages: {
      noHardcodedColor:
        'Hardcoded color "{{color}}" — use an Amplify design token (--amplify-* / --amp-* CSS variable) instead.',
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;
        // Skip module imports / dependency paths
        const parent = node.parent;
        if (parent && (parent.type === 'ImportDeclaration' || parent.type === 'ExportAllDeclaration')) return;
        checkString(context, node, node.value);
      },
      TemplateElement(node) {
        if (node.value && node.value.cooked) {
          checkString(context, node, node.value.cooked);
        }
      },
      JSXAttribute(node) {
        // className="text-[#abc]" via JSX literal
        if (node.value && node.value.type === 'Literal') {
          checkString(context, node.value, node.value.value);
        }
      },
    };
  },
};
