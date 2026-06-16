import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { SingleSelectInputSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text, SelectableItem as DSSelectableItem } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useFormField, useFormId } from "../../form/index.js";
import type { ValidationRule } from "../../validation/index.js";

/** The data carried by a `sdui.ui_component.selectable_item` option node. */
interface OptionData {
  label?: { text?: string };
  subtitle?: { text?: string };
  value: string;
  disabled?: boolean;
}

export function SingleSelectInputRenderer(node: Node): React.ReactElement {
  const data = node.data as
    | { form_id?: string; field_name?: string; selected_value?: string; validations?: ValidationRule[] }
    | undefined;
  const formId = useFormId(data?.form_id);
  const field = useFormField<string>(
    formId,
    data?.field_name,
    data?.selected_value ?? "",
    data?.validations,
  );
  const errorText = field.touched ? field.error ?? undefined : undefined;

  return (
    <SduiNode
      data={node.data}
      schema={SingleSelectInputSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <SingleSelectInputInner
          label={v.label}
          options={v.options}
          selectedValue={field.value}
          required={v.required}
          disabled={v.disabled}
          errorText={errorText}
          onSelect={(value) => field.setValue(value)}
          onTouched={field.markTouched}
          onChange={node.data?.on_change}
        />
      )}
    </SduiNode>
  );
}

function SingleSelectInputInner({
  label,
  options,
  selectedValue,
  required,
  disabled,
  errorText,
  onSelect,
  onTouched,
  onChange,
}: {
  label?: { text?: string; color?: string; font_size?: number; font_weight?: string };
  options: Node[];
  /** Store-backed selected value. */
  selectedValue: string;
  required?: boolean;
  disabled?: boolean;
  /** Touched-gated error message (undefined = none). */
  errorText?: string;
  /** Set the selected value in the store. */
  onSelect: (value: string) => void;
  onTouched: () => void;
  onChange?: unknown;
}): React.ReactElement {
  const actionEngine = useActionEngine();

  // Render the selectable options directly (rather than via the generic
  // Interpreter) so selection is store-driven: `selected` is computed from the
  // form value and tapping writes it back — the snippet owns the radio behavior.
  const handlePress = useCallback(
    (value: string) => {
      onSelect(value);
      onTouched();
      if (onChange) actionEngine.dispatch(onChange as any);
    },
    [actionEngine, onChange, onSelect, onTouched],
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
      <Stack direction="column" gap={8}>
        {options?.map((option: Node, i: number) => {
          const o = (option.data ?? {}) as unknown as OptionData;
          return (
            <DSSelectableItem
              key={option.id || o.value || i}
              label={o.label?.text ?? o.value}
              description={o.subtitle?.text}
              selected={selectedValue === o.value}
              disabled={disabled || o.disabled}
              indicator="radio"
              rounded="md"
              onPress={() => handlePress(o.value)}
            />
          );
        })}
      </Stack>
      {errorText && (
        <Text size={12} color="#DC2626">
          {errorText}
        </Text>
      )}
    </Box>
  );
}
