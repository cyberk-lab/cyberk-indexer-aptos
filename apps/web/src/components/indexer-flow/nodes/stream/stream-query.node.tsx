import React, { JSX, memo, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import cc from 'classcat'
import { EventData } from '../../types/event.node'
// import styles from "./Node.module.scss";
import { enumEdgeTargetHandleId } from '../../util/util'
import { TableData } from '../../types/table.node'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StreamQueryNodeData } from '../../types/stream-query.node'

// import {
//   enumEdgeTargetHandleId,
//   relationEdgeSourceHandleId,
//   relationEdgeTargetHandleId,
// } from "~/util/prismaToFlow";
// import { ModelNodeData } from "~/util/types";

// type ColumnData = ModelNodeData["columns"][number];

// const isRelationed = ({ relationData }: ColumnData) => !!relationData?.side;

const StreamQueryNode = ({ data }: EventNodeProps) => {
    const { eventColumns, tableColumns } = data

  const primaryKeys = tableColumns.filter((col) => col.isPrimaryKey)

  const [primaryKeyMapping, setPrimaryKeyMapping] = useState(primaryKeys.reduce((acc, col) => {
    acc[col.name] = undefined
    return acc
  }, {} as Record<string, string | undefined>))

  return (
    <div className='border-separate rounded-lg border-2 border-black bg-white font-sans'>
      <table style={{ minWidth: 200, maxWidth: 500, borderSpacing: 0 }}>
        <thead>
          <tr>
            <th
              className='rounded-t-md border-b-2 border-black bg-gray-200 p-2 font-extrabold'
              colSpan={4}
            >
              Query/Filter
            </th>
          </tr>
        </thead>
        <tbody>
          {primaryKeys.map((col) => {
            //   const reled = isRelationed(col);
            //   let targetHandle: JSX.Element | null = null;
            //   let sourceHandle: JSX.Element | null = null;

            return (
              <tr key={col.name}>
                <td className='border-t-2 border-r-2 border-gray-300 font-mono font-semibold'>
                  <EventFieldSelector values={eventColumns.map((col) => col.name)} selected={primaryKeyMapping[col.name]} onChange={(value) => setPrimaryKeyMapping({ ...primaryKeyMapping, [col.name]: value })} />
                </td>
                <td className='border-t-2 border-r-2 border-gray-300 p-2 font-mono'>
                  to
                </td>
                <td className='border-t-2 border-gray-300 font-mono'>
                  <div className='relative p-2'>
                    {col.name}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Handle type='source' position={Position.Right} />
    </div>
  )
}
export interface EventNodeProps {
  data: StreamQueryNodeData
}

export function EventFieldSelector({ values, selected, onChange }: { values: string[], selected: string | undefined, onChange: (value: string) => void }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selected || "Select field"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" style={{ zIndex: 1000 }}>
          <DropdownMenuLabel>Select Field</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={selected} onValueChange={onChange}>
            {values.map((value) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {value}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

export default memo(StreamQueryNode)
