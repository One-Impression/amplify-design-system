import React from "react";
import { Pressable } from "react-native";
import type { Node } from "@one-impression/sdk-native-sdui";
import { Stack, Text, Icon as DSIcon } from "@one-impression/ui-native";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useFormField, useFormId } from "../../form/index.js";

/**
 * select_trigger — a generic, form-aware dropdown trigger. Displays the current
 * value of a form field (optionally mapped to a rich label via `value_display`)
 * and fires its `on_click` (typically a `sheet` action that opens a picker whose
 * body is a `single_select_input` bound to the SAME field). No picker logic of
 * its own — presentation + options are 100% wire/BFF-driven. Reusable for any
 * field (country, currency, timezone, …).
 *
 * Wire `data`: { form_id, field_name, default_value?, value_display?, trailing_icon?, placeholder? }
 * A runtime node type (not yet in the SDK) — read raw; promote with the rest.
 */
export function SelectTriggerRenderer(node: Node): React.ReactElement {
  const data = node.data as
    | {
        form_id?: string;
        field_name?: string;
        default_value?: string;
        value_display?: Record<string, string>;
        trailing_icon?: string;
        placeholder?: string;
      }
    | undefined;

  const formId = useFormId(data?.form_id);
  const field = useFormField<string | string[]>(
    formId,
    data?.field_name,
    data?.default_value ?? "",
  );
  const actionEngine = useActionEngine();

  // The bound value is a string for single-select fields, a string[] for
  // multi-select. Map each id to its rich label via `value_display` and join;
  // fall back to the placeholder when empty.
  const mapLabel = (v: string): string => data?.value_display?.[v] ?? v;
  const value = field.value;
  const display = Array.isArray(value)
    ? value.length
      ? value.map(mapLabel).join(", ")
      : data?.placeholder ?? ""
    : mapLabel(value) || data?.placeholder || "";

  return (
    <Pressable
      onPress={() => node.on_click && actionEngine.dispatch(node.on_click)}
      hitSlop={6}
    >
      <Stack direction="row" align="center" gap={4}>
        <Text size={14} color="#222">{display}</Text>
        {data?.trailing_icon ? (
          <DSIcon name={data.trailing_icon} size={14} color="#999" />
        ) : null}
      </Stack>
    </Pressable>
  );
}
