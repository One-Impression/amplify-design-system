/**
 * useBffDocument — TanStack Query wrapper for fetching SDUI documents
 * from BFF endpoints.
 *
 * Uses staleTime=30s for stale-while-revalidate: the first render
 * returns cached data instantly, and a background refetch fires if
 * the data is older than 30 seconds.
 */
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import type { BffClient, BffRequestOptions } from '../client.js';

/** Default stale time: 30 seconds. */
const DEFAULT_STALE_TIME = 30_000;

export interface UseBffDocumentOptions<T = unknown>
  extends Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'> {
  /** BFF client instance. */
  client: BffClient;
  /** Endpoint ID from the endpoint registry. */
  endpointId: string;
  /** Request options (params, query, etc). */
  requestOptions?: BffRequestOptions;
  /** Whether the query is enabled. Default: true. */
  enabled?: boolean;
}

/**
 * Fetch an SDUI document from a BFF endpoint with caching.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useBffDocument({
 *   client: bffClient,
 *   endpointId: 'home.feed',
 * });
 * ```
 */
export function useBffDocument<T = unknown>(
  options: UseBffDocumentOptions<T>,
): UseQueryResult<T, Error> {
  const {
    client,
    endpointId,
    requestOptions,
    enabled = true,
    staleTime = DEFAULT_STALE_TIME,
    ...queryOptions
  } = options;

  return useQuery<T, Error>({
    queryKey: [
      'bff-document',
      endpointId,
      requestOptions?.params,
      requestOptions?.query,
    ],
    queryFn: async ({ signal }) => {
      const response = await client.request<T>(endpointId, {
        ...requestOptions,
        signal,
      });
      return response.data;
    },
    enabled,
    staleTime,
    ...queryOptions,
  });
}
