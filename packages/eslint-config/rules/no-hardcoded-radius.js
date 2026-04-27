/**
 * @one-impression/no-hardcoded-radius
 *
 * Flags Tailwind hardcoded border-radius classes. Use design token radii instead:
 *   rounded-[var(--radius-card)]  — 16px, for cards and containers
 *   rounded-[var(--radius-xs)]    — 6px, for small elements (tags, inputs)
 *   rounded-full                  — pills and circles (allowed)
 *   rounded-none                  — intentional removal (allowed)
 *
 * Flagged: rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-3xl,
 *          rounded-[8px], rounded-[12px] etc.
 */

const HARDCODED_RADIUS = /\brounded-(sm|md|lg|xl|2xl|3xl)\b|\brounded-\[\d+px\]/;
const EXEMPT = /\brounded-(full|none)\b/;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use design token border-radius instead of hardcoded Tailwind radius classes',
    },
    schema: [],
    messages: {
      noHardcodedRadius:
        'Use design token radius: `rounded-[var(--radius-card)]` (16px) or `rounded-[var(--radius-xs)]` (6px). Avoid hardcoded rounded-lg/md/xl.',
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
          // cn(...) calls — check string arguments
          for (const arg of value.expression.arguments) {
            if (arg.type === 'Literal' && typeof arg.value === 'string') {
              classStr += ' ' + arg.value;
            }
          }
        } else {
          return;
        }

        if (!HARDCODED_RADIUS.test(classStr)) return;
        if (EXEMPT.test(classStr) && !HARDCODED_RADIUS.test(classStr.replace(EXEMPT, ''))) return;

        context.report({ node, messageId: 'noHardcodedRadius' });
      },
    };
  },
};
