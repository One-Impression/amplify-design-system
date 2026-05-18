/**
 * header-builders — functions to build the required + conditional
 * header set for each BFF request.
 *
 * Every request includes auth + platform headers. Conditional headers
 * (idempotency, UTM, content-type) are added based on request context.
 */
import { Platform } from 'react-native';

export interface HeaderContext {
  /** Bearer JWT token. */
  authToken: string | null;
  /** App version string (e.g. "6.0.0"). */
  appVersion: string;
  /** Optional idempotency key for mutation requests. */
  idempotencyKey?: string;
  /** Optional UTM parameters for attribution tracking. */
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

/**
 * Build the base headers required for every BFF request.
 */
export function buildBaseHeaders(ctx: HeaderContext): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Platform': Platform.OS,
    'X-Version': ctx.appVersion,
  };

  if (ctx.authToken) {
    headers.Authorization = `Bearer ${ctx.authToken}`;
  }

  return headers;
}

/**
 * Build conditional headers that are only present on certain requests.
 */
export function buildConditionalHeaders(ctx: HeaderContext): Record<string, string> {
  const headers: Record<string, string> = {};

  if (ctx.idempotencyKey) {
    headers['Idempotency-Key'] = ctx.idempotencyKey;
  }

  if (ctx.utm?.source) {
    headers['X-UTM-Source'] = ctx.utm.source;
  }
  if (ctx.utm?.medium) {
    headers['X-UTM-Medium'] = ctx.utm.medium;
  }
  if (ctx.utm?.campaign) {
    headers['X-UTM-Campaign'] = ctx.utm.campaign;
  }

  return headers;
}

/**
 * Build the complete header set for a BFF request.
 */
export function buildHeaders(ctx: HeaderContext): Record<string, string> {
  return {
    ...buildBaseHeaders(ctx),
    ...buildConditionalHeaders(ctx),
  };
}
