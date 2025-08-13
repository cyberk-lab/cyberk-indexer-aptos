import { useReactFlow, useStore } from "@xyflow/react";
import { EventData } from "../types/event.node";
import { useMemo } from "react";

export function useEventNodes() {
  const nodes = useStore(state => state.nodes)

  return useMemo(() => {
    const eventNodes = nodes.filter((node) => node.type === 'event')
    const events: EventData[] = eventNodes.map((node) => node.data) as any
    return {
      events,
      eventNodes,
    }
  }, [nodes])
}