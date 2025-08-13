import { useReactFlow, useStore } from "@xyflow/react";
import { TableData } from "../types/table.node";
import { useMemo } from "react";

export function useTableNodes() {
  const nodes = useStore(state => state.nodes)

  return useMemo(() => {
    const tableNodes = nodes.filter((node) => node.type === 'table')
    const tables: TableData[] = tableNodes.map((node) => node.data) as any
    return {
      tables,
      tableNodes,
    }
  }, [nodes])
}