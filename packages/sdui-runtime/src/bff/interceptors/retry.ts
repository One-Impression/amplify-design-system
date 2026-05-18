/**
 * retry interceptor — handles transient failures with smart retry logic.
 *
 * - 401 Unauthorized: triggers auth.refresh capability, then retries once
 * - 5xx Server Error: exponential backoff, max 3 attempts
 * - All other errors: no retry (caller handles)
 */

/** Configuration for the retry interceptor. */
export interface RetryConfig {
  /** Maximum number of retry attempts for 5xx errors. Default: 3. */
  maxRetries?: number;
  /** Base delay in milliseconds for exponential backoff. Default: 500. */
  baseDelayMs?: number;
  /**
   * Callback to refresh the auth token when a 401 is received.
   * Should return true if refresh succeeded and the request can be retried.
   */
  onAuthRefresh?: () => Promise<boolean>;
}

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 500;

/**
 * Sleep for a given number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay with jitter.
 *
 * @param attempt - Zero-based attempt index
 * @param baseMs  - Base delay in milliseconds
 * @returns Delay in milliseconds
 */
function backoffDelay(attempt: number, baseMs: number): number {
  const exponential = baseMs * Math.pow(2, attempt);
  const jitter = Math.random() * baseMs;
  return exponential + jitter;
}

/**
 * Execute a fetch with retry logic.
 *
 * @param doFetch - A function that performs the fetch (called on each attempt)
 * @param config  - Retry configuration
 * @returns The final Response (after retries, if any)
 */
export async function fetchWithRetry(
  doFetch: () => Promise<Response>,
  config: RetryConfig = {},
): Promise<Response> {
  const maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
  const baseDelayMs = config.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;

  let response = await doFetch();

  // Handle 401 — try auth refresh once
  if (response.status === 401 && config.onAuthRefresh) {
    const refreshed = await config.onAuthRefresh();
    if (refreshed) {
      response = await doFetch();
      // If still 401 after refresh, return as-is
      if (response.status === 401) return response;
    } else {
      return response;
    }
  }

  // Handle 5xx — exponential backoff
  if (response.status >= 500) {
    for (let attempt = 0; attempt < maxRetries - 1; attempt++) {
      const delay = backoffDelay(attempt, baseDelayMs);
      await sleep(delay);

      response = await doFetch();
      if (response.status < 500) break;
    }
  }

  return response;
}
