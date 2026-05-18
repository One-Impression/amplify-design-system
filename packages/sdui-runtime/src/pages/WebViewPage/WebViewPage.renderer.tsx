import React, { useEffect } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import type { Page } from "@one-impression/sdk-native-sdui";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useAppStateSession } from "../../hooks/useAppStateSession.js";

interface PageProps {
  page: Page;
}

interface WebViewPageData {
  url: string;
  title?: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  webview: {
    flex: 1,
  },
});

/**
 * Simple WebView shell page.
 * Legacy equivalent: WebViewPage.
 *
 * Renders a full-screen react-native-webview loading the URL from page.data.url.
 * Optionally shows a simple header bar with page.data.title.
 *
 * Note: This is a documented exception for the renderer-no-direct-rn-imports rule
 * -- WebView requires direct RN usage and peer-dep on react-native-webview.
 */
export function WebViewPageRenderer({ page }: PageProps): React.ReactElement {
  const actionEngine = useActionEngine();

  const pageData = page.data as WebViewPageData | undefined;
  const url = pageData?.url ?? "";
  const title = pageData?.title ?? page.title;

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

  return (
    <View style={styles.container}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
      ) : null}
      <WebView
        style={styles.webview}
        source={{ uri: url }}
        startInLoadingState
        javaScriptEnabled
      />
    </View>
  );
}
