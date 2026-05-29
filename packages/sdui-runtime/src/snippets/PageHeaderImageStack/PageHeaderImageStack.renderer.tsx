import React from "react";
import type { Node, Action } from "@one-impression/sdk-native-sdui";
import { PageHeaderImageStackSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text, ImageStack as DSImageStack } from "@one-impression/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

interface ImageEntry {
  src: string;
  on_click?: Action;
}

export function PageHeaderImageStackRenderer(node: Node): React.ReactElement {
  const actionEngine = useActionEngine();
  return (
    <SduiNode
      data={node.data}
      schema={PageHeaderImageStackSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => {
        // Handler is invoked by DSImageStack on actual press, with the
        // image's index. Closes over the freshly-parsed `images` array
        // directly — a new function reference per render is harmless
        // because DSImageStack only rebinds `Pressable.onPress` on prop
        // change. Images without an `on_click` no-op silently (still
        // press-feedback the tap, since avatars all look interactive).
        const images = v.images as ImageEntry[];
        const onImagePress = (index: number) => {
          const onClick = images[index]?.on_click;
          if (onClick) actionEngine.dispatch(onClick);
        };
        return (
          <Box padding={16}>
            <Stack direction="row" align="center" gap={12}>
              <Text
                color={v.title.color}
                size={v.title.font_size}
                weight={v.title.font_weight}
              >
                {v.title.text}
              </Text>
              {images.length > 0 && (
                <DSImageStack
                  images={images.map((img) => ({ uri: img.src }))}
                  onImagePress={onImagePress}
                />
              )}
            </Stack>
          </Box>
        );
      }}
    </SduiNode>
  );
}
