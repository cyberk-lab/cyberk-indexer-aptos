import { lazy, Suspense } from "react"
import { useIndexerFlowContext } from "../states"

const StreamConfig = lazy(() => import('./configs/stream.config'))
const TableConfig = lazy(() => import('./configs/table.config'))

const Configs = {
  stream: StreamConfig,
  table: TableConfig,
}

const ConfigPanel = () => {
  const selectedNode = useIndexerFlowContext(s => s.selectedNode)
  console.log('selectedNode', selectedNode?.type)
  const ConfigComponent = selectedNode ? Configs[selectedNode?.type as keyof typeof Configs] : null
  return (
    <>
      <div>ConfigPanel</div>
      <Suspense fallback={<div>Loading...</div>}>
        {ConfigComponent && <ConfigComponent />}
      </Suspense>
    </>
  )
}

export default ConfigPanel