import { forwardRef, HTMLAttributes, memo } from 'react'
import { Handle, NodeResizeControl, Position, Node, useNodeConnections } from '@xyflow/react'
import { BlockConfig } from '../../types/block.config'
import { useEventNodes } from '../../hooks/use-event-nodes'
import { useTableNodes } from '../../hooks/use-table-nodes'



const EventStreamGroup = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const nodeProps = props as Node<BlockConfig>

  const { events, eventNodes } = useEventNodes()
  const { tables, tableNodes } = useTableNodes()

  const inputConnections = useNodeConnections({id: nodeProps.id, handleId: 'input'})
  const outputConnections = useNodeConnections({id: nodeProps.id, handleId: 'output'})
  return (
    <>
      <NodeResizeControl
        style={{
          background: 'transparent',
          border: 'none',
        }}
        minWidth={100}
        minHeight={50}
      >
        <ResizeIcon />
      </NodeResizeControl>

      <Handle
        type='target'
        id='input'
        isValidConnection={(connection) => {
          // console.log('connection', connection)
          return true
        }}
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
        type='target'
        id='output'
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
        className={`w-full h-full bg-card text-card-foreground border-border relative rounded-lg border px-3 py-2 transition-all duration-200 hover:shadow-md`}
        ref={ref}
        // {...props}
      >
        <div className='flex flex-col gap-2'>
          {events.map((event) => (
            <div key={event.name}>{event.name}</div>
          ))}
        </div>
        <div className='flex flex-col gap-2'>
          {tables.map((table) => (
            <div key={table.name}>{table.name}</div>
          ))}
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
