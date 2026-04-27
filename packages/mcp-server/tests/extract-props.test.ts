import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractFromSource } from '../src/lib/extract-props.ts';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const buttonPath = resolve(here, '../../ui/src/components/Button/Button.tsx');

test('Button component: variants, sizes, forwardRef extracted', () => {
  const c = extractFromSource(buttonPath, 'Button');
  assert.equal(c.name, 'Button');
  assert.deepEqual(c.variants, ['primary', 'secondary', 'ghost', 'destructive', 'outline']);
  assert.deepEqual(c.sizes, ['sm', 'md', 'lg']);
  assert.equal(c.hasForwardRef, true);
  const variantProp = c.props.find((p) => p.name === 'variant');
  assert.ok(variantProp, 'variant prop should be extracted');
  assert.equal(variantProp?.optional, true);
  assert.equal(variantProp?.defaultValue, 'primary');
});
