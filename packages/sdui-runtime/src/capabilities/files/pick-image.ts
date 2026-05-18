import type { FilesPayload } from "@one-impression/sdk-native-sdui";
import type { PickedFile } from "./pick-document.js";

/**
 * Opens the image/video picker (camera roll) with the given constraints.
 * Uses expo-image-picker via dynamic import for testability.
 */
export async function pickImage(
  payload: FilesPayload,
): Promise<PickedFile[]> {
  const ImagePicker = await import("expo-image-picker");

  const allowsCamera = payload.sources.includes("camera");
  const allowsLibrary = payload.sources.includes("library");

  // Request permissions.
  if (allowsLibrary) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      throw new Error("permission_denied");
    }
  }

  let result: ImagePicker.ImagePickerResult;

  if (allowsCamera && !allowsLibrary) {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      throw new Error("permission_denied");
    }
    result = await ImagePicker.launchCameraAsync({
      allowsMultipleSelection: payload.max_count > 1,
      selectionLimit: payload.max_count,
    });
  } else {
    result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: payload.max_count > 1,
      selectionLimit: payload.max_count,
    });
  }

  if (result.canceled) {
    return [];
  }

  return result.assets.slice(0, payload.max_count).map((asset) => ({
    uri: asset.uri,
    name: asset.fileName ?? asset.uri.split("/").pop() ?? "file",
    mimeType: asset.mimeType ?? "image/jpeg",
    size: asset.fileSize ?? 0,
  }));
}
