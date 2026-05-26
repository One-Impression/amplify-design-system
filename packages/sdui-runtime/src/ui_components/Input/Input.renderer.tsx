import React, { useState, useCallback, useRef } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { InputComponentSchema } from "@one-impression/sdk-native-sdui";
import { Input as DSInput } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useFormContext } from "../../snippets/Form/Form.renderer.js";

export function InputRenderer(node: Node): React.ReactElement {
  // `field_name` is a runtime extension: not part of the strict zod
  // schema (which strips unknown keys), so we read it off the raw node
  // data before SduiNode validates. When the Input is inside a Form
  // and `field_name` is set, its value is propagated to FormContext on
  // every keystroke; otherwise it behaves as a stand-alone controlled
  // input.
  const fieldName = (node.data as { field_name?: unknown } | undefined)
    ?.field_name;
  const fieldNameStr = typeof fieldName === "string" ? fieldName : undefined;

  return (
    <SduiNode
      data={node.data}
      schema={InputComponentSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => <InputInner fieldName={fieldNameStr} validated={v} />}
    </SduiNode>
  );
}

interface InputInnerProps {
  fieldName?: string;
  validated: {
    placeholder?: string;
    value?: string;
    label?: { data: { text: string } };
    disabled?: boolean;
    max_length?: number;
    multiline?: boolean;
  };
}

function InputInner({
  fieldName,
  validated: v,
}: InputInnerProps): React.ReactElement {
  // Local UI state — keeps the controlled component cursor-stable
  // without re-rendering the whole Form on every keystroke.
  const [localValue, setLocalValue] = useState<string>(v.value ?? "");
  const formCtx = useFormContext();

  // Capture mount-time values in refs so the seed effect can read them
  // without depending on potentially-changing fieldName / formCtx
  // identities. Refs are stable across renders → empty deps are
  // self-evident and require no eslint suppression.
  const fieldNameRef = useRef(fieldName);
  const formCtxRef = useRef(formCtx);
  const initialValueRef = useRef(v.value);

  // Seed FormContext with the server-provided initial value once on
  // mount, so the submit-time merge sees the default even if the user
  // never edits the field.
  React.useEffect(() => {
    const fn = fieldNameRef.current;
    const init = initialValueRef.current;
    if (fn && init !== undefined) {
      formCtxRef.current.setValue(fn, init);
    }
  }, []);

  const handleChangeText = useCallback(
    (next: string) => {
      setLocalValue(next);
      if (fieldName) {
        formCtx.setValue(fieldName, next);
      }
    },
    [fieldName, formCtx],
  );

  return (
    <DSInput
      placeholder={v.placeholder}
      value={localValue}
      onChangeText={handleChangeText}
      label={v.label ? v.label.data.text : undefined}
      disabled={v.disabled}
      maxLength={v.max_length}
      multiline={v.multiline}
    />
  );
}
