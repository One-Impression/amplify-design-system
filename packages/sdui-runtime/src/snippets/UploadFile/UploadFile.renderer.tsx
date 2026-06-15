import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { UploadFileSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text, Icon as DSIcon } from "@one-impression/ui-native";
import { Pressable } from "react-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useFormField, useFormId } from "../../form/index.js";
import { pickDocument } from "../../capabilities/files/pick-document.js";
import type { ValidationRule } from "../../validation/index.js";

export function UploadFileRenderer(node: Node): React.ReactElement {
  // Register the field so it participates in the form (value is an array of file
  // refs, seeded empty). Actual file selection is a host capability (the
  // files/pick-image capability) — the renderer marks the field touched on tap;
  // wiring the picked file into `setValue` is a follow-up on the capability path.
  const data = node.data as
    | { form_id?: string; field_name?: string; validations?: ValidationRule[] }
    | undefined;
  const formId = useFormId(data?.form_id);
  const field = useFormField<string[]>(formId, data?.field_name, [], data?.validations);
  const errorText = field.touched ? field.error ?? undefined : undefined;

  return (
    <SduiNode
      data={node.data}
      schema={UploadFileSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <UploadFileInner
          label={v.label}
          acceptedTypes={v.accepted_types}
          maxSizeMb={v.max_size_mb}
          maxFiles={v.max_files}
          required={v.required}
          disabled={v.disabled}
          errorText={errorText}
          value={field.value}
          onSetFiles={field.setValue}
          onTouched={field.markTouched}
          onChange={node.data?.on_change}
        />
      )}
    </SduiNode>
  );
}

function UploadFileInner({
  label,
  acceptedTypes,
  maxSizeMb,
  maxFiles,
  required,
  disabled,
  errorText,
  value,
  onSetFiles,
  onTouched,
  onChange,
}: {
  label?: { text?: string; color?: string; font_size?: number; font_weight?: string };
  acceptedTypes?: string[];
  maxSizeMb?: number;
  maxFiles?: number;
  required?: boolean;
  disabled?: boolean;
  /** Touched-gated error message (undefined = none). */
  errorText?: string;
  /** Currently-picked file names (the field value). */
  value: string[];
  /** Write the picked file names into the form field. */
  onSetFiles: (next: string[]) => void;
  /** Mark the field touched when the upload zone is tapped. */
  onTouched: () => void;
  onChange?: unknown;
}): React.ReactElement {
  const actionEngine = useActionEngine();

  const max = maxFiles ?? 1;
  const multiple = max > 1;
  const fileList = Array.isArray(value) ? value : [];
  const hasFiles = fileList.length > 0;
  const canAddMore = fileList.length < max;

  const handlePick = useCallback(async () => {
    onTouched();
    try {
      // Open the native document picker (a host capability). For the playground
      // we store the picked file names; a real flow would upload to S3 and store
      // the returned keys (see upload-to-s3 capability) — that's the follow-up.
      const remaining = multiple ? Math.max(1, max - fileList.length) : 1;
      const picked = await pickDocument({ max_count: remaining } as never);
      if (picked.length) {
        const names = picked.map((f) => f.name);
        // Multi: append (capped at max). Single: replace.
        onSetFiles(multiple ? [...fileList, ...names].slice(0, max) : names.slice(0, 1));
      }
    } catch {
      // Cancel / permission denied — leave the field unchanged.
    }
    if (onChange) actionEngine.dispatch(onChange as any);
  }, [actionEngine, fileList, max, multiple, onChange, onSetFiles, onTouched]);

  const handleRemove = useCallback(
    (idx: number) => onSetFiles(fileList.filter((_, i) => i !== idx)),
    [fileList, onSetFiles],
  );

  return (
    <Box opacity={disabled ? 0.5 : 1}>
      {label && (
        <Text
          color={label.color}
          size={label.font_size}
          weight={label.font_weight}
        >
          {label.text}{required ? " *" : ""}
        </Text>
      )}
      {/* NOTE: the drop-zone + file-row visuals are inline here; pending
          extraction into a ui-native `FileDropZone` primitive (FORM-SYSTEM-DESIGN §3). */}
      {/* Selected files — each removable; single-file also offers Replace. */}
      {hasFiles && (
        <Stack direction="column" gap={6}>
          {fileList.map((name, idx) => (
            <Box
              key={`${name}-${idx}`}
              borderWidth={1}
              borderColor="#E0E0E0"
              rounded={8}
              paddingHorizontal={12}
              paddingVertical={10}
            >
              <Stack direction="row" align="center" justify="space-between" gap={8}>
                <Stack direction="row" align="center" gap={8} flex={1}>
                  <DSIcon name="upload" size={18} color="#666" />
                  <Text size={14} color="#222" numberOfLines={1}>{name}</Text>
                </Stack>
                <Stack direction="row" align="center" gap={16}>
                  {!multiple && (
                    <Pressable onPress={handlePick} disabled={disabled} hitSlop={8}>
                      <Text size={13} color="#6531FF">Replace</Text>
                    </Pressable>
                  )}
                  <Pressable onPress={() => handleRemove(idx)} disabled={disabled} hitSlop={8}>
                    <Text size={16} color="#999">✕</Text>
                  </Pressable>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
      {/* Drop-zone — shown when empty, or (multi) while under the file cap. */}
      {(!hasFiles || (multiple && canAddMore)) && (
        <Pressable onPress={handlePick} disabled={disabled}>
          <Box
            borderWidth={1}
            borderColor="#E0E0E0"
            borderStyle="dashed"
            rounded={8}
            padding={16}
            alignItems="center"
          >
            <Stack direction="column" align="center" gap={4}>
              <DSIcon name="upload" size={24} color="#999" />
              <Text size={14} color="#666">
                {multiple && hasFiles ? "Add another file" : "Tap to upload"}
              </Text>
              <Text size={12} color="#999">
                {[
                  maxSizeMb ? `Max ${maxSizeMb}MB` : null,
                  multiple ? `up to ${max} files` : "1 file",
                  acceptedTypes && acceptedTypes.length > 0 ? acceptedTypes.join(", ") : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
            </Stack>
          </Box>
        </Pressable>
      )}
      {errorText && (
        <Text size={12} color="#DC2626">
          {errorText}
        </Text>
      )}
    </Box>
  );
}
