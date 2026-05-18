// Client
export { createBffClient } from './client.js';
export type { BffClient, BffClientConfig, BffRequestOptions, BffResponse } from './client.js';

// Endpoint registry
export { endpointRegistry, getEndpoint, resolvePath } from './endpoint-registry.js';
export type { EndpointDefinition, HttpMethod } from './endpoint-registry.js';

// Header builders
export { buildHeaders, buildBaseHeaders, buildConditionalHeaders } from './header-builders.js';
export type { HeaderContext } from './header-builders.js';

// Interceptors
export {
  applyAuthHeaders,
  fetchWithRetry,
  BffError,
  throwOnError,
  networkError,
  extractOnLoadAction,
} from './interceptors/index.js';
export type {
  AuthInterceptorConfig,
  RetryConfig,
  BffErrorCode,
  OnLoadActionPayload,
  ActionDispatcher,
} from './interceptors/index.js';

// Hooks
export { useBffDocument, useBffAction, useBffMutation } from './hooks/index.js';
export type {
  UseBffDocumentOptions,
  UseBffActionOptions,
  UseBffActionResult,
  UseBffMutationOptions,
} from './hooks/index.js';
