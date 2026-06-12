import React from "react";
import { Platform, ToastAndroid } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  SduiRuntimeProvider,
  IconStoreProvider,
  applyNavigate,
} from "@one-impression/sdui-runtime";
import { PAGE_API_BASE_URL } from "./config";

// The runtime's BffClient base URL. Points at the same local fixture server the
// page loader uses, so any in-page `bff_call` action resolves against it too.
const BFF_BASE_URL = PAGE_API_BASE_URL;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: Infinity } },
});

// No-op telemetry — the playground only renders, it doesn't report.
const telemetryConfig = {
  emitter: {
    emit: (event: string, params?: Record<string, unknown>) => {
      // eslint-disable-next-line no-console
      console.log("[telemetry]", event, params ?? {});
    },
  },
};

// Stub auth — fixtures are static, no token needed. Returning null exercises
// the same code path a logged-out render would.
const authConfig = { getToken: (): string | null => null };

/**
 * The provider stack a real SDUI app mounts. Navigation is owned by the runtime
 * (`SduiNavigationHost`, rendered as children) — `onNavigate` just forwards the
 * navigate action into the runtime's native stack via `applyNavigate`.
 */
export function Providers({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <SduiRuntimeProvider
              bffConfig={{ baseUrl: BFF_BASE_URL }}
              authConfig={authConfig}
              telemetryConfig={telemetryConfig}
              onNavigate={(op, target, params) => {
                // eslint-disable-next-line no-console
                console.log("[navigate]", op, target, params ?? {});
                applyNavigate(op, target, params);
              }}
              onToast={(level, message) => {
                // eslint-disable-next-line no-console
                console.log("[toast]", level, message);
                if (Platform.OS === "android") {
                  ToastAndroid.show(message, ToastAndroid.SHORT);
                }
              }}
              onDeeplink={(url) =>
                // eslint-disable-next-line no-console
                console.log("[deeplink]", url)
              }
            >
              {/* Fetches the icon manifest (all 225 glyphs) from the fixture
                  server into MMKV; bundled essentials cover the first paint. */}
              <IconStoreProvider bffBaseUrl={BFF_BASE_URL} authToken={null}>
                {children}
              </IconStoreProvider>
            </SduiRuntimeProvider>
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
