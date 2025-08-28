import { memo } from "react"
import { Node } from "@xyflow/react"

const TableConfig = (props: { node: Node }) => {
  const { node } = props
  const { id, data } = node
  const { name } = data
  console.log('id', id)
  console.log('data', data)
  return <div>TableConfig</div>
}

export default memo(TableConfig)