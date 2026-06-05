/**
 * BFF client — fetch wrapper with auth, idempotency, and retry.
 *
 * Uses the ActionEngineConfig (from Task 11's action-engine) for
 * runtime configuration: bffBaseUrl, authToken, onNavigate, etc.
 *
 * Pipeline per request:
 *   1. Resolve endpoint from registry
 *   2. Build headers (auth interceptor)
 *   3. Execute with retry (retry interceptor)
 *   4. Check for errors (error interceptor)
 *   5. Extract onLoadAction if present (on-load-action interceptor)
 */
import { getEndpoint, resolvePath, type HttpMethod } from './endpoint-registry.js';
import { isLocalhostBffUrl } from './is-localhost.js';
import { useDevConfigStore } from '../state/useDevConfigStore.js';
import { applyAuthHeaders, type AuthInterceptorConfig } from './interceptors/auth.js';
import { fetchWithRetry, type RetryConfig } from './interceptors/retry.js';
import { throwOnError, networkError } from './interceptors/error.js';
import { extractOnLoadAction, type ActionDispatcher } from './interceptors/on-load-action.js';

/** Configuration for the BFF client, sourced from ActionEngineConfig. */
export interface BffClientConfig {
  /** Base URL for the BFF (e.g. "https://api.amplify.club"). */
  bffBaseUrl: string;
  /** Returns the current auth token. */
  getAuthToken: () => string | null;
  /** App version string for X-Version header. */
  appVersion: string;
  /** Callback to refresh auth token on 401. */
  onAuthRefresh?: () => Promise<boolean>;
  /** Callback to dispatch onLoadAction payloads. */
  onAction?: ActionDispatcher;
  /** Retry configuration overrides. */
  retry?: RetryConfig;
}

/** Options for a single BFF request. */
export interface BffRequestOptions {
  /** URL path params to substitute in the endpoint template. */
  params?: Record<string, string>;
  /** URL query parameters. */
  query?: Record<string, string>;
  /** Request body (will be JSON-serialized). */
  body?: unknown;
  /** Idempotency key for mutation requests. */
  idempotencyKey?: string;
  /** Override the HTTP method from the endpoint registry. */
  method?: HttpMethod;
  /** Additional headers to merge. */
  headers?: Record<string, string>;
  /** AbortSignal for request cancellation. */
  signal?: AbortSignal;
}

/** Response shape from the BFF client. */
export interface BffResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
}

/**
 * Create a configured BFF client.
 *
 * @example
 * ```ts
 * const client = createBffClient({
 *   bffBaseUrl: 'https://api.amplify.club',
 *   getAuthToken: () => authStore.getState().accessToken,
 *   appVersion: '6.0.0',
 * });
 *
 * const { data } = await client.request('campaigns.list');
 * ```
 */
export function createBffClient(config: BffClientConfig) {
  const authConfig: AuthInterceptorConfig = {
    getAuthToken: config.getAuthToken,
    appVersion: config.appVersion,
  };

  const retryConfig: RetryConfig = {
    maxRetries: config.retry?.maxRetries ?? 3,
    baseDelayMs: config.retry?.baseDelayMs ?? 500,
    onAuthRefresh: config.onAuthRefresh,
  };

  /**
   * Execute a BFF request by endpoint ID.
   */
  async function request<T = unknown>(
    endpointId: string,
    options: BffRequestOptions = {},
  ): Promise<BffResponse<T>> {
    const endpoint = getEndpoint(endpointId);
    const method = options.method ?? endpoint.method;

    // Build URL
    const resolvedPath = resolvePath(endpoint.path, options.params);
    const url = new URL(resolvedPath, config.bffBaseUrl);

    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        url.searchParams.set(key, value);
      }
    }

    // Build request init
    let init: RequestInit = {
      method,
      signal: options.signal,
    };

    // Add body for non-GET requests
    if (options.body !== undefined && method !== 'GET') {
      init.headers = { 'Content-Type': 'application/json' };
      init.body = JSON.stringify(options.body);
    }

    // Merge additional headers
    if (options.headers) {
      init.headers = { ...(init.headers as Record<string, string>), ...options.headers };
    }

    // Add idempotency key
    if (options.idempotencyKey) {
      init.headers = {
        ...(init.headers as Record<string, string>),
        'Idempotency-Key': options.idempotencyKey,
      };
    }

    // Apply auth headers. The dev identity is read here at the call site
    // (not inside the interceptor) and only for localhost BFF URLs —
    // mirrors the action engine's bff_call.
    const devIdentity = isLocalhostBffUrl(config.bffBaseUrl)
      ? useDevConfigStore.getState().devIdentity
      : undefined;
    init = applyAuthHeaders(init, authConfig, devIdentity);

    // Execute with retry
    let response: Response;
    try {
      response = await fetchWithRetry(
        () => fetch(url.toString(), init),
        retryConfig,
      );
    } catch (err) {
      throw networkError(err);
    }

    // Check for HTTP errors
    await throwOnError(response);

    // Parse response body
    let data: T;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const json = await response.json();

      // Extract onLoadAction if dispatcher is configured
      if (config.onAction && typeof json === 'object' && json !== null) {
        data = extractOnLoadAction(
          json as Record<string, unknown>,
          config.onAction,
        ) as T;
      } else {
        data = json as T;
      }
    } else {
      data = (await response.text()) as T;
    }

    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  }

  return { request };
}

/** Type of the BFF client instance. */
export type BffClient = ReturnType<typeof createBffClient>;
