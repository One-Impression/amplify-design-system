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
import { isLocalhostBffUrl } from '../is-localhost.js';
import { useDevConfigStore } from '../../state/useDevConfigStore.js';

export interface AuthInterceptorConfig {
  /** Returns the current JWT token (may be null if not authenticated). */
  getAuthToken: () => string | null;
  /** App version string. */
  appVersion: string;
  /**
   * BFF base URL — used only to gate the localhost-only X-Dev-Identity
   * header (mirrors the action engine's bff_call behaviour so document
   * fetches and action calls present the same identity in local dev).
   */
  bffBaseUrl?: string;
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

  if (config.bffBaseUrl && isLocalhostBffUrl(config.bffBaseUrl)) {
    const devIdentity = useDevConfigStore.getState().devIdentity;
    if (devIdentity) {
      (authHeaders as Record<string, string>)['X-Dev-Identity'] = devIdentity;
    }
  }
  const existingHeaders = init.headers as Record<string, string> | undefined;

  return {
    ...init,
    headers: {
      ...existingHeaders,
      ...authHeaders,
    },
  };
}
