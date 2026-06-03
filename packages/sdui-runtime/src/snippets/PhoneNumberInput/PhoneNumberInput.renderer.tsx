import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { PhoneNumberInputSchema } from "@one-impression/sdk-native-sdui";
import { Input as DSInput, Box, Stack, Text } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

export function PhoneNumberInputRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={PhoneNumberInputSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <PhoneNumberInputInner
          label={v.label}
          value={v.value}
          countryCode={v.country_code}
          placeholder={v.placeholder}
          required={v.required}
          disabled={v.disabled}
          onChange={node.data?.on_change}
          onSubmit={node.data?.on_submit}
          onFocus={node.data?.on_focus}
          onBlur={node.data?.on_blur}
        />
      )}
    </SduiNode>
  );
}

function PhoneNumberInputInner({
  label,
  value,
  countryCode,
  placeholder,
  required,
  disabled,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
}: {
  label?: { text?: string; color?: string; font_size?: number; font_weight?: string };
  value?: string;
  countryCode?: string;
  placeholder?: { text?: string };
  required?: boolean;
  disabled?: boolean;
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
      <Stack direction="row" align="center" gap={8}>
        <Box paddingHorizontal={12} paddingVertical={8} bg="#F5F5F5" rounded={8}>
          <Text>{countryCode ?? "+91"}</Text>
        </Box>
        <Box flex={1}>
          <DSInput
            placeholder={placeholder?.text}
            value={value}
            disabled={disabled}
            keyboardType="phone-pad"
            onChangeText={handleChange}
            onSubmitEditing={handleSubmit}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Box>
      </Stack>
    </Box>
  );
}
