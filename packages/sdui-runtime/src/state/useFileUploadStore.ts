/**
 * useFileUploadStore — Zustand store for file upload state.
 *
 * Tracks in-progress file uploads with progress, status, and error
 * information. Used by the file upload capability and image picker
 * flows in the Creator app.
 *
 * Mirrors the legacy Redux fileUpload slice.
 */
import { create } from 'zustand';

/** Status of a single file upload. */
export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error' | 'cancelled';

/** A single upload entry. */
export interface UploadEntry {
  /** Unique upload identifier. */
  id: string;
  /** Original file name. */
  fileName: string;
  /** MIME type. */
  mimeType: string;
  /** File size in bytes. */
  fileSize: number;
  /** Upload progress (0-1). */
  progress: number;
  /** Current status. */
  status: UploadStatus;
  /** Error message if status is 'error'. */
  error: string | null;
  /** Server-returned URL after successful upload. */
  uploadedUrl: string | null;
  /** Timestamp of when the upload was initiated. */
  startedAt: number;
}

export interface FileUploadState {
  /** Active uploads keyed by ID. */
  uploads: Record<string, UploadEntry>;
}

export interface FileUploadActions {
  /** Start tracking a new upload. */
  startUpload: (entry: Omit<UploadEntry, 'progress' | 'status' | 'error' | 'uploadedUrl' | 'startedAt'>) => void;
  /** Update upload progress. */
  setProgress: (id: string, progress: number) => void;
  /** Mark upload as complete with the uploaded URL. */
  setSuccess: (id: string, uploadedUrl: string) => void;
  /** Mark upload as failed. */
  setError: (id: string, error: string) => void;
  /** Cancel an upload. */
  cancel: (id: string) => void;
  /** Remove a completed/failed/cancelled upload from tracking. */
  remove: (id: string) => void;
  /** Clear all uploads. */
  clearAll: () => void;
  /** Get all uploads with a specific status. */
  getByStatus: (status: UploadStatus) => UploadEntry[];
}

const initialState: FileUploadState = {
  uploads: {},
};

export const useFileUploadStore = create<FileUploadState & FileUploadActions>(
  (set, get) => ({
    ...initialState,

    startUpload: (entry) =>
      set((state) => ({
        uploads: {
          ...state.uploads,
          [entry.id]: {
            ...entry,
            progress: 0,
            status: 'pending' as const,
            error: null,
            uploadedUrl: null,
            startedAt: Date.now(),
          },
        },
      })),

    setProgress: (id, progress) =>
      set((state) => {
        const upload = state.uploads[id];
        if (!upload) return state;
        return {
          uploads: {
            ...state.uploads,
            [id]: { ...upload, progress, status: 'uploading' as const },
          },
        };
      }),

    setSuccess: (id, uploadedUrl) =>
      set((state) => {
        const upload = state.uploads[id];
        if (!upload) return state;
        return {
          uploads: {
            ...state.uploads,
            [id]: { ...upload, progress: 1, status: 'success' as const, uploadedUrl },
          },
        };
      }),

    setError: (id, error) =>
      set((state) => {
        const upload = state.uploads[id];
        if (!upload) return state;
        return {
          uploads: {
            ...state.uploads,
            [id]: { ...upload, status: 'error' as const, error },
          },
        };
      }),

    cancel: (id) =>
      set((state) => {
        const upload = state.uploads[id];
        if (!upload) return state;
        return {
          uploads: {
            ...state.uploads,
            [id]: { ...upload, status: 'cancelled' as const },
          },
        };
      }),

    remove: (id) =>
      set((state) => {
        const { [id]: _, ...rest } = state.uploads;
        return { uploads: rest };
      }),

    clearAll: () => set(initialState),

    getByStatus: (status) => {
      const state = get();
      return Object.values(state.uploads).filter((u) => u.status === status);
    },
  }),
);
