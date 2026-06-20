import React from "react";
import { Pressable, StyleSheet, Text as RNText, View } from "react-native";
import { sdui } from "@one-impression/tokens-creator/react-native";
import type { Node } from "@one-impression/sdk-native-sdui";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useFormField, useFormId } from "../../form/index.js";

/**
 * select_trigger — a generic, form-aware picker trigger styled as a read-only
 * INPUT. It looks like a text field (label + bordered box + value/placeholder +
 * chevron) but it has NO editing behaviour: tapping anywhere fires its
 * `on_click` (typically a `sheet` action that opens a picker whose body is a
 * single/multi `*_select_input` bound to the SAME field) instead of focusing a
 * keyboard. It displays the current value of its form field (single-select →
 * string, multi-select → string[], each id mapped via `value_display`).
 *
 * This is the "input with a custom click action, default input behaviour
 * suppressed" pattern: same visual grammar as `Input` / `DateField`, but a tap
 * is an action, not a focus.
 *
 * Wire `data`: { form_id, field_name, label?, default_value?, value_display?,
 *                placeholder?, required? }
 * A runtime node type (not yet in the SDK) — read raw; promote with the rest.
 */
export function SelectTriggerRenderer(node: Node): React.ReactElement {
  const data = node.data as
    | {
        form_id?: string;
        field_name?: string;
        label?: { text?: string };
        default_value?: string;
        value_display?: Record<string, string>;
        placeholder?: string;
        required?: boolean;
      }
    | undefined;

  const formId = useFormId(data?.form_id);
  const field = useFormField<string | string[]>(
    formId,
    data?.field_name,
    data?.default_value ?? "",
  );
  const actionEngine = useActionEngine();

  // Single-select → string, multi-select → string[]. Map each id to its rich
  // label via `value_display`; an empty value renders the placeholder (greyed).
  const mapLabel = (v: string): string => data?.value_display?.[v] ?? v;
  const value = field.value;
  const selectedText = Array.isArray(value)
    ? value.map(mapLabel).join(", ")
    : mapLabel(value);
  const isEmpty = Array.isArray(value) ? value.length === 0 : !value;

  const labelText = data?.label?.text
    ? `${data.label.text}${data?.required ? " *" : ""}`
    : undefined;

  return (
    <View style={styles.container}>
      {labelText ? <RNText style={styles.label}>{labelText}</RNText> : null}
      <Pressable
        onPress={() => node.on_click && actionEngine.dispatch(node.on_click)}
        style={styles.field}
      >
        <RNText
          style={[styles.value, isEmpty && styles.placeholder]}
          numberOfLines={1}
        >
          {isEmpty ? data?.placeholder ?? "Select" : selectedText}
        </RNText>
        <RNText style={styles.chevron}>▾</RNText>
      </Pressable>
    </View>
  );
}

// Mirrors the ui-native Input / DateField field styling so a select trigger
// sits flush with the text inputs around it in a form.
const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { fontSize: 13, color: sdui.color.neutralMedium, marginBottom: 6 },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: sdui.color.neutralWeak,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: sdui.color.neutralInverse,
  },
  value: { flex: 1, fontSize: 14, color: sdui.color.neutralStrong },
  placeholder: { color: sdui.color.neutralMedium },
  chevron: { fontSize: 14, color: sdui.color.neutralMedium, marginLeft: 8 },
});
