import { FilesPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";
import { pickDocument } from "./pick-document.js";
import { pickImage } from "./pick-image.js";
import { uploadToS3 } from "./upload-to-s3.js";
import type { PickedFile } from "./pick-document.js";

/**
 * files.pick_and_upload — orchestrates file picking (document or image)
 * followed by upload to the configured endpoint.
 */
export async function handleFiles(
  action: Action,
  config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const payload = FilesPayloadSchema.parse(action.payload);

  try {
    let files: PickedFile[];

    const hasDocuments = payload.sources.includes("documents");
    const hasImageSources =
      payload.sources.includes("camera") || payload.sources.includes("library");

    if (hasDocuments && !hasImageSources) {
      files = await pickDocument(payload);
    } else {
      files = await pickImage(payload);
    }

    if (files.length === 0) {
      return { error: "user_cancelled" };
    }

    // Validate file sizes if max_size_mb is set.
    if (payload.max_size_mb) {
      const maxBytes = payload.max_size_mb * 1024 * 1024;
      const oversized = files.find((f) => f.size > maxBytes);
      if (oversized) {
        return { error: "size_exceeded" };
      }
    }

    // Validate MIME types if specified.
    if (payload.mime_types?.length) {
      const invalid = files.find(
        (f) => !payload.mime_types!.some((mt) => f.mimeType.startsWith(mt.replace("*", ""))),
      );
      if (invalid) {
        return { error: "type_not_allowed" };
      }
    }

    const uploaded = await uploadToS3(
      files,
      payload.upload_endpoint,
      config.authToken(),
    );

    return { success: { files: uploaded } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "upload_failed";
    return { error: message };
  }
}
