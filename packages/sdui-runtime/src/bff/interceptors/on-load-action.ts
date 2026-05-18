/**
 * on-load-action interceptor — extracts legacy onLoadAction from BFF
 * responses and dispatches them to the action engine.
 *
 * Some legacy BFF endpoints include an `onLoadAction` field at the top
 * level of the response. This interceptor extracts it, dispatches it
 * to the action engine, and returns the response without the field so
 * that renderers don't see it.
 */

/** Minimal action shape expected in onLoadAction payloads. */
export interface OnLoadActionPayload {
  type: string;
  payload?: Record<string, unknown>;
}

/** Callback to dispatch an extracted action to the action engine. */
export type ActionDispatcher = (action: OnLoadActionPayload) => void;

/**
 * Extract and dispatch onLoadAction from a parsed BFF response body.
 *
 * @param body     - The parsed JSON response body
 * @param dispatch - Callback to dispatch the action
 * @returns The body with onLoadAction removed (if it was present)
 */
export function extractOnLoadAction<T extends Record<string, unknown>>(
  body: T,
  dispatch: ActionDispatcher,
): Omit<T, 'onLoadAction'> {
  if (!('onLoadAction' in body) || !body.onLoadAction) {
    return body;
  }

  const action = body.onLoadAction as OnLoadActionPayload;

  // Dispatch asynchronously so it doesn't block the response chain
  try {
    dispatch(action);
  } catch (err) {
    if (__DEV__) {
      console.warn('[BFF] onLoadAction dispatch failed:', err);
    }
  }

  // Return body without the onLoadAction field
  const { onLoadAction: _, ...rest } = body;
  return rest as Omit<T, 'onLoadAction'>;
}
