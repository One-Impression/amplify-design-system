import type { PickedFile } from "./pick-document.js";

export interface UploadedFile {
  file_id: string;
  url: string;
  mime_type: string;
  size_bytes: number;
}

/**
 * Uploads a list of picked files to the specified endpoint.
 * The endpoint is expected to accept multipart/form-data and return
 * an array of { file_id, url, mime_type, size_bytes } objects.
 */
export async function uploadToS3(
  files: PickedFile[],
  uploadEndpoint: string,
  authToken: string | null,
): Promise<UploadedFile[]> {
  const formData = new FormData();

  for (const file of files) {
    // React Native FormData accepts { uri, name, type } objects.
    formData.append("files", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as unknown as Blob);
  }

  const headers: Record<string, string> = {};
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error("upload_failed");
  }

  const data = await response.json();
  return data.files as UploadedFile[];
}
