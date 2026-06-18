import { isLocalhostBffUrl } from "../../../bff/is-localhost.js";
import { useDevConfigStore } from "../../../state/useDevConfigStore.js";
import { useActiveSocialStore } from "../../../state/useActiveSocialStore.js";
import type { ActionEngineConfig } from "../../types.js";

/**
 * Shared BFF request plumbing for the network action handlers (bff_call,
 * reload). Keeps path → URL construction and the standard header set in one
 * place so the handlers don't drift apart.
 *
 * **Path-direct only — no frontend endpoint-id registry.** Actions carry the
 * concrete request `path` the BFF emits (e.g. `/v1/creator/campaigns/:id/apply`)
 * and the runtime fetches `bffBaseUrl + path` verbatim. The old
 * `EndpointPaths` / `resolveEndpointUrl` id→path lookup is gone (the enum was
 * deleted from `@one-impression/sdk-native-sdui`): coupling a new endpoint to a
 * frontend release was the anti-pattern this removes.
 */

/**
 * Builds a full request URL from a path-direct `path`: substitutes `{param}` /
 * `:param` placeholders from `path_params`, appends the query string. Throws
 * loudly on a missing path or an unsubstituted placeholder rather than silently
 * constructing a wrong URL.
 */
export function resolveRequestUrl(
  config: ActionEngineConfig,
  opts: {
    path: string;
    path_params?: Record<string, string>;
    query_params?: Record<string, string>;
  },
): string {
  if (!opts.path) {
    throw new Error(
      "bff request requires a `path` (path-direct); no client-side endpoint registry exists",
    );
  }

  let requestPath = opts.path;
  if (opts.path_params) {
    for (const [key, value] of Object.entries(opts.path_params)) {
      // Support both `{param}` (legacy templates) and `:param` (path-direct).
      requestPath = requestPath
        .replace(`{${key}}`, encodeURIComponent(value))
        .replace(`:${key}`, encodeURIComponent(value));
    }
  }

  const unsubstituted = requestPath.match(/\{[^}]+\}|:[A-Za-z_][A-Za-z0-9_]*/);
  if (unsubstituted) {
    throw new Error(
      `unsubstituted path param ${unsubstituted[0]} in "${opts.path}"`,
    );
  }

  const base = config.bffBaseUrl.replace(/\/$/, "");
  let url = `${base}${requestPath}`;
  if (opts.query_params) {
    const qs = new URLSearchParams(opts.query_params).toString();
    if (qs) url += `?${qs}`;
  }
  return url;
}

/**
 * Builds the standard BFF request headers: Content-Type, bearer auth, the
 * dev-only X-Dev-Identity (localhost-gated), and the active-social
 * X-Active-Influencer-Id (all environments). Handlers add request-specific
 * headers (e.g. Idempotency-Key) on top.
 */
export function buildBffHeaders(config: ActionEngineConfig): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = config.authToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Dev-only: inject X-Dev-Identity for requests against a local BFF
  // (localhost / 127.0.0.1). Production traffic is never augmented even if the
  // value happens to be populated.
  if (isLocalhostBffUrl(config.bffBaseUrl)) {
    const devIdentity = useDevConfigStore.getState().devIdentity;
    if (devIdentity) {
      headers["X-Dev-Identity"] = devIdentity;
    }
  }

  // Active social context: scopes every BFF read to the influencer the creator
  // is currently acting as. NOT localhost-gated — ships on every environment.
  // Omitted when no active selection is set (server falls back to its default
  // scoping for the authenticated creator).
  const activeInfluencerId = useActiveSocialStore.getState().activeInfluencerId;
  if (activeInfluencerId) {
    headers["X-Active-Influencer-Id"] = activeInfluencerId;
  }

  return headers;
}
