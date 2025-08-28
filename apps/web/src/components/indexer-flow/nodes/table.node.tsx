import React, { JSX, useState, useEffect } from 'react'
import { Handle, Position, useReactFlow, useStoreApi } from '@xyflow/react'
import cc from 'classcat'
import { NODE_SIZES } from '../constants/node-sizes'
import { TableData } from '../types/table.node'
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

interface TableNodeProps {
  data: TableData
  id: string
}

const TableNode: React.FC<TableNodeProps> = ({ data, id }) => {
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
        'cursor-move overflow-hidden rounded-lg border font-sans transition-all duration-200',
        'hover:shadow-md',
        {
          'scale-105 border-blue-400/50 bg-blue-50/30 shadow-lg': isDragging,
          'border-green-400/50 bg-green-50/30 shadow-lg': isSnapping,
          'border-gray-300/30 bg-white/20 shadow-sm backdrop-blur-sm hover:border-gray-400/50 hover:bg-white/30':
            !isDragging && !isSnapping,
        },
      ])}
      style={{
        width: NODE_SIZES.TABLE.WIDTH,
        height: 60, // Fixed height for table name only
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsDragging(false)
        setIsSnapping(false)
      }}
    >
      <div className='flex h-full items-center justify-center p-3'>
        <h3 className='max-w-full truncate text-center text-sm font-medium text-gray-800'>
          {data.name}
        </h3>
      </div>
      <Handle type='target' position={Position.Left} />
    </div>
  )
}

export default TableNode
