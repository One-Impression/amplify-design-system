import React, { useEffect, type ComponentType } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { useFormStore } from "../state/useFormStore.js";
import { useFormId } from "../form/index.js";
import { evaluateShowWhen, type ShowWhen } from "./show-when.js";

/**
 * Gates a node's render on its `show_when` rule (see {@link evaluateShowWhen}).
 * Mounted by the Interpreter ONLY for nodes that carry `show_when`, so the
 * form-store subscription is paid only where conditional visibility is used.
 *
 * When the node is a form field and becomes hidden, its error is cleared so a
 * stale (e.g. `required`) error can't block the form's validity gate — the
 * hidden field simply drops out of validation. The value is left intact, so
 * toggling the field back on restores what the user had typed.
 */
export function ConditionalGate({
  node,
  Renderer,
}: {
  node: Node;
  Renderer: ComponentType<Node>;
}): React.ReactElement | null {
  const rule = (node as { show_when?: ShowWhen }).show_when as ShowWhen;
  const explicitFormId =
    rule.form_id ?? (node.data as { form_id?: string } | undefined)?.form_id;
  const formId = useFormId(explicitFormId);

  const controllingValue = useFormStore((s) =>
    formId ? s.forms[formId]?.values[rule.field] : undefined,
  );
  const setErrors = useFormStore((s) => s.setErrors);

  // Fail open: can't resolve the form → show the field rather than hide it.
  const visible = formId ? evaluateShowWhen(rule, controllingValue) : true;

  const fieldName = (node.data as { field_name?: string } | undefined)?.field_name;
  useEffect(() => {
    if (!visible && formId && fieldName) {
      setErrors(formId, { [fieldName]: null });
    }
  }, [visible, formId, fieldName, setErrors]);

  if (!visible) return null;
  return <Renderer {...node} />;
}
