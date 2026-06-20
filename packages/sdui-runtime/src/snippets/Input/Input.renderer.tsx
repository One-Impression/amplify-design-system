import React, { useCallback, useState } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { InputSnippetSchema } from "@one-impression/sdk-native-sdui";
import { Input as DSInput, Box, Icon as DSIcon, Stack, Text } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useFormField, useFormId } from "../../form/index.js";
import { useLocalStore } from "../../state/useLocalStore.js";
import type { ValidationRule } from "../../validation/index.js";

/** Lightweight static shorthand for a leading/trailing slot. */
interface AdornmentSpec {
  icon?: string;
  text?: string;
}

/** Static icon/text adornment for a leading/trailing slot. */
function Adornment({ icon, text }: AdornmentSpec): React.ReactElement | null {
  if (!icon && !text) return null;
  return (
    <Stack direction="row" align="center" gap={4}>
      {icon ? <DSIcon name={icon} size={18} color="#666" /> : null}
      {text ? <Text size={14} color="#666">{text}</Text> : null}
    </Stack>
  );
}

/**
 * Resolve a leading/trailing slot from the wire. A full Node (has `type`) is
 * rendered via the Interpreter — so the slot holds ANYTHING (icon, text, a
 * `select_trigger` that opens a picker sheet). A `{ icon, text }` shorthand
 * renders a lightweight static adornment.
 */
function adornmentNode(
  spec: AdornmentSpec | Node | undefined,
): React.ReactNode {
  if (!spec) return undefined;
  if ((spec as Node).type) return <Interpreter node={spec as Node} />;
  const s = spec as AdornmentSpec;
  return s.icon || s.text ? <Adornment icon={s.icon} text={s.text} /> : undefined;
}

const KEYBOARD: Record<string, "default" | "numeric" | "email-address" | "phone-pad" | "decimal-pad"> = {
  number: "numeric",
  email: "email-address",
  phone: "phone-pad",
  decimal: "decimal-pad",
};

/**
 * The one generic text input. Handles every `input_type` (text/email/number/
 * phone/decimal → keyboard) and optional `leading`/`trailing` slots from the
 * wire — a `{ icon, text }` shorthand, or any Node (rendered via Interpreter,
 * e.g. a `select_trigger` that opens a picker sheet). Phone is just this input
 * with `input_type: "phone"` + a `select_trigger` leading — no bespoke snippet.
 */
export function InputRenderer(node: Node): React.ReactElement {
  // `form_id` / `leading` / `trailing` are wire extensions read raw (not yet in
  // the schema). The field binds to the store by (form_id, field_name).
  const data = node.data as
    | {
        form_id?: string;
        field_name?: string;
        value?: string;
        validations?: ValidationRule[];
        leading?: AdornmentSpec | Node;
        trailing?: AdornmentSpec | Node;
        /** When set, the input writes its current text into the local store
         *  under this key on every change — so a (typically debounced) reload
         *  can read it via `{ ref: "$.local.<local_key>" }`. Powers search. */
        local_key?: string;
      }
    | undefined;
  const formId = useFormId(data?.form_id);
  const field = useFormField<string>(
    formId,
    data?.field_name,
    data?.value ?? "",
    data?.validations,
  );

  const errorText = field.touched ? field.error ?? undefined : undefined;

  // Standalone inputs (no form binding — e.g. a sheet search box) keep their own
  // text so they stay controllable; bound inputs read/write the form store.
  const [standaloneValue, setStandaloneValue] = useState(data?.value ?? "");
  const value = field.bound ? field.value : standaloneValue;
  const setValue = field.bound ? field.setValue : setStandaloneValue;

  const leadingNode = adornmentNode(data?.leading);
  const trailingNode = adornmentNode(data?.trailing);

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
          value={value}
          label={v.label}
          required={v.required}
          disabled={v.disabled}
          maxLength={v.max_length}
          errorText={errorText}
          leading={leadingNode}
          trailing={trailingNode}
          onChangeValue={setValue}
          onBlurField={field.markTouched}
          onChange={node.data?.on_change}
          onSubmit={node.data?.on_submit}
          onFocus={node.data?.on_focus}
          onBlur={node.data?.on_blur}
          localKey={data?.local_key}
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
  leading,
  trailing,
  onChangeValue,
  onBlurField,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  localKey,
}: {
  inputType?: string;
  placeholder?: { text?: string };
  value: string;
  label?: { text?: string; color?: string; font_size?: number; font_weight?: string };
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  errorText?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onChangeValue: (next: string) => void;
  onBlurField: () => void;
  onChange?: unknown;
  onSubmit?: unknown;
  onFocus?: unknown;
  onBlur?: unknown;
  localKey?: string;
}): React.ReactElement {
  const actionEngine = useActionEngine();

  const handleChange = useCallback(
    (text: string) => {
      onChangeValue(text);
      // Mirror the text into the local store so a chained (debounced) reload can
      // read it via `{ ref: "$.local.<localKey>" }` — synchronous, so the value
      // is current before the reload fires.
      if (localKey) useLocalStore.getState().set(localKey, text);
      if (onChange) actionEngine.dispatch(onChange as any);
    },
    [actionEngine, onChange, onChangeValue, localKey],
  );

  const handleSubmit = useCallback(() => {
    if (onSubmit) actionEngine.dispatch(onSubmit as any);
  }, [actionEngine, onSubmit]);

  const handleFocus = useCallback(() => {
    if (onFocus) actionEngine.dispatch(onFocus as any);
  }, [actionEngine, onFocus]);

  const handleBlur = useCallback(() => {
    onBlurField();
    if (onBlur) actionEngine.dispatch(onBlur as any);
  }, [actionEngine, onBlur, onBlurField]);

  // Floating label lives inside the field; the `required` marker rides on it.
  const labelText = label?.text
    ? `${label.text}${required ? " *" : ""}`
    : undefined;

  return (
    <Box>
      <DSInput
        label={labelText}
        floatingLabel
        leading={leading}
        trailing={trailing}
        placeholder={placeholder?.text}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        error={!!errorText}
        helperText={errorText}
        keyboardType={(inputType && KEYBOARD[inputType]) || "default"}
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Box>
  );
}
