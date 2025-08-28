import React, { JSX, useState, useEffect } from 'react'
import { Handle, Position, useReactFlow, useStoreApi } from '@xyflow/react'
import cc from 'classcat'
import { EventData, EventColumn } from '../types/event.node'
import { NODE_SIZES, calculateNodeHeight } from '../constants/node-sizes'
// import styles from "./Node.module.scss";
import { enumEdgeTargetHandleId } from '../util/util'

// import {
//   enumEdgeTargetHandleId,
//   relationEdgeSourceHandleId,
//   relationEdgeTargetHandleId,
// } from "~/util/prismaToFlow";
// import { ModelNodeData } from "~/util/types";

// type ColumnData = ModelNodeData["columns"][number];

// const isRelationed = ({ relationData }: ColumnData) => !!relationData?.side;

interface EventNodeProps {
  data: EventData
  id: string
}

const EventNode: React.FC<EventNodeProps> = ({ data, id }) => {
  const store = useStoreApi()
  const { setCenter, getZoom } = useReactFlow()
  const [isDragging, setIsDragging] = useState(false)
  const [isSnapping, setIsSnapping] = useState(false)

  // Show snapping animation when drag stops
  useEffect(() => {
    if (isDragging) {
      setIsSnapping(false)
    }
  }, [isDragging])

  const handleMouseDown = () => {
    setIsDragging(true)
    setIsSnapping(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    // Show snapping animation briefly
    setIsSnapping(true)
    setTimeout(() => setIsSnapping(false), 300)
  }

  return (
    <div 
      className={cc([
        'rounded-lg border font-sans overflow-hidden cursor-move transition-all duration-200',
        'hover:shadow-md',
        {
          'border-blue-400/50 bg-blue-50/30 shadow-lg scale-105': isDragging,
          'border-green-400/50 bg-green-50/30 shadow-lg': isSnapping,
          'border-gray-300/30 bg-white/20 backdrop-blur-sm shadow-sm hover:bg-white/30 hover:border-gray-400/50': !isDragging && !isSnapping,
        }
      ])}
      style={{ 
        width: NODE_SIZES.EVENT.WIDTH,
        height: 60, // Fixed height for event name only
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsDragging(false)
        setIsSnapping(false)
      }}
    >
      <div className='h-full flex items-center justify-center p-3'>
        <h3 className='text-gray-800 font-medium text-sm text-center truncate max-w-full'>
          {data.name}
        </h3>
      </div>
      <Handle type='source' position={Position.Right} />
    </div>
  )
}

export default EventNode
