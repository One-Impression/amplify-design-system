import { ZodError, type ZodTypeAny } from "zod";

export interface ParseSuccess<T> {
  ok: true;
  value: T;
}

export interface ParseFailure {
  ok: false;
  error: ZodError;
}

export type ParseResult<T> = ParseSuccess<T> | ParseFailure;

/**
 * Defensive wrapper around `schema.parse(data)`.
 *
 * The interpreter renders nodes during a migration window in which stale or
 * malformed handler payloads can hit the runtime. A naked `schema.parse`
 * call would throw `ZodError`, propagate up through the React tree, and
 * crash the entire page on a single bad node.
 *
 * `parseNodeData` returns a discriminated result so the caller can either
 * render the validated value or fall back to a discreet placeholder. Any
 * non-Zod error is re-thrown — it indicates a true bug, not a wire-shape
 * mismatch.
 */
export function parseNodeData<TSchema extends ZodTypeAny>(
  schema: TSchema,
  data: unknown,
): ParseResult<ReturnType<TSchema["parse"]>> {
  try {
    return { ok: true, value: schema.parse(data) };
  } catch (err) {
    if (err instanceof ZodError) {
      return { ok: false, error: err };
    }
    throw err;
  }
}
