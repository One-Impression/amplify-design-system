import React, { createContext, useContext, useRef, useCallback } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { FormSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

interface FormState {
  values: Record<string, unknown>;
  setValue: (key: string, value: unknown) => void;
  getValues: () => Record<string, unknown>;
}

export const FormContext = createContext<FormState>({
  values: {},
  setValue: () => {},
  getValues: () => ({}),
});

export function useFormContext(): FormState {
  return useContext(FormContext);
}

export function FormRenderer(node: Node): React.ReactElement {
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
        <FormInner fields={v.fields} submitButton={v.submit_button} />
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
  const valuesRef = useRef<Record<string, unknown>>({});
  const actionEngine = useActionEngine();

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
            <Interpreter node={submitButton} />
          </Box>
        )}
      </Box>
    </FormContext.Provider>
  );
}
