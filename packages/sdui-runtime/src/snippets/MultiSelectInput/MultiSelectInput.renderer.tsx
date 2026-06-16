import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { MultiSelectInputSchema } from "@one-impression/sdk-native-sdui";
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

export function MultiSelectInputRenderer(node: Node): React.ReactElement {
  const data = node.data as
    | { form_id?: string; field_name?: string; selected_values?: string[]; validations?: ValidationRule[] }
    | undefined;
  const formId = useFormId(data?.form_id);
  const field = useFormField<string[]>(
    formId,
    data?.field_name,
    data?.selected_values ?? [],
    data?.validations,
  );
  const errorText = field.touched ? field.error ?? undefined : undefined;

  return (
    <SduiNode
      data={node.data}
      schema={MultiSelectInputSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <MultiSelectInputInner
          label={v.label}
          options={v.options}
          selectedValues={field.value}
          min={v.min}
          max={v.max}
          required={v.required}
          disabled={v.disabled}
          errorText={errorText}
          onSetValues={field.setValue}
          onTouched={field.markTouched}
          onChange={node.data?.on_change}
        />
      )}
    </SduiNode>
  );
}

function MultiSelectInputInner({
  label,
  options,
  selectedValues,
  min,
  max,
  required,
  disabled,
  errorText,
  onSetValues,
  onTouched,
  onChange,
}: {
  label?: { text?: string; color?: string; font_size?: number; font_weight?: string };
  options: Node[];
  /** Store-backed selected values. */
  selectedValues: string[];
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  /** Touched-gated error message (undefined = none). */
  errorText?: string;
  /** Replace the selected-values array in the store. */
  onSetValues: (next: string[]) => void;
  onTouched: () => void;
  onChange?: unknown;
}): React.ReactElement {
  const actionEngine = useActionEngine();

  const toggle = useCallback(
    (value: string) => {
      const isSelected = selectedValues.includes(value);
      // Deselect always allowed; select is blocked once `max` is reached.
      if (!isSelected && max != null && selectedValues.length >= max) return;
      const next = isSelected
        ? selectedValues.filter((x) => x !== value)
        : [...selectedValues, value];
      onSetValues(next);
      onTouched();
      if (onChange) actionEngine.dispatch(onChange as any);
    },
    [actionEngine, max, onChange, onSetValues, onTouched, selectedValues],
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
      {min != null && max != null && (
        <Text size={12} color="#999">
          Select {min}–{max} options
        </Text>
      )}
      <Stack direction="column" gap={8}>
        {options?.map((option: Node, i: number) => {
          const o = (option.data ?? {}) as unknown as OptionData;
          const isSelected = selectedValues.includes(o.value);
          const atCap = !isSelected && max != null && selectedValues.length >= max;
          return (
            <DSSelectableItem
              key={option.id || o.value || i}
              label={o.label?.text ?? o.value}
              description={o.subtitle?.text}
              selected={isSelected}
              disabled={disabled || o.disabled || atCap}
              indicator="checkbox"
              rounded="md"
              onPress={() => toggle(o.value)}
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
