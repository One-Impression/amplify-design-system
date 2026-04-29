import { z } from 'zod';
import { getComponent } from '../data/components.js';

export const validateUsageSchema = z.object({
  jsx: z.string().describe('A single JSX snippet, e.g. `<Button variant="primary" size="md">Click</Button>`.'),
});

export type ValidateUsageInput = z.infer<typeof validateUsageSchema>;

interface Issue {
  level: 'error' | 'warning';
  message: string;
}

const TAG_RE = /<([A-Z]\w*)\b/;
const ATTR_RE = /(\w+)=(?:\{([^}]*)\}|"([^"]*)"|'([^']*)')/g;

export const validateUsage = (input: ValidateUsageInput) => {
  const issues: Issue[] = [];
  const tagMatch = TAG_RE.exec(input.jsx);
  if (!tagMatch) {
    return { valid: false, issues: [{ level: 'error' as const, message: 'No JSX component tag found.' }] };
  }
  const tag = tagMatch[1];
  const c = getComponent(tag);
  if (!c) {
    return {
      valid: false,
      tag,
      issues: [{ level: 'error' as const, message: `Component "${tag}" not in @amplify-ai/ui.` }],
    };
  }

  const knownProps = new Map(c.props.map((p) => [p.name, p]));
  ATTR_RE.lastIndex = 0;
  let attrMatch: RegExpExecArray | null;
  while ((attrMatch = ATTR_RE.exec(input.jsx)) !== null) {
    const [, attr, expr, dq, sq] = attrMatch;
    if (attr === 'className' || attr === 'key' || attr === 'ref' || attr === 'style') continue;
    const value = expr ?? dq ?? sq;
    const prop = knownProps.get(attr);
    if (!prop) {
      const builtIn = /^(on[A-Z]|aria-|data-|role|id|tabIndex|disabled|name|type|value|placeholder|autoFocus|required|readOnly)/.test(attr);
      if (!builtIn) {
        issues.push({ level: 'warning', message: `Unknown prop "${attr}" on <${tag}>.` });
      }
      continue;
    }
    if (prop.enumValues && value && !value.startsWith('{')) {
      const literal = value.replace(/^['"]|['"]$/g, '');
      if (!prop.enumValues.includes(literal)) {
        issues.push({
          level: 'error',
          message: `Invalid value "${literal}" for prop "${attr}" on <${tag}>. Valid: ${prop.enumValues.join(', ')}.`,
        });
      }
    }
  }
  return {
    valid: !issues.some((i) => i.level === 'error'),
    tag,
    issues,
  };
};
