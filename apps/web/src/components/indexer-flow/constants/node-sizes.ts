// Node size constants for consistent layout
export const NODE_SIZES = {
  EVENT: {
    WIDTH: 320,
    HEADER_HEIGHT: 60,
    ROW_HEIGHT: 48,
    MIN_HEIGHT: 108,
  },
  TABLE: {
    WIDTH: 350,
    HEADER_HEIGHT: 60,
    ROW_HEIGHT: 48,
    MIN_HEIGHT: 108,
  },
  STREAM: {
    WIDTH: 400,
    HEIGHT: 200,
  },
} as const

// Layout spacing constants
export const LAYOUT_SPACING = {
  COLUMN_GAP: 400, // Horizontal gap between different node types
  ROW_GAP: 100,    // Vertical gap between nodes of the same type
  MARGIN: 50,      // Margin from edges
  START_X: 50,     // Starting X position
  START_Y: 50,     // Starting Y position
} as const

// Calculate node height based on content
export const calculateNodeHeight = (
  nodeType: keyof typeof NODE_SIZES,
  contentLength: number
): number => {
  console.log(`calculateNodeHeight called with: nodeType=${nodeType}, contentLength=${contentLength}`)
  
  const sizes = NODE_SIZES[nodeType]
  console.log(`NODE_SIZES[${nodeType}] =`, sizes)
  
  if (!sizes) {
    console.warn(`Unknown node type: ${nodeType}, using default height`)
    return 200 // Default fallback height
  }
  
  // Type guard to check if the node has dynamic height properties
  if ('HEADER_HEIGHT' in sizes && 'ROW_HEIGHT' in sizes && 'MIN_HEIGHT' in sizes) {
    const calculatedHeight = Math.max(
      sizes.HEADER_HEIGHT + (contentLength * sizes.ROW_HEIGHT),
      sizes.MIN_HEIGHT
    )
    console.log(`Calculated dynamic height: ${calculatedHeight}`)
    return calculatedHeight
  }
  
  // For nodes with fixed height (like STREAM)
  if ('HEIGHT' in sizes) {
    console.log(`Using fixed height: ${sizes.HEIGHT}`)
    return sizes.HEIGHT
  }
  
  // Fallback
  console.log(`Using fallback height: 200`)
  return 200
}

// Test function to verify all node types work correctly
export const testCalculateNodeHeight = () => {
  console.log('Testing calculateNodeHeight with all node types:')
  
  // Test EVENT node
  console.log('EVENT node with 3 columns:', calculateNodeHeight('EVENT', 3))
  
  // Test TABLE node
  console.log('TABLE node with 5 columns:', calculateNodeHeight('TABLE', 5))
  
  // Test STREAM node
  console.log('STREAM node:', calculateNodeHeight('STREAM', 0))
  
  // Test unknown node type
  console.log('Unknown node type:', calculateNodeHeight('UNKNOWN' as any, 0))
}
