import { z } from 'zod';
import { getComponent, loadComponentCatalog } from '../data/components.js';

export const getPropsSchema = z.object({
  component: z.string().describe('Component name, e.g. "Button" or "Card".'),
});

export type GetPropsInput = z.infer<typeof getPropsSchema>;

export const getProps = (input: GetPropsInput) => {
  const c = getComponent(input.component);
  if (!c) {
    const catalog = loadComponentCatalog();
    const close = catalog
      .map((entry) => entry.name)
      .filter((name) => name.toLowerCase().startsWith(input.component.slice(0, 2).toLowerCase()))
      .slice(0, 5);
    return { error: `Component "${input.component}" not found.`, suggestions: close };
  }
  return {
    name: c.name,
    variants: c.variants ?? [],
    sizes: c.sizes ?? [],
    subcomponents: c.subcomponents,
    props: c.props.map((p) => ({
      name: p.name,
      type: p.type,
      optional: p.optional,
      default: p.defaultValue,
      enumValues: p.enumValues,
    })),
  };
};
