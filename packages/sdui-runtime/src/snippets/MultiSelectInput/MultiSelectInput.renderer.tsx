import React, { useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { MultiSelectInputSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

export function MultiSelectInputRenderer(node: Node): React.ReactElement {
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
          selectedValues={v.selected_values}
          min={v.min}
          max={v.max}
          required={v.required}
          disabled={v.disabled}
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
  onChange,
}: {
  label?: { text?: string; color?: string; font_size?: number; font_weight?: string };
  options: Node[];
  selectedValues?: string[];
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  onChange?: unknown;
}): React.ReactElement {
  const actionEngine = useActionEngine();

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
        {options?.map((option: Node, i: number) => (
          <Interpreter key={option.id || i} node={option} />
        ))}
      </Stack>
    </Box>
  );
}
