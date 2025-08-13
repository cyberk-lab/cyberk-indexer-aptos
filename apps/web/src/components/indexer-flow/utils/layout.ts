import { XYPosition } from '@xyflow/react'
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

/**
 * Calculate optimal positions for nodes in a grid layout
 */
export const calculateGridLayout = (
  eventNodes: LayoutNode[],
  tableNodes: LayoutNode[] = [],
  streamNodes: LayoutNode[] = []
): LayoutResult => {
  const result: LayoutResult = { nodes: [] }
  
  // Position event nodes in the first column
  let currentY = LAYOUT_SPACING.START_Y
  eventNodes.forEach((node, index) => {
    const height = calculateNodeHeight('EVENT', node.data.columns?.length || 0)
    
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
