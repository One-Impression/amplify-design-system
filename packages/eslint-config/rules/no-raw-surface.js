/**
 * @amplify/no-raw-surface
 *
 * Flags bg-[var(--surface-elevated/secondary/tertiary/overlay)] without a visible
 * boundary (ring, border, or shadow). In light mode, elevated surfaces are white
 * on a near-white background — cards become invisible without a border.
 *
 * Allowed:
 *   bg-[var(--surface-elevated)] ring-1 ring-[var(--border-default)]
 *   bg-[var(--surface-elevated)] border border-[var(--border-default)]
 *   bg-[var(--surface-elevated)] shadow-sm
 *   <Card> component (handles its own border)
 *
 * Flagged:
 *   bg-[var(--surface-elevated)] p-5        — no visible boundary
 */

const SURFACE_TOKENS = ['surface-elevated', 'surface-secondary', 'surface-tertiary', 'surface-overlay'];
const BOUNDARY_PATTERNS = /\b(ring-|border-|shadow-|border\b)/;
const EXEMPT_SURFACES = ['surface-primary', 'surface-hover', 'surface-active', 'surface-backdrop', 'surface-hover-solid', 'surface-active-solid', 'surface-row-stripe'];

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require visible boundary on elevated surface containers',
    },
    schema: [],
    messages: {
      noRawSurface:
        'Surface container needs a visible boundary. Add `ring-1 ring-[var(--border-default)]` or use the <Card> component. Without a border, this card is invisible in light mode.',
    },
  },

  create(context) {
    // Skip files in components/ui/ — component definitions set their own styling
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
        } else {
          return;
        }

        // Check if className contains a flagged surface token
        const hasFlaggedSurface = SURFACE_TOKENS.some((token) => classStr.includes(`var(--${token})`));
        if (!hasFlaggedSurface) return;

        // Check if className also has a boundary
        if (BOUNDARY_PATTERNS.test(classStr)) return;

        context.report({ node, messageId: 'noRawSurface' });
      },
    };
  },
};
