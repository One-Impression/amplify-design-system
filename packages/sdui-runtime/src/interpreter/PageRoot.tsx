import React from "react";
import type { Page } from "@one-impression/sdk-native-sdui";
import { pageContainerRegistry } from "../registries/pages.js";

interface PageRootProps {
  page: Page;
}

/**
 * Top-level page dispatcher. Reads page.layout and selects the
 * appropriate page container renderer from the registry.
 * Falls back to "standard" layout if the layout string is unknown.
 */
export function PageRoot({ page }: PageRootProps): React.ReactElement {
  const layout = page.layout ?? "standard";
  const Container =
    pageContainerRegistry[layout] ?? pageContainerRegistry["standard"];

  if (!Container) {
    // No page containers registered yet (task 026 populates them).
    // Render nothing rather than crash.
    return <React.Fragment />;
  }

  return <Container page={page} />;
}
