import { useRef } from "react";
import { BlockConfig } from "../types/block.config";
import { cn } from "@/lib/utils";

type BlockPanelProps = {
  onDragStart: (e: React.DragEvent<HTMLElement>, block: BlockConfig & { diffX: number; diffY: number }) => void
  className?: string
}

const BlockPanel = ({ onDragStart, className }: BlockPanelProps) => {
  const blocks: BlockConfig[] = [
    {
      key: 'event-stream',
      text: 'Event Stream',
    },
  ]
  const blockRefs = useRef<{ [key: string]: HTMLDivElement }>({})
  return (
    <div className={cn('space-y-2', className)}>
      {blocks.map((block) => (
        <div
          key={block.key}
          draggable
          ref={(el) => {
            if (el) {
              blockRefs.current[block.key] = el as HTMLDivElement
            }
          }}
          onDragStart={(e) => {
              const bounds = blockRefs.current[block.key].getBoundingClientRect()
              console.log('onDragStart', { bounds, e })
              return onDragStart(e, {...block, diffX: bounds.x - e.clientX, diffY: bounds.y - e.clientY});
          }}
          className='border-border bg-card hover:bg-accent cursor-grab rounded-md border p-3 transition-colors active:cursor-grabbing'
        >
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>{block.text}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlockPanel
