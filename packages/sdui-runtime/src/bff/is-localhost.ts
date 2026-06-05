/**
 * True when the BFF base URL points at a local development server.
 * Gates dev-only behaviour (X-Dev-Identity header injection) so it can
 * never activate against staging or production hosts.
 */
export function isLocalhostBffUrl(bffBaseUrl: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1|10\.0\.2\.2)(:\d+)?(\/|$)/.test(
    bffBaseUrl,
  );
}
