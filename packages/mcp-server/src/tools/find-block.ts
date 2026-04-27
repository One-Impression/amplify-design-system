import { z } from 'zod';
import { loadBlocks } from '../data/blocks.js';

export const findBlockSchema = z.object({
  query: z.string().describe('Search term — matches block id or composing components (e.g. "checkout", "stepper", "wallet").'),
  limit: z.number().int().positive().optional().default(5),
});

export type FindBlockInput = z.infer<typeof findBlockSchema>;

export const findBlock = (input: FindBlockInput) => {
  const q = input.query.toLowerCase();
  const blocks = loadBlocks();
  const scored = blocks
    .map((b) => {
      let score = 0;
      if (b.id.toLowerCase().includes(q)) score += 5;
      if (b.description.toLowerCase().includes(q)) score += 2;
      for (const comp of b.components) if (comp.toLowerCase().includes(q)) score += 3;
      return { block: b, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, input.limit);

  return {
    matches: scored.map(({ block, score }) => ({
      id: block.id,
      score,
      description: block.description,
      components: block.components,
      steps: block.steps,
      source: block.source,
    })),
  };
};
