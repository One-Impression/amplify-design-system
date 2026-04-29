/**
 * @amplify/design-lint — no-raw-spacing
 *
 * Flags raw pixel/em/rem literals used as spacing in JSX style props or
 * style objects, e.g.:
 *   style={{ padding: '12px' }}            // BAD
 *   style={{ margin: 16 }}                  // BAD
 *   const x = { paddingTop: '0.5rem' }      // BAD
 *
 * Allowed:
 *   style={{ padding: 'var(--amp-spacing-md)' }}
 *   style={{ padding: tokens.spacing.md }}
 *   numeric 0 (semantic for "no spacing")
 */
'use strict';

const SPACING_PROPS = new Set([
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'paddingInline', 'paddingBlock', 'paddingInlineStart', 'paddingInlineEnd',
  'paddingBlockStart', 'paddingBlockEnd',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'marginInline', 'marginBlock', 'marginInlineStart', 'marginInlineEnd',
  'marginBlockStart', 'marginBlockEnd',
  'gap', 'rowGap', 'columnGap',
  'top', 'right', 'bottom', 'left',
  'inset', 'insetInline', 'insetBlock',
]);

const PX_RE = /^-?\d+(?:\.\d+)?(?:px|rem|em)?$/;

function checkPropValue(context, node, propName, value) {
  if (!SPACING_PROPS.has(propName)) return;

  if (typeof value === 'number') {
    if (value === 0) return;
    context.report({ node, messageId: 'noRawSpacing', data: { prop: propName, value: String(value) } });
    return;
  }

  if (typeof value !== 'string') return;
  if (value.startsWith('var(')) return;
  if (value.includes('--')) return; // Likely embedded CSS var
  // Skip percent / vw / vh / fr / auto / etc.
  if (PX_RE.test(value.trim())) {
    context.report({ node, messageId: 'noRawSpacing', data: { prop: propName, value } });
  }
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow raw px/rem/em spacing literals in style objects; use Amplify spacing tokens instead',
      recommended: true,
    },
    schema: [],
    messages: {
      noRawSpacing:
        'Raw spacing value `{{value}}` for `{{prop}}` — use a token like var(--amp-spacing-md) or @amplify-ai/tokens-foundation/js.',
    },
  },
  create(context) {
    function visitObjectExpression(obj) {
      if (!obj || obj.type !== 'ObjectExpression') return;
      for (const prop of obj.properties) {
        if (prop.type !== 'Property') continue;
        const keyName =
          prop.key.type === 'Identifier' ? prop.key.name :
          prop.key.type === 'Literal' ? String(prop.key.value) : null;
        if (!keyName) continue;
        const v = prop.value;
        if (v.type === 'Literal') {
          checkPropValue(context, v, keyName, v.value);
        } else if (v.type === 'TemplateLiteral' && v.expressions.length === 0) {
          checkPropValue(context, v, keyName, v.quasis.map((q) => q.value.cooked).join(''));
        }
      }
    }

    return {
      // style={{ ... }}
      JSXAttribute(node) {
        if (node.name && node.name.name === 'style') {
          const expr = node.value && node.value.expression;
          visitObjectExpression(expr);
        }
      },
      // const styles = { padding: '12px' }
      VariableDeclarator(node) {
        if (node.init && node.init.type === 'ObjectExpression') {
          visitObjectExpression(node.init);
        }
      },
    };
  },
};
