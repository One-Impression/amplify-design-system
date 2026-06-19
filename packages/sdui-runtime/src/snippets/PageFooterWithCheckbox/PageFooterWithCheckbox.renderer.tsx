import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { PageFooterWithCheckboxSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function PageFooterWithCheckboxRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={PageFooterWithCheckboxSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <Box padding={16}>
          <Stack direction="column" gap={12}>
            <Interpreter node={v.checkbox} />
            {/* With a secondary action the two buttons sit in a right-aligned
                row; with only a primary CTA it spans full width (the standard
                footer action), matching the plain page_footer bar. */}
            {v.secondary_button ? (
              <Stack direction="row" gap={12} justify="flex-end">
                <Interpreter node={v.secondary_button} />
                {v.primary_button && <Interpreter node={v.primary_button} />}
              </Stack>
            ) : (
              v.primary_button && <Interpreter node={v.primary_button} />
            )}
          </Stack>
        </Box>
      )}
    </SduiNode>
  );
}
