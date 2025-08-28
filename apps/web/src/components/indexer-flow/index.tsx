import React, { useCallback, useEffect, useRef, useState } from 'react'
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
  ReactFlowInstance,
  Node,
  ReactFlowProvider,
  Connection,
  Edge,
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
import EventNode from './nodes/event.node'
import TableNode from './nodes/table.node'
import EventStreamGroup from './nodes/stream.node'
import CollectionContainerNode from './nodes/container.node'
import BlockPanel from './panels/block.panel'
import ConfigPanel from './panels/config.panel'
import { BlockConfig } from './types/block.config'
import { extractEventsFromAptosModules } from './util/aptos-to-flow'
import { aptosEventToTypeorm } from './util/aptos-to-typeorm'
import { calculateListLayout, reorderListOnDrag, snapNodesToExactPositions, ExtendedNode } from './utils/layout'
import { LAYOUT_SPACING, NODE_SIZES } from './constants/node-sizes'
import { EventData } from './types/event.node'
import { TableData } from './types/table.node'
import StreamConfirmationDialog from './components/stream-confirmation-dialog'
import { createIndexerFlowStore, IndexerFlowContext, useIndexerFlowContext } from './states'

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
  collectionContainer: CollectionContainerNode,
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

  // Stream confirmation dialog state
  const [isStreamDialogOpen, setIsStreamDialogOpen] = useState(false)
  const [pendingStreamBlock, setPendingStreamBlock] = useState<BlockConfig | null>(null)
  const [pendingStreamPosition, setPendingStreamPosition] = useState<{ x: number; y: number } | null>(null)

  // Extract events and tables data for the dialog
  const events = extractEventsFromAptosModules(modules)
  const tables = aptosEventToTypeorm(events)

  // Configure edge rendering for sub-flows
  const defaultEdgeOptions = {
    zIndex: 1, // Ensure edges are rendered above nodes in sub-flows
  }

  const onNodeDrag = useCallback((event: any, draggedNode: Node) => {
    // Handle event nodes within event container
    if (draggedNode.type === 'event' && (draggedNode as any).parentId === 'event-collection-container') {
      // Reorder the list to prevent overlaps
      const updatedNodes = reorderListOnDrag(draggedNode as ExtendedNode, nodes as ExtendedNode[], 'event-collection-container')
      
      // Update the nodes state with the new order
      if (JSON.stringify(updatedNodes) !== JSON.stringify(nodes)) {
        setNodes(updatedNodes as any)
      }
    }
    
    // Handle table nodes within table container
    if (draggedNode.type === 'table' && (draggedNode as any).parentId === 'table-collection-container') {
      // Reorder the list to prevent overlaps
      const updatedNodes = reorderListOnDrag(draggedNode as ExtendedNode, nodes as ExtendedNode[], 'table-collection-container')
      
      // Update the nodes state with the new order
      if (JSON.stringify(updatedNodes) !== JSON.stringify(nodes)) {
        setNodes(updatedNodes as any)
      }
    }
  }, [nodes, setNodes])

  const onNodeDragStop = useCallback((event: any, draggedNode: Node) => {
    // Refine the final position when drag stops for event nodes
    if (draggedNode.type === 'event' && (draggedNode as any).parentId === 'event-collection-container') {
      // Snap all nodes to exact positions for perfect alignment
      const updatedNodes = snapNodesToExactPositions(nodes as ExtendedNode[], 'event-collection-container')
      
      // Update the nodes state with refined positions
      setNodes(updatedNodes as any)
    }
    
    // Refine the final position when drag stops for table nodes
    if (draggedNode.type === 'table' && (draggedNode as any).parentId === 'table-collection-container') {
      // Snap all nodes to exact positions for perfect alignment
      const updatedNodes = snapNodesToExactPositions(nodes as ExtendedNode[], 'table-collection-container')
      
      // Update the nodes state with refined positions
      setNodes(updatedNodes as any)
    }
  }, [nodes, setNodes])

  useEffect(() => {
    const events = extractEventsFromAptosModules(modules)
    const tables = aptosEventToTypeorm(events)

    if (!events.length) return
    console.log('events', events)
    console.log('tables', tables)

    // Create event collection container
    const eventContainerWidth = 400
    const eventContainerHeight = Math.max(400, LAYOUT_SPACING.BOX_HEADER_HEIGHT + (events.length * (NODE_SIZES.EVENT.HEIGHT + LAYOUT_SPACING.ROW_GAP)))
    
    const eventContainerNode = {
      id: 'event-collection-container',
      type: 'collectionContainer',
      position: { x: LAYOUT_SPACING.START_X, y: LAYOUT_SPACING.START_Y },
      data: {
        title: 'Event Collection',
        items: events,
        type: 'event',
      },
      width: eventContainerWidth,
      height: eventContainerHeight,
      draggable: true,
    }

    // Create table collection container
    const tableContainerWidth = 400
    const tableContainerHeight = Math.max(400, LAYOUT_SPACING.BOX_HEADER_HEIGHT + (tables.length * (NODE_SIZES.TABLE.HEIGHT + LAYOUT_SPACING.ROW_GAP)))
    
    const tableContainerNode = {
      id: 'table-collection-container',
      type: 'collectionContainer',
      position: { x: LAYOUT_SPACING.START_X + eventContainerWidth + LAYOUT_SPACING.COLUMN_GAP, y: LAYOUT_SPACING.START_Y },
      data: {
        title: 'Table Collection',
        items: tables,
        type: 'table',
      },
      width: tableContainerWidth,
      height: tableContainerHeight,
      draggable: true,
    }

    // Create event nodes with proper layout within event container
    const eventBoxPadding = (eventContainerWidth - NODE_SIZES.EVENT.WIDTH) / 2
    const eventLayoutResult = calculateListLayout(events.map((e) => ({
      id: `${e.module}-${e.name}`,
      type: 'event',
      data: e,
    })), eventBoxPadding, 0)
    
    // Add parentId to all event nodes to make them children of the event container
    const eventNodesWithParent = eventLayoutResult.nodes.map(node => ({
      ...node,
      parentId: 'event-collection-container',
      extent: 'parent',
    }))

    // Create table nodes with proper layout within table container
    const tableBoxPadding = (tableContainerWidth - NODE_SIZES.TABLE.WIDTH) / 2
    const tableLayoutResult = calculateListLayout(tables.map((t) => ({
      id: t.name,
      type: 'table',
      data: t,
    })), tableBoxPadding, 0)
    
    // Add parentId to all table nodes to make them children of the table container
    const tableNodesWithParent = tableLayoutResult.nodes.map(node => ({
      ...node,
      parentId: 'table-collection-container',
      extent: 'parent',
    }))
    
    console.log('Layout calculated:', {
      eventContainer: {
        width: eventContainerWidth,
        height: eventContainerHeight,
        padding: eventBoxPadding,
        nodes: eventNodesWithParent.map(n => ({ id: n.id, x: n.position.x, y: n.position.y }))
      },
      tableContainer: {
        width: tableContainerWidth,
        height: tableContainerHeight,
        padding: tableBoxPadding,
        nodes: tableNodesWithParent.map(n => ({ id: n.id, x: n.position.x, y: n.position.y }))
      }
    })
    
    // Add all containers and nodes
    const allNodes = [
      eventContainerNode, 
      tableContainerNode, 
      ...eventNodesWithParent, 
      ...tableNodesWithParent
    ]
    setNodes((nds) => nds.concat(allNodes as any))
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

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowRef.current?.getBoundingClientRect()
      if (!reactFlowBounds) return

      const blockData = JSON.parse(event.dataTransfer.getData('application/reactflow')) as BlockConfig & { diffX: number; diffY: number }
      
      if (blockData.key === 'stream') {
        // For stream blocks, show confirmation dialog instead of immediately creating the node
        setPendingStreamBlock(blockData)
        setPendingStreamPosition({
          x: event.clientX - reactFlowBounds.left - blockData.diffX,
          y: event.clientY - reactFlowBounds.top - blockData.diffY,
        })
        setIsStreamDialogOpen(true)
        return
      }

      // For other block types, create the node immediately
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left - blockData.diffX,
        y: event.clientY - reactFlowBounds.top - blockData.diffY,
      })

      if (position) {
        const newNode: Node = {
          id: uniqueId(),
          type: blockData.key,
          position,
          data: blockData,
        }

        setNodes((nds) => nds.concat(newNode))
      }
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
            onDrop={onDrop}
            onDragOver={onReactFlowDragOver}
            defaultEdgeOptions={defaultEdgeOptions}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel style={{ minWidth: '400px' }} defaultSize={15} minSize={15}>
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
      <StreamConfirmationDialog
        isOpen={isStreamDialogOpen}
        onClose={() => setIsStreamDialogOpen(false)}
        onConfirm={(eventSource: EventData, tableTarget: TableData) => {
          if (pendingStreamBlock && pendingStreamPosition) {
            // Create the stream node
            const streamNode: Node = {
              id: uniqueId(),
              type: 'stream',
              position: pendingStreamPosition,
              connectable: false, // Disable all connections
              data: {
                ...pendingStreamBlock,
                eventSource,
                tableTarget,
              },
            }
            
            // Create connections from event source to stream and from stream to table target
            const eventNode = nodes.find(n => 
              n.type === 'event' && 
              n.data.name === eventSource.name && 
              n.data.module === eventSource.module
            )
            
            const tableNode = nodes.find(n => 
              n.type === 'table' && 
              n.data.name === tableTarget.name
            )
            
            const newEdges: Edge[] = []
            
            if (eventNode) {
              newEdges.push({
                id: uniqueId(),
                source: eventNode.id,
                target: streamNode.id,
                type: 'smoothstep',
              })
            }
            
            if (tableNode) {
              newEdges.push({
                id: uniqueId(),
                source: streamNode.id,
                target: tableNode.id,
                type: 'smoothstep',
              })
            }
            
            // Add the stream node and edges
            setNodes((nds) => nds.concat(streamNode))
            setEdges((eds) => eds.concat(newEdges))
            
            // Reset dialog state
            setIsStreamDialogOpen(false)
            setPendingStreamBlock(null)
            setPendingStreamPosition(null)
          }
        }}
        events={events}
        tables={tables}
      />
    </ResizablePanelGroup>
  )
}
