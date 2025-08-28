import { forwardRef, HTMLAttributes, memo } from 'react'
import { Handle, NodeResizeControl, Position, Node } from '@xyflow/react'
import { BlockConfig } from '../types/block.config'
import { EventData } from '../types/event.node'
import { TableData } from '../types/table.node'

interface StreamNodeData extends BlockConfig {
  eventSource?: EventData
  tableTarget?: TableData
}

const EventStreamGroup = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const nodeProps = props as Node<StreamNodeData>

  return (
    <>
      <NodeResizeControl
        style={{
          background: 'transparent',
          border: 'none',
        }}
        minWidth={200}
        minHeight={100}
      >
        <ResizeIcon />
      </NodeResizeControl>

      <Handle
        type='target'
        id='input'
        isValidConnection={() => false}
        position={Position.Left}
        className='!bg-primary hover:!bg-primary/80 rounded-full !border-2 !border-white !opacity-100'
        style={{
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '8px',  
        }}
      />
      <Handle
        type='source'
        id='output'
        isValidConnection={() => false}
        position={Position.Right}
        className='!bg-primary hover:!bg-primary/80 rounded-full !border-2 !border-white !opacity-100'
        style={{
          right: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '8px',
        }}
      />
      <div
        className={`w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 text-card-foreground border-border relative rounded-lg border px-4 py-3 transition-all duration-200 hover:shadow-md`}
        ref={ref}
      >
        <div className='flex flex-col gap-3 h-full'>
          <div className='text-center'>
            <h3 className='font-semibold text-sm text-gray-700'>Streaming</h3>
          </div>
          
          <div className='flex-1 flex items-center justify-between gap-3'>
            {/* Filter Square - Left Side */}
            <div className='relative group'>
              <div className='w-12 h-12 bg-orange-400 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z' />
                </svg>
              </div>
              
              {/* Hover Tooltip */}
              <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                prepare for mapping event field with table primary key
                <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800'></div>
              </div>
            </div>
            
            {/* Mapping Square - Right Side */}
            <div className='relative group'>
              <div className='w-12 h-12 bg-teal-500 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                </svg>
              </div>
              
              {/* Hover Tooltip */}
              <div className='absolute bottom-full right-1/2 transform translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                prepare for mapping event field with table fields
                <div className='absolute top-full right-1/2 transform translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

function ResizeIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 24 24'
      strokeWidth='2'
      stroke='#ff0071'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{ position: 'absolute', right: 5, bottom: 5 }}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <polyline points='16 20 20 20 20 16' />
      <line x1='14' y1='14' x2='20' y2='20' />
      <polyline points='8 4 4 4 4 8' />
      <line x1='4' y1='4' x2='10' y2='10' />
    </svg>
  )
}

export default memo(EventStreamGroup)
