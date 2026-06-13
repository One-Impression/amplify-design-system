import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ToggleInputSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text } from "@one-impression/ui-native";
import { Switch } from "react-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useFormField, useFormId } from "../../form/index.js";
import type { ValidationRule } from "../../validation/index.js";

export function ToggleInputRenderer(node: Node): React.ReactElement {
  const data = node.data as
    | { form_id?: string; field_name?: string; value?: boolean; validations?: ValidationRule[] }
    | undefined;
  const formId = useFormId(data?.form_id);
  const field = useFormField<boolean>(
    formId,
    data?.field_name,
    data?.value ?? false,
    data?.validations,
  );
  const errorText = field.touched ? field.error ?? undefined : undefined;

  return (
    <SduiNode
      data={node.data}
      schema={ToggleInputSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <ToggleInputInner
          label={v.label}
          value={field.value}
          disabled={v.disabled}
          errorText={errorText}
          onToggle={field.setValue}
          onTouched={field.markTouched}
          onChange={node.data?.on_change}
        />
      )}
    </SduiNode>
  );
}

function ToggleInputInner({
  label,
  value,
  disabled,
  errorText,
  onToggle,
  onTouched,
  onChange,
}: {
  label: { text?: string; color?: string; font_size?: number; font_weight?: string };
  value: boolean;
  disabled?: boolean;
  /** Touched-gated error message (undefined = none). */
  errorText?: string;
  /** Store-backed setter for this field's boolean value. */
  onToggle: (next: boolean) => void;
  /** Mark touched (toggling is an interaction). */
  onTouched: () => void;
  onChange?: unknown;
}): React.ReactElement {
  const actionEngine = useActionEngine();

  const handleChange = useCallback(
    (newValue: boolean) => {
      onToggle(newValue);
      onTouched();
      if (onChange) actionEngine.dispatch(onChange as any);
    },
    [actionEngine, onChange, onToggle, onTouched],
  );

  return (
    <Box>
      <Stack direction="row" align="center" justify="space-between">
        <Text
          color={label.color}
          size={label.font_size}
          weight={label.font_weight}
        >
          {label.text}
        </Text>
        <Switch
          value={value}
          disabled={disabled}
          onValueChange={handleChange}
        />
      </Stack>
      {errorText && (
        <Text size={12} color="#DC2626">
          {errorText}
        </Text>
      )}
    </Box>
  );
}
