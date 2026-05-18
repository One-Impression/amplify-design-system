import React, { useCallback, useEffect, useRef } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import type {
  WebViewNavigation,
  ShouldStartLoadRequest,
} from "react-native-webview/lib/WebViewTypes";
import type { Page, Action } from "@one-impression/sdk-native-sdui";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useAppStateSession } from "../../hooks/useAppStateSession.js";

interface PageProps {
  page: Page;
}

interface UrlPattern {
  pattern: string;
  action: string;
}

interface WebViewActionPageData {
  url: string;
  url_patterns?: UrlPattern[];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

/**
 * Checks whether a URL matches any of the configured patterns.
 * Returns the action string to dispatch if a match is found, otherwise null.
 */
function matchUrlPattern(
  url: string,
  patterns: UrlPattern[],
): string | null {
  for (const entry of patterns) {
    try {
      const regex = new RegExp(entry.pattern);
      if (regex.test(url)) {
        return entry.action;
      }
    } catch {
      // Invalid regex — skip this pattern silently.
      // In production the BFF should always send valid patterns,
      // but we guard against malformed data defensively.
    }
  }
  return null;
}

/**
 * WebView page with URL-pattern action routing.
 * Legacy equivalent: WebViewPageType2.
 *
 * Renders a WebView and intercepts navigation requests. For each URL the
 * WebView attempts to load, checks against page.data.url_patterns:
 * - If a pattern matches, the navigation is blocked and the corresponding
 *   action is dispatched via the action engine.
 * - Otherwise, normal WebView navigation proceeds.
 *
 * Used for payment flows, OAuth callbacks, and third-party forms where
 * specific redirect URLs need to trigger native actions.
 */
export function WebViewPageWithActionRenderer({
  page,
}: PageProps): React.ReactElement {
  const actionEngine = useActionEngine();
  const webViewRef = useRef<WebView>(null);

  const pageData = page.data as WebViewActionPageData | undefined;
  const url = pageData?.url ?? "";
  const urlPatterns = pageData?.url_patterns ?? [];

  // Page lifecycle: on_load / on_dismount
  useEffect(() => {
    if (page.on_load) actionEngine.dispatch(page.on_load);
    return () => {
      if (page.on_dismount) actionEngine.dispatch(page.on_dismount);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // App foreground / background triggers
  useAppStateSession(page.on_app_foreground, page.on_app_background);

  // Hardware back-press handler (Android)
  useEffect(() => {
    if (!page.on_back_press) return;
    const handler = () => {
      actionEngine.dispatch(page.on_back_press!);
      return true;
    };
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handler,
    );
    return () => subscription.remove();
  }, [actionEngine, page.on_back_press]);

  /**
   * Intercept navigation before it starts (iOS + Android).
   * If the URL matches a pattern, block the navigation and dispatch the action.
   */
  const handleShouldStartLoad = useCallback(
    (request: ShouldStartLoadRequest): boolean => {
      if (urlPatterns.length === 0) return true;

      const matchedAction = matchUrlPattern(request.url, urlPatterns);
      if (matchedAction) {
        // Dispatch the action string as an Action object.
        // The BFF sends the action as a serialized string that the
        // action engine knows how to parse and execute.
        try {
          const parsed = JSON.parse(matchedAction) as Action;
          actionEngine.dispatch(parsed);
        } catch {
          // If the action isn't valid JSON, treat it as a raw action type
          actionEngine.dispatch({ type: matchedAction } as unknown as Action);
        }
        return false; // Block the WebView navigation
      }

      return true; // Allow normal navigation
    },
    [actionEngine, urlPatterns],
  );

  /**
   * Fallback handler for navigation state changes.
   * Some platforms may not reliably fire onShouldStartLoadWithRequest,
   * so we also check navigation state changes as a safety net.
   */
  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      if (urlPatterns.length === 0 || !navState.url) return;

      const matchedAction = matchUrlPattern(navState.url, urlPatterns);
      if (matchedAction) {
        // Stop loading the matched URL
        if (webViewRef.current) {
          webViewRef.current.stopLoading();
        }
        try {
          const parsed = JSON.parse(matchedAction) as Action;
          actionEngine.dispatch(parsed);
        } catch {
          actionEngine.dispatch({ type: matchedAction } as unknown as Action);
        }
      }
    },
    [actionEngine, urlPatterns],
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webview}
        source={{ uri: url }}
        startInLoadingState
        javaScriptEnabled
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </View>
  );
}
