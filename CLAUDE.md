

## Feature Flags (`@amplify/feature-flags`)

## Feature Flags (`@amplify/feature-flags`)

Package: `packages/feature-flags`

Provides a feature flag client, React context provider, hooks, and a gate component for the Amplify platform.

### Core Client

```ts
import { FeatureFlagClient } from '@amplify/feature-flags';

const client = new FeatureFlagClient({ apiKey: 'YOUR_KEY' });
const enabled = await client.isEnabled('my-flag', { userId: 'u123', scope: 'web' });
```

- **API endpoint:** `https://atmosphere.amplify.club/api/feature-flags` (default, overridable via `apiUrl`)
- **Auth:** `x-api-key` request header
- **Cache TTL:** 30 minutes (default, overridable via `cacheTtlMs`)
- **Concurrent requests:** deduplicated — only one in-flight fetch at a time
- **Fail-open:** on fetch error or unknown flag, returns `true` (feature enabled)

### Flag Evaluation Rules (in order)

1. Flag not found → `true` (fail-open)
2. `flag.enabled === false` → `false`
3. Flag has `scopes` and `context.scope` is provided but not in list → `false`
4. `rollout_percentage >= 100` → `true`
5. `rollout_percentage <= 0` → `false`
6. `userId` provided → deterministic MurmurHash3 bucket check (`hash(userId:flagId) % 100 < rollout_percentage`)
7. No `userId` → `true` (anonymous users get the flag)

### React Integration

Import from the `/react` subpath:

```tsx
import {
  FeatureFlagProvider,
  useFeatureFlag,
  useFeatureFlags,
  FeatureFlagGate,
} from '@amplify/feature-flags/react';
```

**Provider** — wrap your app (requires `apiKey`):

```tsx
<FeatureFlagProvider apiKey="YOUR_KEY" context={{ userId: 'u123' }}>
  {children}
</FeatureFlagProvider>
```

**Hooks:**

| Hook | Returns | Notes |
|------|---------|-------|
| `useFeatureFlag(flagId, context?)` | `{ enabled: boolean, loading: boolean }` | `enabled` is `false` while loading |
| `useFeatureFlags()` | `{ flags, loading, error, refetch }` | All flags + manual refetch |

**Gate component** — renders children only when flag is enabled:

```tsx
<FeatureFlagGate flag="new-dashboard" fallback={<OldDashboard />}>
  <NewDashboard />
</FeatureFlagGate>
```

While loading, renders `fallback` (or nothing). Unknown flags render children (fail-open). Compatible with React web and React Native.

### Cache Management

```ts
client.invalidateCache();   // force fresh fetch on next call
client.getCachedFlags();    // read current cache without fetching
```

### Peer Dependencies

- `react >= 17.0.0` (required for React integration; core client has no React dependency)

