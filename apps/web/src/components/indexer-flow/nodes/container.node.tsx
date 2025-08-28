import React from 'react'
import { Handle, Position } from '@xyflow/react'

interface CollectionContainerNodeData {
  title: string
  items: any[]
  type: 'event' | 'table'
}

interface CollectionContainerNodeProps {
  data: CollectionContainerNodeData
  width?: number
  height?: number
}

const CollectionContainerNode: React.FC<CollectionContainerNodeProps> = ({ data, width = 400, height = 400 }) => {
  const getTypeColor = () => {
    switch (data.type) {
      case 'event':
        return 'from-blue-500/90 to-purple-500/90'
      case 'table':
        return 'from-green-500/90 to-teal-500/90'
      default:
        return 'from-gray-500/90 to-slate-500/90'
    }
  }

  const getTypeIcon = () => {
    switch (data.type) {
      case 'event':
        return '📊'
      case 'table':
        return '🗃️'
      default:
        return '📦'
    }
  }

  return (
    <div 
      className='rounded-xl border-2 border-dashed border-gray-300/50 bg-gray-50/20 backdrop-blur-sm p-4'
      style={{
        width: width,
        height: height,
        minHeight: '200px',
        minWidth: '300px',
      }}
    >
      {/* Header with type-specific styling */}
      <div className={`absolute -top-3 left-4 bg-white px-3 py-1 rounded-lg border border-gray-200 flex items-center gap-2`}>
        <span className="text-sm">{getTypeIcon()}</span>
        <h3 className="text-sm font-medium text-gray-700">{data.title}</h3>
      </div>
      
      {/* Content area */}
      {/* <div className="pt-6 h-full">
        <div className="text-sm text-gray-500 text-center">
          {data.items.length} {data.type}{data.items.length !== 1 ? 's' : ''} in collection
        </div>
      </div> */}
      
      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </div>
  )
}

export default CollectionContainerNode
