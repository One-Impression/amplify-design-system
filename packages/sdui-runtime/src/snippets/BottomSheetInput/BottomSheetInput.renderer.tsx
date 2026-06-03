import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { BottomSheetInputSchema } from "@one-impression/sdk-native-sdui";
import { Input as DSInput, Box, Text } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

export function BottomSheetInputRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={BottomSheetInputSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <BottomSheetInputInner
          placeholder={v.placeholder}
          value={v.value}
          label={v.label}
          maxLength={v.max_length}
          multiline={v.multiline}
          onChange={node.data?.on_change}
          onSubmit={node.data?.on_submit}
          onFocus={node.data?.on_focus}
          onBlur={node.data?.on_blur}
        />
      )}
    </SduiNode>
  );
}

function BottomSheetInputInner({
  placeholder,
  value,
  label,
  maxLength,
  multiline,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
}: {
  placeholder?: { text?: string };
  value?: string;
  label?: { text?: string; color?: string; font_size?: number; font_weight?: string };
  maxLength?: number;
  multiline?: boolean;
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
    <Box padding={16}>
      {label && (
        <Text
          color={label.color}
          size={label.font_size}
          weight={label.font_weight}
        >
          {label.text}
        </Text>
      )}
      <DSInput
        placeholder={placeholder?.text}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Box>
  );
}
