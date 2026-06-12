import type { Page } from "@one-impression/sdk-native-sdui";
import { PAGE_API_BASE_URL } from "../config";

/**
 * Fetch a page envelope (SDUI JSON) by its navigate `target` from the playground
 * fixture server.
 *
 * This is the *only* wired seam on the client: navigation is otherwise fully
 * data-driven. Every `navigate` target — and the initial screen — round-trips
 * through here as a real JSON API call; there is no per-page registry in the
 * app. Edit a fixture, and the next fetch of that page picks up the new JSON
 * (the server re-serves on save via `tsx watch`).
 */
export async function loadPage(target: string): Promise<Page> {
  const url = `${PAGE_API_BASE_URL}/sdui/page/${encodeURIComponent(target)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`page "${target}" → HTTP ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as Page;
}
