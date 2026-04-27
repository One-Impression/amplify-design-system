/**
 * @one-impression/eslint-config — prefer-token-import
 * Warns when importing from legacy token paths instead of @one-impression/tokens-*.
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Prefer @one-impression/tokens-* imports over legacy token paths' },
    messages: { preferAmplifyTokens: 'Import from "{{ suggested }}" instead of legacy path "{{ source }}".' },
    schema: [],
  },
  create(context) {
    const LEGACY_PATTERNS = [
      { pattern: /^@oneimpression\/tokens/, suggested: '@one-impression/tokens-brand' },
      { pattern: /\.\.\/.*styles\/colors/, suggested: '@one-impression/tokens-creator or @one-impression/tokens-brand' },
      { pattern: /\.\.\/.*design-tokens/, suggested: '@one-impression/tokens-brand' },
    ];
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        for (const { pattern, suggested } of LEGACY_PATTERNS) {
          if (pattern.test(source)) {
            context.report({ node, messageId: 'preferAmplifyTokens', data: { source, suggested } });
          }
        }
      },
    };
  },
};
