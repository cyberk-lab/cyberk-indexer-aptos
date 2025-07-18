import React, { JSX } from 'react'
import { Handle, Position, useReactFlow, useStoreApi } from '@xyflow/react'
import cc from 'classcat'
import { EventData } from '../../types/event.node'
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

const EventNode = ({ data }: NodeBase) => {
  const store = useStoreApi()
  const { setCenter, getZoom } = useReactFlow()

  return (
    <div className='border-separate rounded-lg border-2 border-black bg-white font-sans'>
      <table style={{ minWidth: 200, maxWidth: 500, borderSpacing: 0 }}>
        <thead>
          <tr>
            <th
              className='rounded-t-md border-b-2 border-black bg-gray-200 p-2 font-extrabold'
              colSpan={4}
            >
              {data.name}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.columns.map((col) => {
            //   const reled = isRelationed(col);
            //   let targetHandle: JSX.Element | null = null;
            //   let sourceHandle: JSX.Element | null = null;

            return (
              <tr key={col.name}>
                <td className='border-t-2 border-r-2 border-gray-300 font-mono font-semibold'>
                  <button
                    type='button'
                    className={cc([
                      'relative',
                      'p-2',
                      // { "cursor-pointer": reled },
                    ])}
                    onClick={() => {
                      // if (!reled) return;
                      // focusNode(col.type);
                    }}
                  >
                    {col.name}
                    {/* {targetHandle} */}
                  </button>
                </td>
                <td className='border-t-2 border-r-2 border-gray-300 p-2 font-mono'>
                  {col.displayType}
                </td>
                <td className='border-t-2 border-gray-300 font-mono'>
                  <div className='relative p-2'>
                    {/* {col.defaultValue || ""}
                  {sourceHandle} */}
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
  data: EventData
}

export default EventNode
