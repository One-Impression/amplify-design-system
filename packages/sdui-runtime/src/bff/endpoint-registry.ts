import { EndpointPaths } from '@one-impression/sdk-native-sdui';
/**
 * endpoint-registry — maps EndpointId strings to concrete HTTP
 * method + path templates.
 *
 * The EndpointId type comes from @one-impression/sdk-native-sdui. The
 * registry is used by the BFF client to resolve an endpoint identifier
 * (as received in SDUI action payloads) to a fetchable URL.
 *
 * In production this will be code-generated from the creator-bff
 * OpenAPI spec (amplify-schemas task 003). For now, this is a manually
 * maintained registry covering the core endpoints.
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

  // Fall back to the codegen'd catalog from the contracts package
  // (EndpointPaths is generated from the creator-bff OpenAPI spec and
  // covers the full endpoint surface). The catalog carries paths only,
  // so non-GET endpoints that documents fetch directly must keep an
  // explicit method entry in endpointRegistry above.
  const catalogPath = (EndpointPaths as Record<string, string>)[endpointId];
  if (catalogPath) {
    return { method: 'GET', path: catalogPath };
  }
  throw new Error(`[BFF] Unknown endpoint: "${endpointId}"`);
}
