'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/cn';

export type FilePickerVariant = 'inline' | 'modal' | 'drawer';

export interface PickedFile {
  id: string;
  file: File;
  /** Object URL for image previews (only for image/video). Revoked on remove. */
  previewUrl?: string;
  /** Upload progress 0..100 if you wire one in via `progressMap`. */
  progress?: number;
  /** Optional error message (e.g. file too large). */
  error?: string;
}

export interface FilePickerProps {
  /** Controlled list of files. */
  value?: PickedFile[];
  /** Default uncontrolled list. */
  defaultValue?: PickedFile[];
  onChange?: (files: PickedFile[]) => void;
  /** Allow selecting more than one file. */
  multiple?: boolean;
  /** Standard `accept` filter, e.g. `image/*,application/pdf`. */
  accept?: string;
  /** Maximum size per file in bytes. */
  maxSize?: number;
  /** Maximum total files. */
  maxFiles?: number;
  /** External progress map keyed by file id (0..100). */
  progressMap?: Record<string, number>;
  /** External error map keyed by file id. */
  errorMap?: Record<string, string>;
  /** Heading shown above the dropzone. */
  label?: string;
  /** Helper text rendered under the dropzone. */
  helperText?: string;
  /** Variant. `inline` is the default in-place dropzone. */
  variant?: FilePickerVariant;
  /** For modal/drawer: whether it is open. */
  open?: boolean;
  /** For modal/drawer: close handler. */
  onClose?: () => void;
  /** Disabled state. */
  disabled?: boolean;
  className?: string;
  id?: string;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

const makeId = () =>
  `file-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const buildPicked = (file: File): PickedFile => {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  return {
    id: makeId(),
    file,
    previewUrl: isImage || isVideo ? URL.createObjectURL(file) : undefined,
  };
};

const FileIcon: React.FC<{ file: PickedFile; size?: number }> = ({ file, size = 40 }) => {
  const { previewUrl, file: f } = file;
  if (previewUrl && f.type.startsWith('image/')) {
    return (
      <img
        src={previewUrl}
        alt=""
        style={{ width: size, height: size, objectFit: 'cover' }}
        className="rounded-[8px]"
      />
    );
  }
  if (previewUrl && f.type.startsWith('video/')) {
    return (
      <video
        src={previewUrl}
        muted
        style={{ width: size, height: size, objectFit: 'cover' }}
        className="rounded-[8px] bg-black"
        aria-hidden="true"
      />
    );
  }
  // generic file/PDF glyph
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-[8px] bg-[var(--amp-semantic-bg-sunken)] flex items-center justify-center text-[var(--amp-semantic-text-muted)]"
      aria-hidden="true"
    >
      <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 3v4a1 1 0 001 1h4M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8.4L14 3z"
        />
      </svg>
    </div>
  );
};

interface FilePickerInnerProps extends Omit<FilePickerProps, 'variant' | 'open' | 'onClose'> {
  files: PickedFile[];
  setFiles: (next: PickedFile[]) => void;
}

const FilePickerInner: React.FC<FilePickerInnerProps> = ({
  files,
  setFiles,
  multiple = true,
  accept,
  maxSize,
  maxFiles,
  progressMap,
  errorMap,
  label,
  helperText,
  disabled,
  id,
}) => {
  const generatedId = useId();
  const dropzoneId = id ?? `filepicker-${generatedId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const acceptText = useMemo(() => {
    if (!accept) return 'Any file type';
    return accept;
  }, [accept]);

  const validateAndAdd = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      const next: PickedFile[] = [...files];
      for (const f of list) {
        if (maxFiles && next.length >= maxFiles) break;
        const picked = buildPicked(f);
        if (maxSize && f.size > maxSize) {
          picked.error = `Exceeds max size (${formatBytes(maxSize)})`;
        }
        next.push(picked);
      }
      setFiles(multiple ? next : next.slice(-1));
    },
    [files, multiple, maxFiles, maxSize, setFiles]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) validateAndAdd(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files) validateAndAdd(e.dataTransfer.files);
  };

  const remove = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    setFiles(files.filter((f) => f.id !== id));
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      for (const f of files) if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label
          htmlFor={dropzoneId}
          className="text-[14px] font-medium text-[var(--amp-semantic-text-primary)]"
        >
          {label}
        </label>
      )}
      <div
        id={dropzoneId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-label={label ?? 'File upload dropzone'}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-2 px-6 py-10',
          'border-2 border-dashed rounded-[16px] cursor-pointer transition-colors',
          'border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)]',
          'hover:border-[var(--amp-semantic-border-focus)] hover:bg-[var(--amp-semantic-bg-sunken)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]',
          dragOver && 'border-[var(--amp-semantic-border-focus)] bg-[var(--amp-semantic-bg-sunken)]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <svg className="w-8 h-8 text-[var(--amp-semantic-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-1-7.87A5 5 0 0117 9h.5a3.5 3.5 0 010 7H17M12 12v9m0-9l-3 3m3-3l3 3" />
        </svg>
        <div className="text-[14px] text-[var(--amp-semantic-text-primary)]">
          <span className="font-medium underline">Click to upload</span> or drag & drop
        </div>
        <div className="text-[12px] text-[var(--amp-semantic-text-muted)]">{acceptText}{maxSize ? ` · up to ${formatBytes(maxSize)}` : ''}</div>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          multiple={multiple}
          accept={accept}
          onChange={handleInput}
          disabled={disabled}
        />
      </div>
      {helperText && (
        <p className="text-[12px] text-[var(--amp-semantic-text-muted)]">{helperText}</p>
      )}

      {files.length > 0 && (
        <ul className="flex flex-col gap-2" role="list" aria-label="Selected files">
          {files.map((picked) => {
            const progress = picked.progress ?? progressMap?.[picked.id];
            const err = picked.error ?? errorMap?.[picked.id];
            return (
              <li
                key={picked.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-[12px]',
                  'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)]'
                )}
              >
                <FileIcon file={picked} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-[var(--amp-semantic-text-primary)] truncate">
                      {picked.file.name}
                    </span>
                    <span className="text-[12px] text-[var(--amp-semantic-text-muted)] shrink-0">
                      {formatBytes(picked.file.size)}
                    </span>
                  </div>
                  {typeof progress === 'number' && progress < 100 && !err && (
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-[var(--amp-semantic-bg-sunken)] overflow-hidden">
                      <div
                        className="h-full bg-[var(--amp-semantic-bg-accent,#6531FF)] transition-all"
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                      />
                    </div>
                  )}
                  {err && (
                    <p className="mt-1 text-[12px] text-[var(--amp-semantic-status-error,#dc2626)]">
                      {err}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${picked.file.name}`}
                  onClick={() => remove(picked.id)}
                  className="shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-full text-[var(--amp-semantic-text-muted)] hover:bg-[var(--amp-semantic-bg-sunken)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export const FilePicker: React.FC<FilePickerProps> = (props) => {
  const {
    value,
    defaultValue,
    onChange,
    variant = 'inline',
    open,
    onClose,
    className,
    ...inner
  } = props;
  const isControlled = typeof value !== 'undefined';
  const [internal, setInternal] = useState<PickedFile[]>(defaultValue ?? []);
  const files = isControlled ? value! : internal;

  const setFiles = useCallback(
    (next: PickedFile[]) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  if (variant === 'inline') {
    return (
      <div className={cn(className)}>
        <FilePickerInner files={files} setFiles={setFiles} {...inner} />
      </div>
    );
  }

  // modal / drawer
  if (!open) return null;
  const isDrawer = variant === 'drawer';
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={inner.label ?? 'Upload files'}
      className="fixed inset-0 z-50 flex"
      style={isDrawer ? { justifyContent: 'flex-end' } : { alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative z-10 bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)] shadow-xl',
          isDrawer
            ? 'h-full w-full max-w-md rounded-l-[16px] p-6 overflow-y-auto'
            : 'w-full max-w-lg mx-4 rounded-[16px] p-6',
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-semibold text-[var(--amp-semantic-text-primary)]">
            {inner.label ?? 'Upload files'}
          </h2>
          {onClose && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full text-[var(--amp-semantic-text-muted)] hover:bg-[var(--amp-semantic-bg-sunken)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          )}
        </div>
        <FilePickerInner files={files} setFiles={setFiles} {...inner} />
      </div>
    </div>
  );
};

FilePicker.displayName = 'FilePicker';
