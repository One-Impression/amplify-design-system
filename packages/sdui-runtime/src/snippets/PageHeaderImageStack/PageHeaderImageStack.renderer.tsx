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
        // Resolver closes directly over the freshly-parsed `images` array
        // — a new function reference per render is deliberate. The
        // alternative of stashing `images` in a ref inside the render
        // body is a latent concurrent-mode hazard (the render-prop may
        // run for a discarded render and leave the ref pointing at a
        // never-committed value). DSImageStack tolerates a changing
        // `onImagePress` prop: each visible image keys by index and the
        // inner `Pressable` rebinds `onPress` on prop change without
        // remounting. Performance impact is negligible compared to the
        // correctness gain.
        const images = v.images as ImageEntry[];
        const onImagePress = (index: number) => {
          const onClick = images[index]?.on_click;
          if (!onClick) return undefined;
          return () => actionEngine.dispatch(onClick);
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
