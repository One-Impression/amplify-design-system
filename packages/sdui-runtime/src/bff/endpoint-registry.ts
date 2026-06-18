/**
 * endpoint-registry — maps legacy endpoint-id strings to concrete HTTP
 * method + path templates, for the legacy `BffClient` (`bff/client.ts`) and its
 * hooks only.
 *
 * NOTE: this id→path registry is the LEGACY anti-pattern the addressable-surface
 * design retires. New surfaces are **path-direct** — the BFF emits a concrete
 * `path` and the action handlers (`bff_call` / `reload`) fetch `bffBaseUrl +
 * path` verbatim with NO client-side id→path lookup (see
 * `action-engine/handlers/_shared/bff-request.ts`). This map survives only for
 * already-shipped `BffClient` callers and is not extended for new work; the
 * codegen'd `EndpointPaths` catalog it used to fall back to has been removed
 * from `@one-impression/sdk-native-sdui` entirely.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface EndpointDefinition {
  method: HttpMethod;
  /** Path template with `:param` placeholders. */
  path: string;
}

/**
 * Resolve path template params.
 *
 * @example
 * resolvePath('/v1/campaigns/:id', { id: '123' })
 * // => '/v1/campaigns/123'
 */
export function resolvePath(
  template: string,
  params?: Record<string, string>,
): string {
  if (!params) return template;
  let resolved = template;
  for (const [key, value] of Object.entries(params)) {
    resolved = resolved.replace(`:${key}`, encodeURIComponent(value));
  }
  return resolved;
}

/**
 * Endpoint registry.
 *
 * Keys are EndpointId strings matching the sdk-native-sdui vocabulary.
 * This will be replaced by codegen output in a future build step.
 */
export const endpointRegistry: Record<string, EndpointDefinition> = {
  // Auth
  // bootstrap predates the /v1/creator/* path convention and is absent from
  // the codegen'd catalog; the registry carries it until the creator-bff
  // OpenAPI spec covers it.
  'creator.auth.bootstrap': { method: 'GET', path: '/auth/bootstrap' },
  'auth.otp-init': { method: 'POST', path: '/v1/creator/auth/otp/init' },
  'auth.otp-verify': { method: 'POST', path: '/v1/creator/auth/otp/verify' },
  'auth.refresh': { method: 'POST', path: '/v1/creator/auth/sessions/refresh' },

  // Home
  'home.feed': { method: 'GET', path: '/v1/creator/home' },

  // Campaigns
  'campaigns.list': { method: 'GET', path: '/v1/creator/campaigns' },
  'campaigns.detail': { method: 'GET', path: '/v1/creator/campaigns/:id' },
  'campaigns.apply': { method: 'POST', path: '/v1/creator/campaigns/:id/apply' },

  // Partnerships
  'partnerships.list': { method: 'GET', path: '/v1/creator/partnerships' },
  'partnerships.detail': { method: 'GET', path: '/v1/creator/partnerships/:id' },

  // Earnings
  'earnings.summary': { method: 'GET', path: '/v1/creator/earnings' },
  'earnings.invoices': { method: 'GET', path: '/v1/creator/earnings/invoices' },
  'earnings.invoice-detail': { method: 'GET', path: '/v1/creator/earnings/invoices/:id' },

  // Profile
  'profile.get': { method: 'GET', path: '/v1/creator/profile' },
  'profile.update': { method: 'PATCH', path: '/v1/creator/profile' },

  // KYC
  'kyc.status': { method: 'GET', path: '/v1/creator/kyc' },
  'kyc.submit': { method: 'POST', path: '/v1/creator/kyc' },

  // Assets
  'assets.icons-manifest': { method: 'GET', path: '/v1/creator/assets/icons-manifest' },
  'assets.upload': { method: 'POST', path: '/v1/creator/assets/upload' },

  // Utility
  'utility.config': { method: 'GET', path: '/v1/creator/config' },
  'utility.notifications': { method: 'GET', path: '/v1/creator/notifications' },
};

/**
 * Look up an endpoint definition by its ID.
 * Throws if the endpoint is not registered.
 */
export function getEndpoint(endpointId: string): EndpointDefinition {
  const def = endpointRegistry[endpointId];
  if (def) return def;
  // The codegen'd `EndpointPaths` catalog fallback was removed with the
  // endpoint-id enum (addressable-surfaces, path-direct). Legacy ids not in the
  // hand-maintained map above are now hard errors — migrate the caller to
  // path-direct `bff_call` / `reload`.
  throw new Error(`[BFF] Unknown endpoint: "${endpointId}"`);
}
