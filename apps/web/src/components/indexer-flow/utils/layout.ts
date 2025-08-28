import { XYPosition, Node } from '@xyflow/react'
import { LAYOUT_SPACING, NODE_SIZES, calculateNodeHeight } from '../constants/node-sizes'

export interface LayoutNode {
  id: string
  type: string
  data: any
  width?: number
  height?: number
}

export interface LayoutResult {
  nodes: Array<{
    id: string
    position: XYPosition
    type: string
    data: any
    width?: number
    height?: number
  }>
}

// Extended Node interface for our use case
export interface ExtendedNode extends Node {
  parentId?: string
  type: string
}

/**
 * Calculate positions for event nodes within an event box container
 * For sub-flows, positions are relative to the parent (0,0 is top-left of parent)
 */
export const calculateEventBoxLayout = (
  eventNodes: LayoutNode[],
  boxStartX: number = 0, // Use 0 for relative positioning in sub-flows
  boxStartY: number = 0  // Use 0 for relative positioning in sub-flows
): LayoutResult => {
  const result: LayoutResult = { nodes: [] }
  
  // Arrange events in a single column
  const eventSpacing = LAYOUT_SPACING.ROW_GAP
  const boxPadding = LAYOUT_SPACING.BOX_PADDING
  
  eventNodes.forEach((node, index) => {
    // For sub-flows, positions are relative to parent
    const x = boxStartX + boxPadding
    const y = boxStartY + boxPadding + (index * (NODE_SIZES.EVENT.HEIGHT + eventSpacing))
    
    result.nodes.push({
      id: node.id,
      position: { x, y },
      type: node.type,
      data: node.data,
      width: NODE_SIZES.EVENT.WIDTH,
      height: NODE_SIZES.EVENT.HEIGHT,
    })
  })
  
  return result
}

/**
 * Calculate optimal positions for nodes in a grid layout
 */
export const calculateGridLayout = (
  eventNodes: LayoutNode[],
  tableNodes: LayoutNode[] = [],
  streamNodes: LayoutNode[] = []
): LayoutResult => {
  const result: LayoutResult = { nodes: [] }
  
  // Position event nodes in the first column within an event box
  let currentY = LAYOUT_SPACING.START_Y
  eventNodes.forEach((node, index) => {
    const height = calculateNodeHeight('EVENT', 0) // Event nodes now have fixed height
    
    result.nodes.push({
      id: node.id,
      position: {
        x: LAYOUT_SPACING.START_X,
        y: currentY,
      },
      type: node.type,
      data: node.data,
      width: NODE_SIZES.EVENT.WIDTH,
      height,
    })
    
    // Add gap between nodes, but consider the actual height
    currentY += height + LAYOUT_SPACING.ROW_GAP
  })
  
  // Position table nodes in the second column
  if (tableNodes.length > 0) {
    currentY = LAYOUT_SPACING.START_Y
    tableNodes.forEach((node, index) => {
      const height = calculateNodeHeight('TABLE', node.data.columns?.length || 0)
      
      result.nodes.push({
        id: node.id,
        position: {
          x: LAYOUT_SPACING.START_X + NODE_SIZES.EVENT.WIDTH + LAYOUT_SPACING.COLUMN_GAP,
          y: currentY,
        },
        type: node.type,
        data: node.data,
        width: NODE_SIZES.TABLE.WIDTH,
        height,
      })
      
      currentY += height + LAYOUT_SPACING.ROW_GAP
    })
  }
  
  // Position stream nodes in the third column
  if (streamNodes.length > 0) {
    currentY = LAYOUT_SPACING.START_Y
    streamNodes.forEach((node, index) => {
      const height = calculateNodeHeight('STREAM', 0) // Stream nodes have fixed height
      
      result.nodes.push({
        id: node.id,
        position: {
          x: LAYOUT_SPACING.START_X + NODE_SIZES.EVENT.WIDTH + NODE_SIZES.TABLE.WIDTH + (LAYOUT_SPACING.COLUMN_GAP * 2),
          y: currentY,
        },
        type: node.type,
        data: node.data,
        width: NODE_SIZES.STREAM.WIDTH,
        height,
      })
      
      currentY += height + LAYOUT_SPACING.ROW_GAP
    })
  }
  
  return result
}

/**
 * Calculate positions for a simple vertical layout
 */
export const calculateVerticalLayout = (
  nodes: LayoutNode[],
  startX: number = LAYOUT_SPACING.START_X,
  startY: number = LAYOUT_SPACING.START_Y
): LayoutResult => {
  const result: LayoutResult = { nodes: [] }
  let currentY = startY
  
  nodes.forEach((node) => {
    // Safely determine the node type and calculate height
    let nodeType: keyof typeof NODE_SIZES = 'EVENT' // Default fallback
    
    if (node.type === 'table') {
      nodeType = 'TABLE'
    } else if (node.type === 'stream') {
      nodeType = 'STREAM'
    } else if (node.type === 'event') {
      nodeType = 'EVENT'
    }
    
    const height = calculateNodeHeight(
      nodeType,
      node.data.columns?.length || 0
    )
    
    result.nodes.push({
      id: node.id,
      position: { x: startX, y: currentY },
      type: node.type,
      data: node.data,
      width: NODE_SIZES[nodeType]?.WIDTH || 200,
      height,
    })
    
    currentY += height + LAYOUT_SPACING.ROW_GAP
  })
  
  return result
}

/**
 * Calculate positions for event nodes in a list arrangement
 * Nodes are positioned vertically with automatic reordering to prevent overlaps
 */
export const calculateListLayout = (
  eventNodes: LayoutNode[],
  boxStartX: number = 0,
  boxStartY: number = 0
): LayoutResult => {
  const result: LayoutResult = { nodes: [] }
  
  // Arrange events in a single column with list behavior
  const eventSpacing = LAYOUT_SPACING.ROW_GAP
  const boxPadding = LAYOUT_SPACING.BOX_PADDING
  
  eventNodes.forEach((node, index) => {
    // Center the event node horizontally within the parent container
    // Parent width is 400px, event width is 320px, so center at (400-320)/2 = 40px
    // But since we're using relative positioning with parentId, we need to account for the parent's padding
    const x = boxStartX
    const y = boxStartY + boxPadding + (index * (NODE_SIZES.EVENT.HEIGHT + eventSpacing))
    
    result.nodes.push({
      id: node.id,
      position: { x, y },
      type: node.type,
      data: node.data,
      width: NODE_SIZES.EVENT.WIDTH,
      height: NODE_SIZES.EVENT.HEIGHT,
    })
  })
  
  return result
}

/**
 * Reorder nodes in a list when one node is dragged
 * This prevents overlaps and maintains list order
 */
export const reorderListOnDrag = (
  draggedNode: ExtendedNode,
  allNodes: ExtendedNode[],
  parentId?: string
): ExtendedNode[] => {
  // Only process nodes that belong to the same parent
  const relevantNodes = allNodes.filter(node => 
    node.parentId === parentId && (node.type === 'event' || node.type === 'table')
  )
  
  if (relevantNodes.length <= 1) return allNodes
  
  // Sort nodes by their Y position to determine current order
  const sortedNodes = [...relevantNodes].sort((a, b) => a.position.y - b.position.y)
  
  // Find the dragged node's current position in the sorted list
  const draggedIndex = sortedNodes.findIndex(node => node.id === draggedNode.id)
  if (draggedIndex === -1) return allNodes
  
  // Calculate the target position based on dragged node's Y position
  const boxPadding = LAYOUT_SPACING.BOX_PADDING
  const eventSpacing = LAYOUT_SPACING.ROW_GAP
  const baseY = boxPadding
  
  // Find the parent node to get its width for proper centering
  const parentNode = allNodes.find(n => n.id === parentId)
  const parentWidth = parentNode?.width || 400
  
  // Find where the dragged node should be positioned
  let targetIndex = 0
  for (let i = 0; i < sortedNodes.length; i++) {
    // Get the appropriate node height for spacing calculation
    const nodeHeight = sortedNodes[i].type === 'event' ? NODE_SIZES.EVENT.HEIGHT : NODE_SIZES.TABLE.HEIGHT
    const expectedY = baseY + (i * (nodeHeight + eventSpacing))
    if (draggedNode.position.y < expectedY + (nodeHeight / 2)) {
      targetIndex = i
      break
    }
    targetIndex = i + 1
  }
  
  // Ensure target index is within bounds
  targetIndex = Math.max(0, Math.min(targetIndex, sortedNodes.length - 1))
  
  // If the position hasn't changed, no reordering needed
  if (targetIndex === draggedIndex) return allNodes
  
  // Create new order by moving the dragged node to target position
  const newOrder = [...sortedNodes]
  const [movedNode] = newOrder.splice(draggedIndex, 1)
  newOrder.splice(targetIndex, 0, movedNode)
  
  // Update positions for all nodes in the new order
  const updatedNodes = allNodes.map(node => {
    if (node.parentId === parentId && (node.type === 'event' || node.type === 'table')) {
      const newIndex = newOrder.findIndex(n => n.id === node.id)
      if (newIndex !== -1) {
        // Get the appropriate node dimensions based on type
        const nodeWidth = node.type === 'event' ? NODE_SIZES.EVENT.WIDTH : NODE_SIZES.TABLE.WIDTH
        const nodeHeight = node.type === 'event' ? NODE_SIZES.EVENT.HEIGHT : NODE_SIZES.TABLE.HEIGHT
        
        // Calculate centered X position
        const baseX = (parentWidth - nodeWidth) / 2
        
        return {
          ...node,
          position: {
            x: baseX, // Maintain consistent X position for centering
            y: baseY + (newIndex * (nodeHeight + eventSpacing))
          }
        }
      }
    }
    return node
  })
  
  return updatedNodes
}

/**
 * Snap nodes to exact list positions
 * This ensures all nodes are perfectly aligned after drag operations
 */
export const snapNodesToExactPositions = (
  allNodes: ExtendedNode[],
  parentId: string
): ExtendedNode[] => {
  // Get all nodes in the specified parent
  const containerNodes = allNodes.filter(node => 
    node.parentId === parentId && (node.type === 'event' || node.type === 'table')
  )
  
  if (containerNodes.length <= 1) return allNodes
  
  // Sort nodes by their current Y position to determine order
  const sortedNodes = [...containerNodes].sort((a, b) => a.position.y - b.position.y)
  
  // Calculate exact positions for each node
  const boxPadding = LAYOUT_SPACING.BOX_PADDING
  const eventSpacing = LAYOUT_SPACING.ROW_GAP
  const baseY = boxPadding
  
  // Find the parent node to get its width for proper centering
  const parentNode = allNodes.find(n => n.id === parentId)
  const parentWidth = parentNode?.width || 400
  
  // Update all nodes to their exact positions
  const updatedNodes = allNodes.map(node => {
    if (node.parentId === parentId && (node.type === 'event' || node.type === 'table')) {
      const nodeIndex = sortedNodes.findIndex(n => n.id === node.id)
      if (nodeIndex !== -1) {
        // Get the appropriate node dimensions based on type
        const nodeWidth = node.type === 'event' ? NODE_SIZES.EVENT.WIDTH : NODE_SIZES.TABLE.WIDTH
        const nodeHeight = node.type === 'event' ? NODE_SIZES.EVENT.HEIGHT : NODE_SIZES.TABLE.HEIGHT
        
        // Calculate centered X position
        const baseX = (parentWidth - nodeWidth) / 2
        
        return {
          ...node,
          position: {
            x: baseX, // Maintain consistent X position for centering
            y: baseY + (nodeIndex * (nodeHeight + eventSpacing))
          }
        }
      }
    }
    return node
  })
  
  return updatedNodes
}
