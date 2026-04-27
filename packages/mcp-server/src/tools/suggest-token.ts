import { z } from 'zod';
import { loadTokens } from '../data/tokens.js';

export const suggestTokenSchema = z.object({
  value: z.string().describe('Raw value to find a token for — hex color (#7C3AED), spacing (16px), or named (violet-600).'),
  type: z.enum(['color', 'spacing', 'radius', 'shadow', 'typography', 'any']).optional().default('any'),
  limit: z.number().int().positive().optional().default(5),
});

export type SuggestTokenInput = z.infer<typeof suggestTokenSchema>;

const normalizeHex = (h: string): string => {
  const m = h.replace('#', '').toLowerCase();
  if (m.length === 3) return m.split('').map((c) => c + c).join('');
  return m;
};

const hexDistance = (a: string, b: string): number => {
  const an = normalizeHex(a);
  const bn = normalizeHex(b);
  if (an.length !== 6 || bn.length !== 6) return Infinity;
  const ar = parseInt(an.slice(0, 2), 16);
  const ag = parseInt(an.slice(2, 4), 16);
  const ab = parseInt(an.slice(4, 6), 16);
  const br = parseInt(bn.slice(0, 2), 16);
  const bg = parseInt(bn.slice(2, 4), 16);
  const bb = parseInt(bn.slice(4, 6), 16);
  return Math.sqrt((ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2);
};

const numericDistance = (a: string, b: string): number => {
  const ax = parseFloat(a);
  const bx = parseFloat(b);
  if (Number.isNaN(ax) || Number.isNaN(bx)) return Infinity;
  return Math.abs(ax - bx);
};

export const suggestToken = (input: SuggestTokenInput) => {
  const tokens = loadTokens();
  const filtered =
    input.type === 'any'
      ? tokens
      : tokens.filter((t) => t.type === input.type || t.name.includes(input.type));

  const isHex = /^#?[0-9a-fA-F]{3,8}$/.test(input.value);
  const isNumeric = /^\d+(\.\d+)?(px|rem|em)?$/.test(input.value);

  const ranked = filtered
    .map((t) => {
      let distance = Infinity;
      if (isHex && /^#[0-9a-fA-F]{3,8}$/.test(t.value)) distance = hexDistance(input.value, t.value);
      else if (isNumeric) distance = numericDistance(input.value, t.value);
      else if (t.value === input.value || t.name.includes(input.value)) distance = 0;
      return { token: t, distance };
    })
    .filter((r) => r.distance !== Infinity)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, input.limit);

  return {
    suggestions: ranked.map(({ token, distance }) => ({
      name: token.name,
      value: token.value,
      type: token.type,
      package: token.pkg,
      distance: Number(distance.toFixed(2)),
    })),
  };
};
