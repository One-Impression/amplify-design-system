import React, { useEffect, useRef, useState } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { AerobarSchema } from "@one-impression/sdk-native-sdui";
import { ScrollView, Box } from "@amplify-ai/ui-native";
import { SduiNode } from "../../sdui-node/index.js";
import { Interpreter } from "../../interpreter/index.js";

export function AerobarRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={AerobarSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => (
        <AerobarInner
          items={v.items}
          autoScroll={v.auto_scroll}
          intervalMs={v.interval_ms}
        />
      )}
    </SduiNode>
  );
}

function AerobarInner({
  items,
  autoScroll,
  intervalMs,
}: {
  items: Node[];
  autoScroll?: boolean;
  intervalMs?: number;
}): React.ReactElement {
  const scrollRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = items?.length ?? 0;

  useEffect(() => {
    if (!autoScroll || count <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % count;
        scrollRef.current?.scrollTo?.({ x: next * 300, animated: true });
        return next;
      });
    }, intervalMs ?? 3000);
    return () => clearInterval(interval);
  }, [autoScroll, intervalMs, count]);

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      ref={scrollRef}
    >
      {items?.map((item: Node, i: number) => (
        <Box key={item.id || i}>
          <Interpreter node={item} />
        </Box>
      ))}
    </ScrollView>
  );
}
