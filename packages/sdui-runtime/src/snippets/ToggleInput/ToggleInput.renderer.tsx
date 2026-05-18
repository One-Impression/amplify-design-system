import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { ToggleInputSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text } from "@amplify-ai/ui-native";
import { Switch } from "react-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

export function ToggleInputRenderer(node: Node): React.ReactElement {
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
          value={v.value}
          disabled={v.disabled}
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
  onChange,
}: {
  label: { text?: string; color?: string; font_size?: number; font_weight?: string };
  value?: boolean;
  disabled?: boolean;
  onChange?: unknown;
}): React.ReactElement {
  const actionEngine = useActionEngine();

  const handleChange = useCallback(
    (newValue: boolean) => {
      if (onChange) actionEngine.dispatch(onChange as any);
    },
    [actionEngine, onChange],
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
          value={value ?? false}
          disabled={disabled}
          onValueChange={handleChange}
        />
      </Stack>
    </Box>
  );
}
