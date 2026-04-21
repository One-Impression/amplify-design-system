// Component registry - maps names to render functions
const registry = {};

function register(name, renderFn) {
  registry[name] = renderFn;
}

function render(name, props, context) {
  const fn = registry[name];
  if (!fn) throw new Error(`Unknown component: ${name}`);
  return fn(props, context);
}

function renderAll(components, context) {
  return components.map(c => render(c.component, c.props || {}, context)).join('\n');
}

module.exports = { register, render, renderAll, registry };
