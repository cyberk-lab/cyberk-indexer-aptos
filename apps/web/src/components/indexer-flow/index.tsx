import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AptosModule } from '@/types/aptos.type'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  XYPosition,
  ReactFlowInstance,
  Node,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { uniqueId } from 'lodash'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../ui/resizable'
import EventNode from './nodes/data/event.node'
import TableNode from './nodes/data/table.node'
import EventStreamGroup from './nodes/group/event-stream.group'
import StreamQueryNode from './nodes/stream/stream-query.node'
import BlockPanel from './panels/block.panel'
import ConfigPanel from './panels/config.panel'
import { BlockConfig } from './types/block.config'
import { extractEventsFromAptosModules } from './util/aptos-to-flow'
import { aptosEventToTypeorm } from './util/aptos-to-typeorm'
import { createIndexerFlowStore, IndexerFlowContext, useIndexerFlowContext } from './states'
import { useStore } from 'zustand'
import { calculateGridLayout, calculateVerticalLayout } from './utils/layout'
import { LAYOUT_SPACING, testCalculateNodeHeight } from './constants/node-sizes'

export default function IndexerFlow({ modules }: { modules: AptosModule[] }) {
  console.log('IndexerFlow=', modules)
  const store = useRef(createIndexerFlowStore()).current
  return (
    <ReactFlowProvider>
      <IndexerFlowContext.Provider value={store}>
        <Indexer modules={modules} />
      </IndexerFlowContext.Provider>
    </ReactFlowProvider>
  )
}

const nodeTypes = {
  event: EventNode,
  table: TableNode,
  stream: EventStreamGroup,
  // streamQuery: StreamQueryNode,
}

function Indexer({ modules }: { modules: AptosModule[] }) {
  const reactFlowRef = useRef<HTMLDivElement>(null)

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([])

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    Node,
    any
  > | null>(null)

  useEffect(() => {
    const events = extractEventsFromAptosModules(modules)
    if (!events.length) return
    console.log('events', events)
    
    // Create event nodes with proper layout
    const eventNodes = events.map((e) => ({
      id: `${e.module}-${e.name}`,
      type: 'event',
      data: e,
    }))
    
    const layoutResult = calculateVerticalLayout(eventNodes)
    
    setNodes((nds) => nds.concat(layoutResult.nodes as any))
  }, [modules, setNodes])

  // const store = useContext(IndexerFlowContext)
  // if (!store) throw new Error('Missing IndexerFlowContext.Provider in the tree')

  const setSelectedNode = useIndexerFlowContext(s => s.setSelectedNode)

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.log('onNodeClick', { event, node })
      setSelectedNode(node)
    },
    [setSelectedNode]
  )

  const onConnect = useCallback(
    (_params: any) =>
      setEdges((eds) => {
        console.log('onConnect', { _params, eds })
        const results = addEdge(_params, eds)
        return results
      }),
    [setEdges]
  )

  const onBlockDragStart = useCallback(
    (e: React.DragEvent<HTMLElement>, block: BlockConfig) => {
      e.dataTransfer.setData('application/json', JSON.stringify(block))
      e.dataTransfer.effectAllowed = 'move'
      console.log('onBlockDragStart', { e })
    },
    []
  )

  const onReactFlowDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onReactFlowDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      const block = JSON.parse(e.dataTransfer.getData('application/json'))
      const reactFlowBounds = reactFlowRef.current?.getBoundingClientRect()
      const blockData: BlockConfig & { diffX: number; diffY: number } =
        JSON.parse(e.dataTransfer.getData('application/json'))
      console.log('onReactFlowDrop', { blockData, reactFlowBounds })

      if (!reactFlowBounds || !blockData || !reactFlowInstance) return

      const dropPosition = reactFlowInstance?.screenToFlowPosition({
        x: e.clientX + blockData.diffX,
        y: e.clientY + blockData.diffY,
      })

      setNodes((nds) =>
        nds.concat({
          id: uniqueId(),
          position: dropPosition,
          type: block.key,
          data: block,
          width: 200,
          height: 100,
        } as Node)
      )
    },
    [reactFlowInstance, setNodes]
  )

  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel>
        <div className='h-full w-full'>
          <ReactFlow
            ref={reactFlowRef}
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            fitView
            attributionPosition='bottom-left'
            onDrop={onReactFlowDrop}
            onDragOver={onReactFlowDragOver}
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={15}>
        <Accordion type='multiple' defaultValue={['block', 'setting']}>
          <AccordionItem key='block' value='block'>
            <AccordionTrigger className='px-2 text-sm font-medium capitalize'>
              Block
            </AccordionTrigger>
            <AccordionContent>
              <BlockPanel onDragStart={onBlockDragStart} className='px-2' />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem key='setting' value='setting'>
            <AccordionTrigger className='px-2 text-sm font-medium capitalize'>
              Setting
            </AccordionTrigger>
            <AccordionContent>
              <ConfigPanel />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
