// Node size constants for consistent layout
export const NODE_SIZES = {
  EVENT: {
    WIDTH: 320,
    HEIGHT: 60, // Fixed height for event name only
  },
  TABLE: {
    WIDTH: 350,
    HEIGHT: 60, // Fixed height for table name only
  },
  STREAM: {
    WIDTH: 400,
    HEIGHT: 200,
  },
} as const

// Layout spacing constants
export const LAYOUT_SPACING = {
  COLUMN_GAP: 400, // Horizontal gap between different node types
  ROW_GAP: 20,     // Vertical gap between events in single column
  MARGIN: 50,      // Margin from edges
  START_X: 50,     // Starting X position
  START_Y: 50,     // Starting Y position
  BOX_PADDING: 40, // Padding inside event box
  BOX_HEADER_HEIGHT: 80, // Height reserved for event box header
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
  
  // For EVENT and TABLE nodes with fixed height
  if ((nodeType === 'EVENT' || nodeType === 'TABLE') && 'HEIGHT' in sizes) {
    console.log(`Using fixed ${nodeType} height: ${sizes.HEIGHT}`)
    return sizes.HEIGHT
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
  console.log('EVENT node:', calculateNodeHeight('EVENT', 0))
  
  // Test TABLE node
  console.log('TABLE node:', calculateNodeHeight('TABLE', 0))
  
  // Test STREAM node
  console.log('STREAM node:', calculateNodeHeight('STREAM', 0))
  
  // Test unknown node type
  console.log('Unknown node type:', calculateNodeHeight('UNKNOWN' as any, 0))
}
