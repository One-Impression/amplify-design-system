import { EndpointPaths } from "@one-impression/sdk-native-sdui";
import type { EndpointId } from "@one-impression/sdk-native-sdui";
import { isLocalhostBffUrl } from "../../../bff/is-localhost.js";
import { useDevConfigStore } from "../../../state/useDevConfigStore.js";
import { useActiveSocialStore } from "../../../state/useActiveSocialStore.js";
import type { ActionEngineConfig } from "../../types.js";

/**
 * Shared BFF request plumbing for the network action handlers (bff_call,
 * reload). Keeps endpoint-id → URL resolution and the standard header set
 * in one place so the handlers don't drift apart.
 */

/**
 * Resolves a logical endpoint id to a full request URL: looks up the path
 * template, substitutes path params, appends the query string. Throws loudly
 * on an unregistered id or an unsubstituted `{param}` rather than silently
 * constructing a wrong URL.
 */
export function resolveEndpointUrl(
  config: ActionEngineConfig,
  opts: {
    endpoint: EndpointId;
    path_params?: Record<string, string>;
    query_params?: Record<string, string>;
  },
): string {
  const path = EndpointPaths[opts.endpoint];
  if (!path) {
    throw new Error(`no path registered for endpoint id "${opts.endpoint}"`);
  }

  let endpointPath = path;
  if (opts.path_params) {
    for (const [key, value] of Object.entries(opts.path_params)) {
      endpointPath = endpointPath.replace(`{${key}}`, encodeURIComponent(value));
    }
  }

  const unsubstituted = endpointPath.match(/\{[^}]+\}/);
  if (unsubstituted) {
    throw new Error(
      `unsubstituted path param ${unsubstituted[0]} in "${path}" for endpoint "${opts.endpoint}"`,
    );
  }

  const base = config.bffBaseUrl.replace(/\/$/, "");
  let url = `${base}${endpointPath}`;
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
