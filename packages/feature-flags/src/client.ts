// ─── Types ───────────────────────────────────────────────────────────────────

export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  rollout_percentage: number;
  scopes?: string[];
  metadata?: Record<string, unknown>;
}

export interface FlagEvaluationContext {
  userId?: string;
  scope?: string;
}

export interface FeatureFlagClientOptions {
  apiUrl?: string;
  apiKey: string;
  cacheTtlMs?: number;
}

// ─── MurmurHash3 (32-bit) ───────────────────────────────────────────────────

/**
 * MurmurHash3 32-bit implementation.
 * Produces a deterministic unsigned 32-bit hash for a given string + seed.
 */
function murmurhash3(key: string, seed: number = 0): number {
  let h = seed >>> 0;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;

  let i = 0;
  const len = key.length;
  const remainder = len % 4;
  const bytes = len - remainder;

  while (i < bytes) {
    let k =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(i + 1) & 0xff) << 8) |
      ((key.charCodeAt(i + 2) & 0xff) << 16) |
      ((key.charCodeAt(i + 3) & 0xff) << 24);

    k = Math.imul(k, c1);
    k = (k << 15) | (k >>> 17);
    k = Math.imul(k, c2);

    h ^= k;
    h = (h << 13) | (h >>> 19);
    h = Math.imul(h, 5) + 0xe6546b64;

    i += 4;
  }

  let k = 0;
  switch (remainder) {
    case 3:
      k ^= (key.charCodeAt(i + 2) & 0xff) << 16;
    // falls through
    case 2:
      k ^= (key.charCodeAt(i + 1) & 0xff) << 8;
    // falls through
    case 1:
      k ^= key.charCodeAt(i) & 0xff;
      k = Math.imul(k, c1);
      k = (k << 15) | (k >>> 17);
      k = Math.imul(k, c2);
      h ^= k;
  }

  h ^= len;

  // Finalization mix
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;

  return h >>> 0;
}

// ─── Cache ───────────────────────────────────────────────────────────────────

interface CacheEntry {
  flags: FeatureFlag[];
  fetchedAt: number;
}

// ─── Client ──────────────────────────────────────────────────────────────────

const DEFAULT_API_URL =
  'https://atmosphere.amplify.club/api/feature-flags';
const DEFAULT_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export class FeatureFlagClient {
  private apiUrl: string;
  private apiKey: string;
  private cacheTtlMs: number;
  private cache: CacheEntry | null = null;
  private inflight: Promise<FeatureFlag[]> | null = null;

  constructor(options: FeatureFlagClientOptions) {
    this.apiUrl = options.apiUrl ?? DEFAULT_API_URL;
    this.apiKey = options.apiKey;
    this.cacheTtlMs = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
  }

  // ── Fetch ────────────────────────────────────────────────────────────────

  /**
   * Fetches flags from the API, with TTL-based caching.
   * Deduplicates concurrent requests.
   * Fail-open: returns empty array (all flags evaluate to true) on error.
   */
  async fetchFlags(): Promise<FeatureFlag[]> {
    const now = Date.now();

    if (this.cache && now - this.cache.fetchedAt < this.cacheTtlMs) {
      return this.cache.flags;
    }

    if (this.inflight) {
      return this.inflight;
    }

    this.inflight = this._doFetch(now);

    try {
      return await this.inflight;
    } finally {
      this.inflight = null;
    }
  }

  private async _doFetch(now: number): Promise<FeatureFlag[]> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(
          `[FeatureFlags] API returned ${response.status}, failing open`
        );
        return this.cache?.flags ?? [];
      }

      const data = await response.json();
      const flags: FeatureFlag[] = data.flags ?? data;

      this.cache = { flags, fetchedAt: now };
      return flags;
    } catch (err) {
      // Fail-open: if API is unreachable, return cached or empty
      console.warn('[FeatureFlags] Fetch failed, failing open:', err);
      return this.cache?.flags ?? [];
    }
  }

  // ── Evaluation ───────────────────────────────────────────────────────────

  /**
   * Evaluates whether a flag is enabled for the given context.
   *
   * Rules:
   * 1. If flag not found (or fetch failed with empty cache) -> true (fail-open)
   * 2. If flag.enabled is false -> false
   * 3. If flag has scopes and context.scope doesn't match -> false
   * 4. If rollout_percentage is 100 -> true
   * 5. If rollout_percentage is 0 -> false
   * 6. If userId provided: hash-based deterministic rollout
   * 7. If no userId: treat as 100% (enabled for anonymous)
   */
  async isEnabled(
    flagId: string,
    context: FlagEvaluationContext = {}
  ): Promise<boolean> {
    const flags = await this.fetchFlags();

    const flag = flags.find((f) => f.id === flagId);

    // Fail-open: unknown flags are enabled
    if (!flag) return true;

    // Master kill switch
    if (!flag.enabled) return false;

    // Scope check
    if (flag.scopes && flag.scopes.length > 0 && context.scope) {
      if (!flag.scopes.includes(context.scope)) return false;
    }

    // Rollout percentage
    const pct = flag.rollout_percentage;
    if (pct >= 100) return true;
    if (pct <= 0) return false;

    // Hash-based rollout (deterministic per user+flag)
    if (context.userId) {
      const hash = murmurhash3(`${context.userId}:${flagId}`);
      const bucket = hash % 100;
      return bucket < pct;
    }

    // No userId: treat as enabled (anonymous users get the flag)
    return true;
  }

  // ── Utilities ────────────────────────────────────────────────────────────

  /** Invalidate the cache, forcing a fresh fetch on next call. */
  invalidateCache(): void {
    this.cache = null;
  }

  /** Get all cached flags (returns empty array if not yet fetched). */
  getCachedFlags(): FeatureFlag[] {
    return this.cache?.flags ?? [];
  }
}
