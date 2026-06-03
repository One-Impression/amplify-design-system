import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { UploadFileSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text, Icon as DSIcon, Button as DSButton } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

export function UploadFileRenderer(node: Node): React.ReactElement {
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
  onChange,
}: {
  label?: { text?: string; color?: string; font_size?: number; font_weight?: string };
  acceptedTypes?: string[];
  maxSizeMb?: number;
  maxFiles?: number;
  required?: boolean;
  disabled?: boolean;
  onChange?: unknown;
}): React.ReactElement {
  const actionEngine = useActionEngine();

  const handlePress = useCallback(() => {
    if (onChange) actionEngine.dispatch(onChange as any);
  }, [actionEngine, onChange]);

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
      <Box
        borderWidth={1}
        borderColor="#E0E0E0"
        borderStyle="dashed"
        rounded={8}
        padding={24}
        alignItems="center"
      >
        <Stack direction="column" align="center" gap={8}>
          <DSIcon name="upload" size={24} color="#999" />
          <Text size={14} color="#666">
            Tap to upload
          </Text>
          {maxSizeMb && (
            <Text size={12} color="#999">
              Max {maxSizeMb}MB
              {maxFiles ? ` | ${maxFiles} file${maxFiles > 1 ? "s" : ""}` : ""}
            </Text>
          )}
          {acceptedTypes && acceptedTypes.length > 0 && (
            <Text size={12} color="#999">
              {acceptedTypes.join(", ")}
            </Text>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
