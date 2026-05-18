/**
 * auth interceptor — adds Bearer JWT + custom platform headers
 * to every outgoing BFF request.
 *
 * Headers added:
 *   - Authorization: Bearer <jwt>
 *   - X-Platform: ios | android
 *   - X-Version: app version string
 *   - X-UTM-Source / X-UTM-Medium / X-UTM-Campaign (when present)
 */
import { buildHeaders, type HeaderContext } from '../header-builders.js';

export interface AuthInterceptorConfig {
  /** Returns the current JWT token (may be null if not authenticated). */
  getAuthToken: () => string | null;
  /** App version string. */
  appVersion: string;
  /** Optional UTM parameters for the current session. */
  getUtm?: () => HeaderContext['utm'];
}

/**
 * Apply auth headers to a request init object.
 *
 * @param init   - Existing RequestInit (headers may be partially set)
 * @param config - Auth configuration
 * @returns A new RequestInit with auth headers merged in
 */
export function applyAuthHeaders(
  init: RequestInit,
  config: AuthInterceptorConfig,
): RequestInit {
  const ctx: HeaderContext = {
    authToken: config.getAuthToken(),
    appVersion: config.appVersion,
    utm: config.getUtm?.(),
  };

  const authHeaders = buildHeaders(ctx);
  const existingHeaders = init.headers as Record<string, string> | undefined;

  return {
    ...init,
    headers: {
      ...existingHeaders,
      ...authHeaders,
    },
  };
}
