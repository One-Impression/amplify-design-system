import { CameraPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";

/**
 * camera.capture — launches the camera for photo/video capture, then uploads.
 * Uses expo-camera and expo-image-picker via dynamic imports.
 */
export async function handleCamera(
  action: Action,
  config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const payload = CameraPayloadSchema.parse(action.payload);

  try {
    const ImagePicker = await import("expo-image-picker");

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return { error: "permission_denied" };
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes:
        payload.mode === "video"
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.Images,
      videoMaxDuration: payload.max_duration_seconds,
    });

    if (result.canceled || result.assets.length === 0) {
      return { error: "user_cancelled" };
    }

    const asset = result.assets[0];

    // Upload to the specified endpoint.
    const formData = new FormData();
    formData.append("file", {
      uri: asset.uri,
      name: asset.fileName ?? "capture",
      type: asset.mimeType ?? (payload.mode === "video" ? "video/mp4" : "image/jpeg"),
    } as unknown as Blob);

    const headers: Record<string, string> = {};
    const token = config.authToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(payload.upload_endpoint, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      return { error: "upload_failed" };
    }

    const data = await response.json();
    return {
      success: {
        file_id: data.file_id,
        url: data.url,
        mime_type: data.mime_type,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "upload_failed";
    return { error: message };
  }
}
