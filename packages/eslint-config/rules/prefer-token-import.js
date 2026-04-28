/**
 * @amplify-ai/eslint-config — prefer-token-import
 * Warns when importing from legacy token paths instead of @amplify-ai/tokens-*.
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Prefer @amplify-ai/tokens-* imports over legacy token paths' },
    messages: { preferAmplifyTokens: 'Import from "{{ suggested }}" instead of legacy path "{{ source }}".' },
    schema: [],
  },
  create(context) {
    const LEGACY_PATTERNS = [
      { pattern: /^@oneimpression\/tokens/, suggested: '@amplify-ai/tokens-brand' },
      { pattern: /\.\.\/.*styles\/colors/, suggested: '@amplify-ai/tokens-creator or @amplify-ai/tokens-brand' },
      { pattern: /\.\.\/.*design-tokens/, suggested: '@amplify-ai/tokens-brand' },
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
