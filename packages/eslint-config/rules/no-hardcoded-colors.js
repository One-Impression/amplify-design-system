/**
 * Rule: no-hardcoded-colors
 *
 * Warns when inline hex color values are used in JSX style props or
 * className strings. Encourages use of design token CSS variables instead.
 *
 * Catches patterns like:
 *   - style={{ color: '#FF0000' }}
 *   - style={{ backgroundColor: '#abc' }}
 *   - className="text-[#FF0000]"
 */

const HEX_COLOR_REGEX = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow hardcoded hex color values in JSX; use design tokens instead',
      recommended: true,
    },
    messages: {
      noHardcodedColor:
        'Avoid hardcoded color "{{color}}". Use an Amplify design token (CSS variable or JS import) instead.',
    },
    schema: [],
  },

  create(context) {
    return {
      // Catches style={{ color: '#FFF' }} in JSX
      JSXAttribute(node) {
        if (node.name.name !== 'style') return;

        const expr = node.value && node.value.expression;
        if (!expr || expr.type !== 'ObjectExpression') return;

        for (const prop of expr.properties) {
          if (
            prop.value &&
            prop.value.type === 'Literal' &&
            typeof prop.value.value === 'string'
          ) {
            const match = prop.value.value.match(HEX_COLOR_REGEX);
            if (match) {
              context.report({
                node: prop.value,
                messageId: 'noHardcodedColor',
                data: { color: match[0] },
              });
            }
          }
        }
      },

      // Catches className="text-[#FF0000]" or template literals with hex colors
      JSXAttribute(node) {
        if (node.name.name !== 'className') return;

        if (node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
          const match = node.value.value.match(HEX_COLOR_REGEX);
          if (match) {
            context.report({
              node: node.value,
              messageId: 'noHardcodedColor',
              data: { color: match[0] },
            });
          }
        }
      },

      // Catches hex colors in template literals used in JSX attributes
      TemplateLiteral(node) {
        for (const quasi of node.quasis) {
          const match = quasi.value.raw.match(HEX_COLOR_REGEX);
          if (match) {
            // Only report if this template literal is inside a JSX attribute
            let parent = node.parent;
            while (parent) {
              if (parent.type === 'JSXAttribute') {
                context.report({
                  node: quasi,
                  messageId: 'noHardcodedColor',
                  data: { color: match[0] },
                });
                break;
              }
              parent = parent.parent;
            }
          }
        }
      },
    };
  },
};
