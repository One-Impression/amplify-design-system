/**
 * error interceptor — maps HTTP error responses to typed BffError objects.
 *
 * Provides a consistent error shape for all BFF failures so callers
 * can pattern-match on error type without parsing raw responses.
 */

/** Error categories for BFF responses. */
export type BffErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

/** Typed error returned by the BFF client on failure. */
export class BffError extends Error {
  readonly code: BffErrorCode;
  readonly status: number;
  readonly body: unknown;

  constructor(code: BffErrorCode, status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'BffError';
    this.code = code;
    this.status = status;
    this.body = body;
  }
}

/**
 * Map an HTTP status code to a BffErrorCode.
 */
function statusToCode(status: number): BffErrorCode {
  switch (status) {
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 422:
      return 'VALIDATION_ERROR';
    case 429:
      return 'RATE_LIMITED';
    default:
      if (status >= 500) return 'SERVER_ERROR';
      if (status >= 400) return 'UNKNOWN';
      return 'UNKNOWN';
  }
}

/**
 * Check a Response and throw a BffError if it indicates failure.
 *
 * Should be called after retry logic has completed — this is the
 * final error gate before returning data to the caller.
 *
 * @param response - The fetch Response to check
 * @throws BffError if the response status indicates an error
 */
export async function throwOnError(response: Response): Promise<void> {
  if (response.ok) return;

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = await response.text().catch(() => null);
  }

  const message =
    typeof body === 'object' && body !== null && 'message' in body
      ? String((body as { message: unknown }).message)
      : `BFF request failed with status ${response.status}`;

  throw new BffError(statusToCode(response.status), response.status, message, body);
}

/**
 * Create a BffError for network-level failures (no HTTP response).
 */
export function networkError(err: unknown): BffError {
  const message = err instanceof Error ? err.message : 'Network request failed';
  return new BffError('NETWORK_ERROR', 0, message, err);
}
