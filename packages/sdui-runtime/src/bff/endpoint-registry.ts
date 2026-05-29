/**
 * endpoint-registry — maps EndpointId strings to concrete HTTP
 * method + path templates.
 *
 * Three sources are merged here:
 *
 * 1. **Legacy short keys** (`home.feed`, `auth.otp-init`, ...) — kept for
 *    the bootstrap / splash / auth flows that haven't been migrated to
 *    the dotted contract yet.
 * 2. **`EndpointPaths` from `@one-impression/sdk-native-sdui`** — the
 *    codegen'd, contract-owned `creator.*` IDs. These are the dotted
 *    names the BFF emits on `navigate { target }` and are the source of
 *    truth. All registered as `GET` (navigate targets are always GETs).
 * 3. **Gateway-specific aliases** — the gateway's auto-generated
 *    `endpoints.generated.ts` currently labels a couple of `GET :id`
 *    endpoints `byId` (e.g. `creator.campaigns.byId`) while the SDK
 *    contract labels the same path `detail`. The aliases here let the
 *    runtime resolve either name to the same path until the gateway's
 *    codegen is realigned.
 *
 * `bff_call` actions resolve endpoints through the sdk's `EndpointPaths`
 * directly (see `action-engine/handlers/bff-call.ts`); only page-level
 * fetches go through this registry via `useBffDocument` / `getEndpoint`.
 */

import { EndpointPaths } from '@one-impression/sdk-native-sdui';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface EndpointDefinition {
  method: HttpMethod;
  /** Path template — accepts both `:param` and `{param}` placeholders. */
  path: string;
}

/**
 * Resolve path template params. Accepts both `:key` (registry-native) and
 * `{key}` (sdk-native-sdui EndpointPaths) placeholder syntaxes so the same
 * `resolvePath` works regardless of which source the path came from.
 *
 * @example
 * resolvePath('/v1/campaigns/:id', { id: '123' })   // => '/v1/campaigns/123'
 * resolvePath('/v1/campaigns/{id}', { id: '123' })  // => '/v1/campaigns/123'
 */
export function resolvePath(
  template: string,
  params?: Record<string, string>,
): string {
  if (!params) return template;
  let resolved = template;
  for (const [key, value] of Object.entries(params)) {
    const encoded = encodeURIComponent(value);
    resolved = resolved.replace(`:${key}`, encoded);
    resolved = resolved.replace(`{${key}}`, encoded);
  }
  return resolved;
}

/**
 * Legacy short-key registrations that predate the dotted SDK contract.
 * Kept for the splash / bootstrap / auth flows that still emit them.
 */
const legacyShortKeys: Record<string, EndpointDefinition> = {
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
 * Dotted contract IDs from sdk-native-sdui. Every entry is a navigate /
 * page-fetch endpoint so default to `GET`; the few endpoints in
 * `EndpointPaths` that the BFF only ever calls as POST/PATCH (bootstrap,
 * mutations, etc.) flow through `bff_call` and never hit this registry.
 */
const dottedContractIds: Record<string, EndpointDefinition> = Object.fromEntries(
  Object.entries(EndpointPaths).map(([id, path]) => [
    id,
    { method: 'GET' as const, path },
  ]),
);

/**
 * Gateway-specific aliases. The gateway's auto-generated endpoints map
 * uses `byId` where the SDK contract uses `detail`; until codegen is
 * realigned, mirror each `*.detail` entry to its `*.byId` twin.
 */
const gatewayAliases: Record<string, EndpointDefinition> = {
  'creator.campaigns.byId': {
    method: 'GET',
    path: EndpointPaths['creator.campaigns.detail'],
  },
  'creator.partnerships.byId': {
    method: 'GET',
    path: EndpointPaths['creator.partnerships.detail'],
  },
};

/**
 * Merged endpoint registry. Order matters when keys collide: gateway
 * aliases override dotted contract IDs override legacy short keys.
 */
export const endpointRegistry: Record<string, EndpointDefinition> = {
  ...legacyShortKeys,
  ...dottedContractIds,
  ...gatewayAliases,
};

/**
 * Look up an endpoint definition by its ID.
 * Throws if the endpoint is not registered.
 */
export function getEndpoint(endpointId: string): EndpointDefinition {
  const def = endpointRegistry[endpointId];
  if (!def) {
    throw new Error(`[BFF] Unknown endpoint: "${endpointId}"`);
  }
  return def;
}
