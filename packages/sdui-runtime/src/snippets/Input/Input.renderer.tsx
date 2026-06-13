import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { InputSnippetSchema } from "@one-impression/sdk-native-sdui";
import { Input as DSInput, Box } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useFormField, useFormId } from "../../form/index.js";
import type { ValidationRule } from "../../validation/index.js";

export function InputRenderer(node: Node): React.ReactElement {
  // `form_id` is a wire extension read raw (not yet in the schema). The field
  // binds to the form store by (form_id, field_name); when either is absent the
  // binding is inert and the input is just locally controlled by `data.value`.
  const data = node.data as
    | { form_id?: string; field_name?: string; value?: string; validations?: ValidationRule[] }
    | undefined;
  const formId = useFormId(data?.form_id);
  const field = useFormField<string>(
    formId,
    data?.field_name,
    data?.value ?? "",
    data?.validations,
  );
  // Show the error only once the field is touched (design D8).
  const errorText = field.touched ? field.error ?? undefined : undefined;

  return (
    <SduiNode
      data={node.data}
      schema={InputSnippetSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <InputInner
          inputType={v.input_type}
          placeholder={v.placeholder}
          value={field.value}
          label={v.label}
          required={v.required}
          disabled={v.disabled}
          maxLength={v.max_length}
          errorText={errorText}
          onChangeValue={field.setValue}
          onBlurField={field.markTouched}
          onChange={node.data?.on_change}
          onSubmit={node.data?.on_submit}
          onFocus={node.data?.on_focus}
          onBlur={node.data?.on_blur}
        />
      )}
    </SduiNode>
  );
}

function InputInner({
  inputType,
  placeholder,
  value,
  label,
  required,
  disabled,
  maxLength,
  errorText,
  onChangeValue,
  onBlurField,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
}: {
  inputType?: string;
  placeholder?: { text?: string };
  value: string;
  label?: { text?: string; color?: string; font_size?: number; font_weight?: string };
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  /** Touched-gated error message to show below the input (undefined = none). */
  errorText?: string;
  /** Store-backed setter for this field's value. */
  onChangeValue: (next: string) => void;
  /** Mark this field touched (on blur) so its error can surface. */
  onBlurField: () => void;
  onChange?: unknown;
  onSubmit?: unknown;
  onFocus?: unknown;
  onBlur?: unknown;
}): React.ReactElement {
  const actionEngine = useActionEngine();

  const handleChange = useCallback(
    (text: string) => {
      // Primary: write the typed value into the form store.
      onChangeValue(text);
      // Secondary: fire the server-declared on_change side effect, if any.
      if (onChange) actionEngine.dispatch(onChange as any);
    },
    [actionEngine, onChange, onChangeValue],
  );

  const handleSubmit = useCallback(() => {
    if (onSubmit) actionEngine.dispatch(onSubmit as any);
  }, [actionEngine, onSubmit]);

  const handleFocus = useCallback(() => {
    if (onFocus) actionEngine.dispatch(onFocus as any);
  }, [actionEngine, onFocus]);

  const handleBlur = useCallback(() => {
    // Primary: mark touched so a validation error can show.
    onBlurField();
    // Secondary: fire the server-declared on_blur side effect, if any.
    if (onBlur) actionEngine.dispatch(onBlur as any);
  }, [actionEngine, onBlur, onBlurField]);

  // Material-style floating label: the label lives INSIDE the input (placeholder
  // when empty, floats to the top border on focus/value) — so no separate label
  // Text above. The `required` marker rides on the label string.
  const labelText = label?.text
    ? `${label.text}${required ? " *" : ""}`
    : undefined;

  return (
    <Box>
      <DSInput
        label={labelText}
        floatingLabel
        placeholder={placeholder?.text}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        error={!!errorText}
        helperText={errorText}
        keyboardType={inputType === "number" ? "numeric" : inputType === "email" ? "email-address" : "default"}
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Box>
  );
}
