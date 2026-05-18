/**
 * useBffAction — TanStack Query wrapper for action-triggered BFF calls.
 *
 * Unlike useBffDocument (which fetches on mount), useBffAction is used
 * for reads triggered by user actions (e.g. "load more", "refresh section").
 * It still uses useQuery under the hood but is disabled by default and
 * refetched on demand.
 */
import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import type { BffClient, BffRequestOptions } from '../client.js';

/** Default stale time: 30 seconds (same as useBffDocument). */
const DEFAULT_STALE_TIME = 30_000;

export interface UseBffActionOptions<T = unknown>
  extends Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'> {
  /** BFF client instance. */
  client: BffClient;
  /** Endpoint ID from the endpoint registry. */
  endpointId: string;
  /** Request options (params, query, etc). */
  requestOptions?: BffRequestOptions;
}

export interface UseBffActionResult<T = unknown> {
  /** The query result (data, loading state, error). */
  query: UseQueryResult<T, Error>;
  /** Trigger a fetch / refetch of this action. */
  execute: () => void;
  /** Invalidate cached data for this action. */
  invalidate: () => void;
}

/**
 * Query wrapper for action-triggered BFF calls.
 *
 * @example
 * ```tsx
 * const { query, execute } = useBffAction({
 *   client: bffClient,
 *   endpointId: 'campaigns.detail',
 *   requestOptions: { params: { id: campaignId } },
 * });
 *
 * // In an onPress handler:
 * execute();
 * ```
 */
export function useBffAction<T = unknown>(
  options: UseBffActionOptions<T>,
): UseBffActionResult<T> {
  const {
    client,
    endpointId,
    requestOptions,
    staleTime = DEFAULT_STALE_TIME,
    ...queryOptions
  } = options;

  const queryClient = useQueryClient();

  const queryKey = [
    'bff-action',
    endpointId,
    requestOptions?.params,
    requestOptions?.query,
  ];

  const query = useQuery<T, Error>({
    queryKey,
    queryFn: async ({ signal }) => {
      const response = await client.request<T>(endpointId, {
        ...requestOptions,
        signal,
      });
      return response.data;
    },
    enabled: false, // Only fetches on demand
    staleTime,
    ...queryOptions,
  });

  const execute = useCallback(() => {
    query.refetch();
  }, [query]);

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return { query, execute, invalidate };
}
