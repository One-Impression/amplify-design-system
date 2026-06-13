import React, { useCallback } from "react";
import { Pressable } from "react-native";
import type { Node } from "@one-impression/sdk-native-sdui";
import { PhoneNumberInputSchema } from "@one-impression/sdk-native-sdui";
import { Input as DSInput, Stack, Text } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useFormField, useFormId } from "../../form/index.js";
import { useBottomSheetStore } from "../../bottom-sheet/index.js";
import { presentSheet } from "../../navigation/sheetPresenter.js";
import { COUNTRIES, countryForDialCode, DEFAULT_COUNTRY } from "../../data/countries.js";
import type { ValidationRule } from "../../validation/index.js";

/**
 * Phone number = the generic Input + a leading country-code chip (NOT a bespoke
 * input). The chip opens a bottom sheet whose body is the `single_select_input`
 * we already built — bound to the same form via `form_id`, options sourced from
 * the runtime country dataset, with `on_change: dismiss` for tap-to-pick-and-close.
 * Two form fields result: the number (`field_name`) + the dial code
 * (`<field_name>_country_code`).
 */
export function PhoneNumberInputRenderer(node: Node): React.ReactElement {
  const data = node.data as
    | { form_id?: string; field_name?: string; value?: string; validations?: ValidationRule[] }
    | undefined;
  const formId = useFormId(data?.form_id);
  const fieldName = data?.field_name;
  const ccFieldName = fieldName ? `${fieldName}_country_code` : undefined;

  const numberField = useFormField<string>(
    formId,
    fieldName,
    data?.value ?? "",
    data?.validations,
  );
  const ccField = useFormField<string>(
    formId,
    ccFieldName,
    DEFAULT_COUNTRY.dialCode,
  );
  const register = useBottomSheetStore((s) => s.register);
  const actionEngine = useActionEngine();

  const errorText = numberField.touched ? numberField.error ?? undefined : undefined;

  // Build + register the country-picker sheet (single-select bound to the form's
  // country-code field) and present it. Reuses the route sheet + single-select.
  const openCountryPicker = useCallback(() => {
    if (!formId || !ccFieldName) return;
    const options: Node[] = COUNTRIES.map((c) => ({
      type: "creator.ui_component.selectable_item",
      id: `cc-${c.iso}`,
      data: {
        label: { text: `${c.flag}  ${c.name}` },
        subtitle: { text: c.dialCode },
        value: c.dialCode,
      },
    })) as unknown as Node[];

    const singleSelect = {
      type: "creator.snippet.single_select_input",
      id: `cc-select-${ccFieldName}`,
      data: {
        form_id: formId,
        field_name: ccFieldName,
        selected_value: ccField.value,
        // Tap a country → single-select writes the dial code → sheet dismisses.
        on_change: { type: "dismiss", payload: {} },
        options,
      },
    } as unknown as Node;

    const sheetId = `__cc_picker_${formId}_${ccFieldName}`;
    register(sheetId, {
      id: sheetId,
      title: "Select country",
      size: "large",
      items: [singleSelect],
    });
    presentSheet(sheetId);
  }, [formId, ccFieldName, ccField.value, register]);

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
      {(v) => {
        const country = countryForDialCode(ccField.value);
        const labelText = v.label?.text
          ? `${v.label.text}${v.required ? " *" : ""}`
          : undefined;
        const chip = (
          <Pressable onPress={openCountryPicker} disabled={v.disabled} hitSlop={6}>
            <Stack direction="row" align="center" gap={4}>
              <Text size={16}>{country.flag}</Text>
              <Text size={14} color="#222">{country.dialCode}</Text>
              <Text size={12} color="#999">▾</Text>
            </Stack>
          </Pressable>
        );
        return (
          <DSInput
            label={labelText}
            floatingLabel
            leading={chip}
            value={numberField.value}
            placeholder={v.placeholder?.text}
            disabled={v.disabled}
            error={!!errorText}
            helperText={errorText}
            keyboardType="phone-pad"
            onChangeText={(t) => {
              numberField.setValue(t);
              if (node.data?.on_change) actionEngine.dispatch(node.data.on_change as any);
            }}
            onBlur={() => {
              numberField.markTouched();
              if (node.data?.on_blur) actionEngine.dispatch(node.data.on_blur as any);
            }}
          />
        );
      }}
    </SduiNode>
  );
}
