import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  FeatureFlagClient,
  type FeatureFlag,
  type FlagEvaluationContext,
} from './client';

// ─── Context ─────────────────────────────────────────────────────────────────

interface FeatureFlagContextValue {
  client: FeatureFlagClient;
  flags: FeatureFlag[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export interface FeatureFlagProviderProps {
  /** API endpoint for fetching flags */
  apiUrl?: string;
  /** API key sent as x-api-key header */
  apiKey: string;
  /** Cache TTL in milliseconds (default: 30 minutes) */
  cacheTtlMs?: number;
  /** User context applied to all flag evaluations */
  context?: FlagEvaluationContext;
  children: ReactNode;
}

export function FeatureFlagProvider({
  apiUrl,
  apiKey,
  cacheTtlMs,
  context,
  children,
}: FeatureFlagProviderProps) {
  const client = useMemo(
    () => new FeatureFlagClient({ apiUrl, apiKey, cacheTtlMs }),
    [apiUrl, apiKey, cacheTtlMs]
  );

  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFlags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await client.fetchFlags();
      setFlags(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const value = useMemo<FeatureFlagContextValue>(
    () => ({ client, flags, loading, error, refetch: fetchFlags }),
    [client, flags, loading, error, fetchFlags]
  );

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

// ─── Internal helper ─────────────────────────────────────────────────────────

function useFeatureFlagContext(): FeatureFlagContextValue {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) {
    throw new Error(
      'useFeatureFlag* hooks must be used within a <FeatureFlagProvider>'
    );
  }
  return ctx;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export interface UseFeatureFlagResult {
  /** Whether the flag is enabled for the current context */
  enabled: boolean;
  /** Whether flags are still being fetched */
  loading: boolean;
}

/**
 * Evaluate a single feature flag.
 *
 * While flags are loading, `enabled` defaults to `false` and `loading` is `true`.
 * If the flag is unknown (not returned by API), it evaluates to `true` (fail-open).
 */
export function useFeatureFlag(
  flagId: string,
  context?: FlagEvaluationContext
): UseFeatureFlagResult {
  const { flags, loading } = useFeatureFlagContext();

  const enabled = useMemo(() => {
    if (loading) return false;

    const flag = flags.find((f) => f.id === flagId);

    // Fail-open: unknown flags are enabled
    if (!flag) return true;

    if (!flag.enabled) return false;

    // Scope check
    if (flag.scopes && flag.scopes.length > 0 && context?.scope) {
      if (!flag.scopes.includes(context.scope)) return false;
    }

    const pct = flag.rollout_percentage;
    if (pct >= 100) return true;
    if (pct <= 0) return false;

    // Hash-based rollout
    if (context?.userId) {
      const hash = murmurhash3Sync(`${context.userId}:${flagId}`);
      const bucket = hash % 100;
      return bucket < pct;
    }

    return true;
  }, [flags, loading, flagId, context?.userId, context?.scope]);

  return { enabled, loading };
}

/**
 * Get all fetched flags and loading state.
 */
export function useFeatureFlags(): {
  flags: FeatureFlag[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const { flags, loading, error, refetch } = useFeatureFlagContext();
  return { flags, loading, error, refetch };
}

// ─── Gate Component ──────────────────────────────────────────────────────────

export interface FeatureFlagGateProps {
  /** The flag ID to evaluate */
  flag: string;
  /** Optional evaluation context (userId, scope) */
  context?: FlagEvaluationContext;
  /** Content to render when flag is enabled */
  children: ReactNode;
  /** Optional fallback when flag is disabled */
  fallback?: ReactNode;
}

/**
 * Conditionally render children based on a feature flag.
 *
 * While loading, renders nothing (or fallback if provided).
 * If the flag is unknown, renders children (fail-open).
 *
 * Works in both React web and React Native -- no DOM-specific code.
 */
export function FeatureFlagGate({
  flag,
  context,
  children,
  fallback = null,
}: FeatureFlagGateProps) {
  const { enabled, loading } = useFeatureFlag(flag, context);

  if (loading) return <>{fallback}</>;
  if (!enabled) return <>{fallback}</>;

  return <>{children}</>;
}

// ─── Inline murmurhash3 (synchronous, for hook usage) ────────────────────────

function murmurhash3Sync(key: string, seed: number = 0): number {
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
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;

  return h >>> 0;
}
