import React from "react";
import { z } from "zod";
import type { Node } from "@one-impression/sdk-native-sdui";
import { DateField } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useFormField, useFormId } from "../../form/index.js";
import type { ValidationRule } from "../../validation/index.js";

/**
 * `date_input` — a form-bound date field. Renders the ui-native `DateField`
 * (a pure-JS calendar popover, no native module) and binds its ISO `YYYY-MM-DD`
 * value into `useFormStore` by `(form_id, field_name)`, exactly like the text /
 * select inputs. The data schema is defined here (renderer-owned) rather than in
 * `sdk-native-sdui`, so the gateway emits it as raw wire — the same posture the
 * form `submit` action and `validations` already use.
 */
const LabelSchema = z
  .object({
    text: z.string().optional(),
    color: z.string().optional(),
    font_size: z.number().optional(),
    font_weight: z.string().optional(),
  })
  .passthrough();

export const DateInputDataSchema = z
  .object({
    form_id: z.string().optional(),
    field_name: z.string().optional(),
    /** ISO `YYYY-MM-DD` default. */
    value: z.string().optional(),
    label: LabelSchema.optional(),
    placeholder: z.object({ text: z.string().optional() }).passthrough().optional(),
    required: z.boolean().optional(),
    disabled: z.boolean().optional(),
    /** ISO `YYYY-MM-DD` selectable bounds. */
    min_date: z.string().optional(),
    max_date: z.string().optional(),
    // Validation rules are evaluated by useFormField; kept loose here (the rule
    // shape lives in the validation module, read raw off the wire).
    validations: z.array(z.any()).optional(),
  })
  .passthrough();

export function DateInputRenderer(node: Node): React.ReactElement {
  // Form binding reads the raw wire (form_id / field_name / validations), the
  // same split the other input renderers use; presentation reads the parsed `v`.
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
  const errorText = field.touched ? field.error ?? undefined : undefined;

  return (
    <SduiNode
      data={node.data}
      schema={DateInputDataSchema}
      id={node.id}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <DateField
          label={
            v.label?.text ? `${v.label.text}${v.required ? " *" : ""}` : undefined
          }
          value={field.value || undefined}
          placeholder={v.placeholder?.text}
          error={!!errorText}
          helperText={errorText}
          disabled={v.disabled}
          minDate={v.min_date}
          maxDate={v.max_date}
          onOpen={field.markTouched}
          onChange={field.setValue}
        />
      )}
    </SduiNode>
  );
}
