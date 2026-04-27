import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listComponents } from '../src/tools/list-components.ts';
import { getProps } from '../src/tools/get-props.ts';
import { validateUsage } from '../src/tools/validate-usage.ts';
import { findBlock } from '../src/tools/find-block.ts';
import { suggestToken } from '../src/tools/suggest-token.ts';

test('list_components returns the full catalog', () => {
  const result = listComponents({});
  assert.ok(result.count >= 40, `expected >= 40 components, got ${result.count}`);
  const names = result.components.map((c) => c.name);
  for (const required of ['Button', 'Badge', 'Card', 'Input', 'Dialog', 'DataTable']) {
    assert.ok(names.includes(required), `expected ${required} in catalog`);
  }
});

test('list_components filters by substring', () => {
  const result = listComponents({ filter: 'card' });
  assert.ok(result.count > 0);
  for (const c of result.components) assert.match(c.name.toLowerCase(), /card/);
});

test('get_props returns Button enum values and defaults', () => {
  const result = getProps({ component: 'Button' });
  assert.ok(!('error' in result), 'should not error');
  assert.deepEqual(result.variants, ['primary', 'secondary', 'ghost', 'destructive', 'outline']);
  const variant = result.props.find((p) => p.name === 'variant');
  assert.equal(variant?.default, 'primary');
});

test('get_props returns suggestions for unknown component', () => {
  const result = getProps({ component: 'Buton' });
  assert.ok('error' in result);
  assert.ok(Array.isArray((result as { suggestions: string[] }).suggestions));
});

test('validate_usage flags invalid enum value', () => {
  const result = validateUsage({ jsx: '<Button variant="plumber" size="md">x</Button>' });
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.message.includes('Invalid value "plumber"')));
});

test('validate_usage passes valid usage', () => {
  const result = validateUsage({ jsx: '<Button variant="primary" size="md">click</Button>' });
  assert.equal(result.valid, true);
});

test('find_block locates checkout in templates', () => {
  const result = findBlock({ query: 'checkout', limit: 5 });
  assert.ok(result.matches.length > 0, 'expected checkout match');
});

test('suggest_token finds a near match for a violet hex', () => {
  const result = suggestToken({ value: '#7C3AED', type: 'color', limit: 3 });
  assert.ok(result.suggestions.length > 0, 'expected at least one suggestion');
});
