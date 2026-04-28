/**
 * @amplify-ai/no-inline-styles
 *
 * Flags inline style={{}} objects in JSX. These bypass the design token system
 * and can't be themed, audited, or updated globally.
 *
 * Allowed:
 *   style={someVariable}          — pre-defined style objects (gradual migration)
 *   style={{ width: `${pct}%` }}  — dynamic computed values
 *   style={{ ['--custom']: val }} — CSS variable injection
 *
 * Flagged:
 *   style={{ color: '#fff', padding: 10 }}  — literal values that should be Tailwind
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Discourage inline style objects in JSX — use Tailwind + design tokens',
    },
    schema: [],
    messages: {
      noInlineStyles:
        'Avoid inline style={{}} with literal values. Use Tailwind classes with CSS variable tokens instead. See DESIGN_SYSTEM.md.',
    },
  },

  create(context) {
    return {
      'JSXAttribute[name.name="style"]'(node) {
        const value = node.value;
        if (!value) return;

        // style="string" — not JSX expression, skip
        if (value.type === 'Literal') return;

        // style={expression}
        if (value.type === 'JSXExpressionContainer') {
          const expr = value.expression;

          // style={variable} or style={condition ? a : b} — skip (pre-defined objects)
          if (expr.type !== 'ObjectExpression') return;

          // style={{ ... }} — check if it has literal property values
          const hasLiteralValues = expr.properties.some((prop) => {
            if (prop.type !== 'Property') return false;
            const val = prop.value;
            // Literal string/number: style={{ color: '#fff', padding: 10 }}
            if (val.type === 'Literal' && (typeof val.value === 'string' || typeof val.value === 'number')) {
              // Allow CSS variable injection: style={{ ['--foo']: value }}
              if (prop.computed) return false;
              return true;
            }
            return false;
          });

          if (hasLiteralValues) {
            context.report({ node, messageId: 'noInlineStyles' });
          }
        }
      },
    };
  },
};
