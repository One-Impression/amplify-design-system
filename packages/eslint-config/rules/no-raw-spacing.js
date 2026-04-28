/**
 * @amplify-ai/eslint-config — no-raw-spacing
 * Warns when raw pixel values are used in style props where spacing tokens exist.
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow raw pixel values in style props — use spacing tokens instead' },
    messages: { noRawSpacing: 'Avoid raw pixel value "{{ value }}". Use a spacing token.' },
    schema: [],
  },
  create(context) {
    const SPACING_MAP = {
      '4px': 'spacing.1', '8px': 'spacing.2', '12px': 'spacing.3',
      '16px': 'spacing.4', '20px': 'spacing.5', '24px': 'spacing.6',
      '32px': 'spacing.8', '40px': 'spacing.10', '48px': 'spacing.12',
      '64px': 'spacing.16', '80px': 'spacing.20', '96px': 'spacing.24',
    };
    return {
      JSXAttribute(node) {
        if (node.name.name !== 'style') return;
        const value = node.value;
        if (!value || value.type !== 'JSXExpressionContainer') return;
        const source = context.getSourceCode().getText(value);
        for (const [px, token] of Object.entries(SPACING_MAP)) {
          if (source.includes(`'${px}'`) || source.includes(`"${px}"`)) {
            context.report({ node, messageId: 'noRawSpacing', data: { value: `${px} → use ${token}` } });
          }
        }
      },
    };
  },
};
