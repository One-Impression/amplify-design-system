import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { InputSnippetSchema } from "@one-impression/sdk-native-sdui";
import { Input as DSInput, Box, Text } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

export function InputRenderer(node: Node): React.ReactElement {
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
          value={v.value}
          label={v.label}
          required={v.required}
          disabled={v.disabled}
          maxLength={v.max_length}
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
  onChange,
  onSubmit,
  onFocus,
  onBlur,
}: {
  inputType?: string;
  placeholder?: { text?: string };
  value?: string;
  label?: { text?: string; color?: string; font_size?: number; font_weight?: string };
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  onChange?: unknown;
  onSubmit?: unknown;
  onFocus?: unknown;
  onBlur?: unknown;
}): React.ReactElement {
  const actionEngine = useActionEngine();

  const handleChange = useCallback(
    (text: string) => {
      if (onChange) actionEngine.dispatch(onChange as any);
    },
    [actionEngine, onChange],
  );

  const handleSubmit = useCallback(() => {
    if (onSubmit) actionEngine.dispatch(onSubmit as any);
  }, [actionEngine, onSubmit]);

  const handleFocus = useCallback(() => {
    if (onFocus) actionEngine.dispatch(onFocus as any);
  }, [actionEngine, onFocus]);

  const handleBlur = useCallback(() => {
    if (onBlur) actionEngine.dispatch(onBlur as any);
  }, [actionEngine, onBlur]);

  return (
    <Box>
      {label && (
        <Text
          color={label.color}
          size={label.font_size}
          weight={label.font_weight}
        >
          {label.text}{required ? " *" : ""}
        </Text>
      )}
      <DSInput
        placeholder={placeholder?.text}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        keyboardType={inputType === "number" ? "numeric" : inputType === "email" ? "email-address" : "default"}
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Box>
  );
}
