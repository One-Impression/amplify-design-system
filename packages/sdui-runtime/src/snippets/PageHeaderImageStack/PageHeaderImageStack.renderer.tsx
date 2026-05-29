import React, { useCallback } from "react";
import type { Node, Action } from "@one-impression/sdk-native-sdui";
import { PageHeaderImageStackSchema } from "@one-impression/sdk-native-sdui";
import { Box, Stack, Text, ImageStack as DSImageStack } from "@one-impression/ui-native";
import type { ActionEngine } from "../../action-engine/types.js";
import { SduiNode } from "../../sdui-node/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";

interface ImageEntry {
  src: string;
  on_click?: Action;
}

interface PageHeaderImageStackBodyProps {
  actionEngine: ActionEngine;
  title: { text: string; color?: string; font_size?: string; font_weight?: string };
  images: ImageEntry[];
}

/**
 * Inner body — receives the parsed data as plain props from the SduiNode
 * render-prop so standard hooks compose normally. `onImagePress` closes
 * over `images` and re-allocates when that prop changes, which is exactly
 * what we want: a new array means new per-index `on_click` targets.
 * DSImageStack's inner `Pressable` rebinds `onPress` on prop change
 * without remounting, so the new reference is cheap.
 */
function PageHeaderImageStackBody({
  actionEngine,
  title,
  images,
}: PageHeaderImageStackBodyProps): React.ReactElement {
  const onImagePress = useCallback(
    (index: number) => {
      const onClick = images[index]?.on_click;
      if (onClick) actionEngine.dispatch(onClick);
    },
    [images, actionEngine],
  );
  return (
    <Box padding={16}>
      <Stack direction="row" align="center" gap={12}>
        <Text
          color={title.color}
          size={title.font_size}
          weight={title.font_weight}
        >
          {title.text}
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
      {(v) => (
        <PageHeaderImageStackBody
          actionEngine={actionEngine}
          title={v.title}
          images={v.images as ImageEntry[]}
        />
      )}
    </SduiNode>
  );
}
