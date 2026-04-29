/**
 * @amplify-ai/no-hardcoded-typography
 *
 * Flags arbitrary pixel font sizes in Tailwind classes like text-[13px], text-[11px].
 * Use Tailwind's built-in scale instead:
 *   text-xs   — 12px
 *   text-sm   — 14px
 *   text-base — 16px
 *   text-lg   — 18px
 *   text-xl   — 20px
 *   text-2xl  — 24px
 *   text-3xl  — 30px
 *
 * Allowed:
 *   text-[var(--typography-*)]  — token-based (allowed)
 *   text-xs, text-sm, etc.     — standard Tailwind scale
 */

const HARDCODED_TEXT = /\btext-\[\d+px\]/;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use Tailwind text size scale instead of arbitrary pixel values',
    },
    schema: [],
    messages: {
      noHardcodedTypography:
        'Use Tailwind text size classes (text-xs, text-sm, text-base, text-lg) instead of text-[Npx]. Arbitrary pixel sizes bypass the typography scale.',
    },
  },

  create(context) {
    const filename = context.filename || context.getFilename();
    if (/components\/ui\//.test(filename)) return {};

    return {
      JSXAttribute(node) {
        if (node.name.name !== 'className') return;
        const value = node.value;
        if (!value) return;

        let classStr = '';
        if (value.type === 'Literal' && typeof value.value === 'string') {
          classStr = value.value;
        } else if (value.type === 'JSXExpressionContainer' && value.expression.type === 'TemplateLiteral') {
          classStr = value.expression.quasis.map((q) => q.value.raw).join('');
        } else if (value.type === 'JSXExpressionContainer' && value.expression.type === 'CallExpression') {
          for (const arg of value.expression.arguments) {
            if (arg.type === 'Literal' && typeof arg.value === 'string') {
              classStr += ' ' + arg.value;
            }
          }
        } else {
          return;
        }

        // Skip token-based: text-[var(--*)]
        if (/text-\[var\(--/.test(classStr)) return;

        if (HARDCODED_TEXT.test(classStr)) {
          context.report({ node, messageId: 'noHardcodedTypography' });
        }
      },
    };
  },
};
