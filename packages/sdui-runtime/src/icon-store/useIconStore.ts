/**
 * useIconStore — hook for renderers to look up icon SVG strings.
 *
 * Resolution order:
 *   1. MMKV persisted manifest (fetched via IconStoreProvider)
 *   2. Bundled essentials.json (offline first-launch)
 *   3. Generic placeholder SVG
 *
 * Returns the raw SVG string — use parseSvg() to convert to a component.
 */
import { useCallback } from 'react';
import { MMKV } from 'react-native-mmkv';
import essentials from './essentials.json';

/** Dedicated MMKV instance for icon storage. */
const iconStorage = new MMKV({ id: 'sdui-icon-store' });

/** MMKV keys */
const MANIFEST_KEY = 'icon-manifest';
const VERSION_KEY = 'icon-manifest-version';
const LAST_FETCH_KEY = 'icon-manifest-last-fetch';

/** Placeholder SVG shown when an icon is not found anywhere. */
const PLACEHOLDER_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 9 6 6"/><path d="m15 9-6 6"/></svg>';

/** Typed essentials record. */
const essentialIcons: Record<string, string> = essentials.icons;

/**
 * Read the full icon manifest from MMKV.
 * Returns null if nothing is persisted yet.
 */
function getManifestFromStorage(): Record<string, string> | null {
  const raw = iconStorage.getString(MANIFEST_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return null;
  }
}

/** Get the cached manifest version string. */
export function getCachedVersion(): string | undefined {
  return iconStorage.getString(VERSION_KEY);
}

/** Get the timestamp of the last successful fetch. */
export function getLastFetchTimestamp(): number {
  return iconStorage.getNumber(LAST_FETCH_KEY) ?? 0;
}

/** Persist a new manifest + version to MMKV. */
export function persistManifest(
  icons: Record<string, string>,
  version: string,
): void {
  iconStorage.set(MANIFEST_KEY, JSON.stringify(icons));
  iconStorage.set(VERSION_KEY, version);
  iconStorage.set(LAST_FETCH_KEY, Date.now());
}

export interface IconStoreResult {
  /** Resolve an icon name to its SVG string. */
  getIcon: (name: string) => string;
  /** Check whether an icon exists (manifest or essentials). */
  hasIcon: (name: string) => boolean;
}

/**
 * Hook to access the icon store from renderers.
 *
 * @example
 * ```tsx
 * const { getIcon } = useIconStore();
 * const SvgComponent = parseSvg('home', getIcon('home'));
 * ```
 */
export function useIconStore(): IconStoreResult {
  const getIcon = useCallback((name: string): string => {
    // 1. Try MMKV manifest
    const manifest = getManifestFromStorage();
    if (manifest?.[name]) return manifest[name];

    // 2. Try bundled essentials
    if (essentialIcons[name]) return essentialIcons[name];

    // 3. Generic placeholder
    return PLACEHOLDER_SVG;
  }, []);

  const hasIcon = useCallback((name: string): boolean => {
    const manifest = getManifestFromStorage();
    if (manifest?.[name]) return true;
    if (essentialIcons[name]) return true;
    return false;
  }, []);

  return { getIcon, hasIcon };
}
