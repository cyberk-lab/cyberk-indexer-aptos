import React, { JSX } from 'react'
import { Handle, Position, useReactFlow, useStoreApi } from '@xyflow/react'
import cc from 'classcat'
import { EventData, EventColumn } from '../../types/event.node'
import { NODE_SIZES, calculateNodeHeight } from '../../constants/node-sizes'
// import styles from "./Node.module.scss";
import { enumEdgeTargetHandleId } from '../../util/util'

// import {
//   enumEdgeTargetHandleId,
//   relationEdgeSourceHandleId,
//   relationEdgeTargetHandleId,
// } from "~/util/prismaToFlow";
// import { ModelNodeData } from "~/util/types";

// type ColumnData = ModelNodeData["columns"][number];

// const isRelationed = ({ relationData }: ColumnData) => !!relationData?.side;

const EventNode = ({ data }: EventNodeProps) => {
  const store = useStoreApi()
  const { setCenter, getZoom } = useReactFlow()

  const nodeHeight = calculateNodeHeight('EVENT', data.columns.length)

  return (
    <div 
      className='rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-lg font-sans overflow-hidden'
      style={{ 
        width: NODE_SIZES.EVENT.WIDTH,
        height: nodeHeight,
      }}
    >
      <div className='bg-gradient-to-r from-blue-500/90 to-purple-500/90 p-3'>
        <h3 className='text-white font-semibold text-sm truncate'>
          {data.name}
        </h3>
      </div>
      
      <div className='p-2 space-y-1'>
        {data.columns.map((col: EventColumn, index: number) => (
          <div 
            key={col.name}
            className='flex items-center justify-between p-2 rounded-lg bg-gray-50/60 hover:bg-gray-100/80 transition-colors duration-200'
          >
            <div className='flex-1 min-w-0'>
              <div className='text-sm font-medium text-gray-900 truncate'>
                {col.name}
              </div>
            </div>
            
            <div className='flex items-center space-x-2 ml-3'>
              <span className='text-xs font-mono text-gray-600 bg-gray-200/70 px-2 py-1 rounded'>
                {col.displayType}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Handle type='source' position={Position.Right} />
    </div>
  )
}
export interface EventNodeProps {
  data: EventData
}

export default EventNode
