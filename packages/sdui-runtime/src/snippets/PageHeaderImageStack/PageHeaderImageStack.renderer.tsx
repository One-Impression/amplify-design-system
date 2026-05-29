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
  // Latest parsed images are stashed in a ref so the per-image press
  // resolver below can stay referentially stable across parent re-renders
  // — DSImageStack would otherwise see a new `onImagePress` prop on
  // every paint and re-mount the inner Pressable wrappers.
  const imagesRef = useRef<ImageEntry[]>([]);
  const onImagePress = useCallback(
    (index: number) => {
      const onClick = imagesRef.current[index]?.on_click;
      if (!onClick) return undefined;
      return () => actionEngine.dispatch(onClick);
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
        // Each render of the SduiNode child receives the freshly parsed
        // data; mirror it into the ref so the stable `onImagePress`
        // closure above reads the latest `on_click` per index.
        const images = v.images as ImageEntry[];
        imagesRef.current = images;
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
