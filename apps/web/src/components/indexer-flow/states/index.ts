import { createStore, useStore } from "zustand";
import { Node } from "@xyflow/react";
import { createContext, useContext } from "react";

interface IndexerFlowProps {
    selectedNode: Node | null
}

interface IndexerFlowState extends IndexerFlowProps {
    setSelectedNode: (node: Node | null) => void
}

export type IndexerFlowStore = ReturnType<typeof createIndexerFlowStore>

export const createIndexerFlowStore = () => {
    return createStore<IndexerFlowState>()((set) => ({
        selectedNode: null,
        setSelectedNode: (node) => set({ selectedNode: node }),
    }))
}

export const IndexerFlowContext = createContext<IndexerFlowStore | null>(null)

export function useIndexerFlowContext<T>(selector: (state: IndexerFlowState) => T): T {
    const store = useContext(IndexerFlowContext)
    if (!store) throw new Error('Missing IndexerFlowContext.Provider in the tree')
    return useStore(store, selector)
  }
  
  