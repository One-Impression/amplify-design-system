import React, { useCallback, useRef } from "react";
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
  // Latest parsed images are mirrored into a ref so `onImagePress` can stay
  // referentially stable across renders without re-allocating per image.
  // The ref write below in the render-prop is guarded — React supports
  // setting refs during render only when the new value differs from the
  // current one, which keeps this concurrent-mode safe (a discarded
  // render writes the same value the committed one would).
  const imagesRef = useRef<ImageEntry[]>([]);
  const onImagePress = useCallback(
    (index: number) => {
      const onClick = imagesRef.current[index]?.on_click;
      if (onClick) actionEngine.dispatch(onClick);
    },
    [actionEngine],
  );
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
        const images = v.images as ImageEntry[];
        if (imagesRef.current !== images) {
          imagesRef.current = images;
        }
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
