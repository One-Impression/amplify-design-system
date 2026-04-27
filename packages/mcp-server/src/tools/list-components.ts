import { z } from 'zod';
import { loadComponentCatalog } from '../data/components.js';

export const listComponentsSchema = z.object({
  filter: z.string().optional().describe('Substring to filter component names (case-insensitive).'),
  withSubcomponents: z.boolean().optional().describe('Include compound subcomponents in the listing.'),
});

export type ListComponentsInput = z.infer<typeof listComponentsSchema>;

export const listComponents = (input: ListComponentsInput) => {
  const catalog = loadComponentCatalog();
  const filter = input.filter?.toLowerCase();
  const filtered = filter ? catalog.filter((c) => c.name.toLowerCase().includes(filter)) : catalog;
  return {
    count: filtered.length,
    components: filtered.map((c) => ({
      name: c.name,
      variants: c.variants ?? [],
      sizes: c.sizes ?? [],
      hasForwardRef: c.hasForwardRef,
      subcomponents: input.withSubcomponents ? c.subcomponents : undefined,
    })),
  };
};
