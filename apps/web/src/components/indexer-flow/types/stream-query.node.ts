import { EventColumn } from "./event.node"
import { TableColumn } from "./table.node"

export type StreamQueryNodeData = {
  eventColumns: EventColumn[]
  tableColumns: TableColumn[]
}