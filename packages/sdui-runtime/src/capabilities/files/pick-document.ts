import type { FilesPayload } from "@one-impression/sdk-native-sdui";

export interface PickedFile {
  uri: string;
  name: string;
  mimeType: string;
  size: number;
}

/**
 * Opens the document picker with the given constraints.
 * Uses expo-document-picker via dynamic import for testability.
 */
export async function pickDocument(
  payload: FilesPayload,
): Promise<PickedFile[]> {
  const DocumentPicker = await import("expo-document-picker");

  const result = await DocumentPicker.getDocumentAsync({
    type: payload.mime_types ?? ["*/*"],
    multiple: payload.max_count > 1,
    copyToCacheDirectory: true,
  });

  if (result.canceled) {
    return [];
  }

  return result.assets.slice(0, payload.max_count).map((asset) => ({
    uri: asset.uri,
    name: asset.name,
    mimeType: asset.mimeType ?? "application/octet-stream",
    size: asset.size ?? 0,
  }));
}
