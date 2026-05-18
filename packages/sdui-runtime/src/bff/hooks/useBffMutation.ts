/**
 * useBffMutation — TanStack mutation wrapper for POST/PATCH/PUT BFF calls.
 *
 * Wraps useMutation for write operations (apply to campaign, update profile,
 * submit KYC, etc). Automatically generates idempotency keys for POST/PUT
 * requests to prevent duplicate submissions.
 */
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { BffClient, BffRequestOptions, BffResponse } from '../client.js';
import type { BffError } from '../interceptors/error.js';

export interface UseBffMutationOptions<TData = unknown, TVariables = unknown>
  extends Omit<
    UseMutationOptions<BffResponse<TData>, BffError, TVariables>,
    'mutationFn'
  > {
  /** BFF client instance. */
  client: BffClient;
  /** Endpoint ID from the endpoint registry. */
  endpointId: string;
  /** Static request options (params, headers, etc). */
  requestOptions?: Omit<BffRequestOptions, 'body'>;
  /**
   * Query keys to invalidate on success.
   * Useful for refetching related data after a mutation.
   */
  invalidateKeys?: unknown[][];
  /** Whether to auto-generate an idempotency key. Default: true for POST/PUT. */
  autoIdempotencyKey?: boolean;
}

/**
 * Generate a unique idempotency key.
 * Uses crypto.randomUUID when available, falls back to timestamp + random.
 */
function generateIdempotencyKey(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * TanStack mutation wrapper for BFF write operations.
 *
 * @example
 * ```tsx
 * const mutation = useBffMutation({
 *   client: bffClient,
 *   endpointId: 'campaigns.apply',
 *   requestOptions: { params: { id: campaignId } },
 *   invalidateKeys: [['bff-document', 'campaigns.list']],
 * });
 *
 * // In an onPress handler:
 * mutation.mutate({ coverLetter: 'I would love to...' });
 * ```
 */
export function useBffMutation<TData = unknown, TVariables = unknown>(
  options: UseBffMutationOptions<TData, TVariables>,
): UseMutationResult<BffResponse<TData>, BffError, TVariables> {
  const {
    client,
    endpointId,
    requestOptions,
    invalidateKeys,
    autoIdempotencyKey = true,
    onSuccess,
    ...mutationOptions
  } = options;

  const queryClient = useQueryClient();

  return useMutation<BffResponse<TData>, BffError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const idempotencyKey =
        autoIdempotencyKey && !requestOptions?.idempotencyKey
          ? generateIdempotencyKey()
          : requestOptions?.idempotencyKey;

      return client.request<TData>(endpointId, {
        ...requestOptions,
        body: variables,
        idempotencyKey,
      });
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries on success
      if (invalidateKeys) {
        for (const key of invalidateKeys) {
          queryClient.invalidateQueries({ queryKey: key });
        }
      }

      // Call user-provided onSuccess
      onSuccess?.(data, variables, context);
    },
    ...mutationOptions,
  });
}
