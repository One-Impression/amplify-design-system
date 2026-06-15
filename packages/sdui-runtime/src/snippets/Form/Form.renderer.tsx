import React, { createContext, useContext, useRef, useCallback, useEffect } from "react";
import { Pressable } from "react-native";
import type { Node } from "@one-impression/sdk-native-sdui";
import { FormSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { FormIdContext } from "../../form/index.js";
import { useFormStore } from "../../state/index.js";
import { mergeFormValuesIntoAction } from "./form-values.js";
import type { FormState } from "./form-values.js";

export { mergeFormValuesIntoAction } from "./form-values.js";
export type { FormState } from "./form-values.js";

export const FormContext = createContext<FormState>({
  values: {},
  setValue: () => {},
  getValues: () => ({}),
});

export function useFormContext(): FormState {
  return useContext(FormContext);
}

export function FormRenderer(node: Node): React.ReactElement {
  // `form_id` is a wire extension (not yet in FormSchema — read raw, promote to
  // the SDK later). Falls back to the node id so a form always has an id.
  const formId =
    (node.data as { form_id?: string } | undefined)?.form_id ?? node.id;

  // Register the form in the store on mount; drop it on unmount so navigating
  // away doesn't leave orphan form state. Idempotent + non-destructive.
  const register = useFormStore((s) => s.register);
  const unregister = useFormStore((s) => s.unregister);
  useEffect(() => {
    register(formId);
    return () => unregister(formId);
  }, [formId, register, unregister]);

  return (
    <SduiNode
      data={node.data}
      schema={FormSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        // Provide the form id to nested fields (id-only; state lives in the store).
        <FormIdContext.Provider value={formId}>
          <FormInner fields={v.fields} submitButton={v.submit_button} />
        </FormIdContext.Provider>
      )}
    </SduiNode>
  );
}

function FormInner({
  fields,
  submitButton,
}: {
  fields: Node[];
  submitButton?: Node;
}): React.ReactElement {
  // Ref-backed values store — avoids re-rendering the whole Form
  // (and every controlled Input) on every keystroke. Inputs read
  // their local UI state from their own useState; FormContext just
  // collects the latest snapshot for submit-time merge.
  const valuesRef = useRef<Record<string, unknown>>({});

  const setValue = useCallback((key: string, value: unknown) => {
    valuesRef.current[key] = value;
  }, []);

  const getValues = useCallback(() => valuesRef.current, []);

  const formState: FormState = {
    values: valuesRef.current,
    setValue,
    getValues,
  };

  return (
    <FormContext.Provider value={formState}>
      <Box>
        <Stack direction="column" gap={16}>
          {fields?.map((field: Node, i: number) => (
            <Interpreter key={field.id || i} node={field} />
          ))}
        </Stack>
        {submitButton && (
          <Box paddingTop={16}>
            <FormSubmitWrapper
              submitButton={submitButton}
              getValues={getValues}
            />
          </Box>
        )}
      </Box>
    </FormContext.Provider>
  );
}

/**
 * FormSubmitWrapper — intercepts the submit button's `on_click` so that
 * at click time we merge `getValues()` into a `bff_call` action's
 * `payload.request_body`. The button's own dispatch chain is removed
 * from the rendered node (so the inner Clickable becomes a no-op) and
 * we dispatch the transformed action from this outer Pressable.
 *
 * For non-bff_call actions, the original action is dispatched as-is.
 * When the button has no `on_click` (rare — typically misconfigured),
 * rendering falls through unchanged.
 */
export function FormSubmitWrapper({
  submitButton,
  getValues,
}: {
  submitButton: Node;
  getValues: () => Record<string, unknown>;
}): React.ReactElement {
  const actionEngine = useActionEngine();
  const onClick = submitButton.on_click;

  if (!onClick) {
    return <Interpreter node={submitButton} />;
  }

  // Clone with on_click stripped — the inner SduiNode/Clickable should
  // not also fire the action; we own dispatch here.
  const buttonWithoutClick: Node = { ...submitButton, on_click: undefined };

  const handlePress = (): void => {
    const merged = mergeFormValuesIntoAction(onClick, getValues());
    actionEngine.dispatch(merged);
  };

  return (
    <Pressable onPress={handlePress} accessibilityRole="button">
      <Interpreter node={buttonWithoutClick} />
    </Pressable>
  );
}

