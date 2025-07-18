import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AptosModule } from '@/types/aptos.type'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  XYPosition,
  ReactFlowInstance,
  Node,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'
import EventNode from './nodes/data/event.node'
import TableNode from './nodes/data/table.node'
import EventStreamGroup from './nodes/group/event-stream.group'
import StreamQueryNode from './nodes/stream/stream-query.node'
import { extractEventsFromAptosModules } from './util/aptos-to-flow'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import BlockPanel from './panels/block.panel'
import ConfigPanel from './panels/config.panel'
import { BlockConfig } from './types/block.config'
import { uniqueId } from 'lodash'
import { aptosEventToTypeorm } from './util/aptos-to-typeorm'


export default function IndexerFlow({ modules }: { modules: AptosModule[] }) {
  return(
    <ReactFlowProvider>
      <Indexer modules={modules} />
    </ReactFlowProvider>
  )
}

const nodeTypes = {
  event: EventNode,
  table: TableNode,
  eventStream: EventStreamGroup,
  streamQuery: StreamQueryNode,
}

function Indexer({ modules }: { modules: AptosModule[] }) {
  const reactFlowRef = useRef<HTMLDivElement>(null)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    const events = extractEventsFromAptosModules(modules)
    if (!events.length) return
    console.log('events', events)
    const eventNodes = events.map((e, i) => ({
      id: `${e.module}-${e.name}`,
      position: { x: -50, y: 50 + i * 250 } as XYPosition,
      type: 'event',
      data: e,
    }))
    setNodes(nds => nds.concat(eventNodes as any))

    const tables = aptosEventToTypeorm(events)
    const tableNodes = tables.map((t, i) => ({
      id: `table-${t.name}`,
      position: { x: 600, y: 50 + i * 250 } as XYPosition,
      type: 'table',
      data: t,
    }))
    console.log('tables', tables)
    setNodes(nds => nds.concat(tableNodes as any))
  }, [modules, setNodes])

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<Node, never> | null>(null)

  const onConnect = useCallback(
    (_params: any) => setEdges((eds) => {
      console.log('onConnect', { _params, eds })
      const results = addEdge(_params, eds)
      return results
    }),
    [setEdges]
  )

  const onBlockDragStart = useCallback((e: React.DragEvent<HTMLElement>, block: BlockConfig) => {
    e.dataTransfer.setData('application/json', JSON.stringify(block))
    e.dataTransfer.effectAllowed = 'move'
    console.log('onBlockDragStart', { e })
  }, [])

  const onReactFlowDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onReactFlowDrop = useCallback((e: React.DragEvent<HTMLElement>) => {
    const block = JSON.parse(e.dataTransfer.getData('application/json'))
    const reactFlowBounds = reactFlowRef.current?.getBoundingClientRect()
    const blockData: BlockConfig & { diffX: number; diffY: number}  = JSON.parse(
      e.dataTransfer.getData('application/json')
    )
    console.log('onReactFlowDrop', { blockData, reactFlowBounds })

    if (!reactFlowBounds || !blockData || !reactFlowInstance) return

    const dropPosition = reactFlowInstance?.screenToFlowPosition({
      x: e.clientX + blockData.diffX,
      y: e.clientY + blockData.diffY,
    })

    setNodes((nds) => nds.concat({
      id: uniqueId(),
      position: dropPosition,
      type: 'eventStream',
      data: block,
      width: 200,
      height: 100,
    }))
  }, [reactFlowInstance, setNodes])

  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel>
        <div className='h-full w-full'>
          <ReactFlow
            ref={reactFlowRef}
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
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
            <Background variant='dots' gap={12} size={1} />
          </ReactFlow>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={15}>
        <Accordion type='multiple' defaultValue={['block', 'setting']}>
          <AccordionItem key='block' value='block'>
            <AccordionTrigger className='text-sm font-medium capitalize px-2'>
              Block
            </AccordionTrigger>
            <AccordionContent>
              <BlockPanel onDragStart={onBlockDragStart} className='px-2' />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem key='setting' value='setting'>
            <AccordionTrigger className='text-sm font-medium capitalize px-2'>
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

