import {
  AuthStorePayloadSchema,
  AuthRefreshPayloadSchema,
  AuthClearPayloadSchema,
} from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";

const JWT_KEY = "sdui_auth_jwt";
const REFRESH_KEY = "sdui_auth_refresh_token";

/**
 * auth.store / auth.refresh / auth.clear — secure token management
 * using expo-secure-store. The action type suffix determines the sub-operation.
 */
export async function handleAuth(
  action: Action,
  config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const capType = action.type.replace(/^capability:/, "");

  switch (capType) {
    case "auth.store":
      return storeTokens(action);
    case "auth.refresh":
      return refreshTokens(action, config);
    case "auth.clear":
      return clearTokens(action);
    default:
      return { error: `unknown auth sub-operation: ${capType}` };
  }
}

async function storeTokens(
  action: Action,
): Promise<{ success?: unknown; error?: string }> {
  const payload = AuthStorePayloadSchema.parse(action.payload);

  try {
    const SecureStore = await import("expo-secure-store");
    await SecureStore.setItemAsync(JWT_KEY, payload.jwt);
    if (payload.refresh_token) {
      await SecureStore.setItemAsync(REFRESH_KEY, payload.refresh_token);
    }
    return { success: {} };
  } catch {
    return { error: "storage_failed" };
  }
}

async function refreshTokens(
  action: Action,
  config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const payload = AuthRefreshPayloadSchema.parse(action.payload);

  try {
    const response = await fetch(`${config.bffBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: payload.refresh_token }),
    });

    if (!response.ok) {
      return { error: response.status === 401 ? "invalid_refresh" : "network_failed" };
    }

    const data = await response.json();
    const SecureStore = await import("expo-secure-store");
    await SecureStore.setItemAsync(JWT_KEY, data.jwt);
    await SecureStore.setItemAsync(REFRESH_KEY, data.refresh_token);

    return {
      success: {
        jwt: data.jwt,
        refresh_token: data.refresh_token,
      },
    };
  } catch {
    return { error: "network_failed" };
  }
}

async function clearTokens(
  action: Action,
): Promise<{ success?: unknown; error?: string }> {
  AuthClearPayloadSchema.parse(action.payload);

  try {
    const SecureStore = await import("expo-secure-store");
    await SecureStore.deleteItemAsync(JWT_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    return { success: {} };
  } catch {
    return { error: "storage_failed" };
  }
}
