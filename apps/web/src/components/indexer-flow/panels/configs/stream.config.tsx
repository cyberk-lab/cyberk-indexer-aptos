import { memo, useState, useMemo } from "react"
import { Node } from "@xyflow/react"
import { EventData } from "../../types/event.node"
import { TableData } from "../../types/table.node"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"

interface StreamNodeData {
  eventSource?: EventData
  tableTarget?: TableData
}

interface FilterRow {
  id: string
  eventField: string
  tablePK: string
}

interface MappingRow {
  id: string
  operator: 'assign' | 'increment' | 'decrement' | 'custom'
  inputData: string
  tableField: string
}

const StreamConfig = (props: { node: Node }) => {
  const { node } = props
  const { id, data } = node
  const { eventSource, tableTarget } = data as StreamNodeData
  
  // Filter section state
  const [filterRows, setFilterRows] = useState<FilterRow[]>(() => {
    if (tableTarget?.columns) {
      const primaryKeys = tableTarget.columns.filter(col => col.isPrimaryKey)
      return primaryKeys.map((pk, index) => ({
        id: `filter-${index}`,
        eventField: '',
        tablePK: pk.name
      }))
    }
    return []
  })

  // Mapping section state
  const [mappingRows, setMappingRows] = useState<MappingRow[]>([
    {
      id: 'mapping-0',
      operator: 'assign',
      inputData: '',
      tableField: ''
    }
  ])

  // Get event field names
  const eventFieldNames = useMemo(() => {
    return eventSource?.columns.map(col => col.name) || []
  }, [eventSource])

  // Get table field names
  const tableFieldNames = useMemo(() => {
    return tableTarget?.columns.map(col => col.name) || []
  }, [tableTarget])

  // Get primary key names
  const primaryKeyNames = useMemo(() => {
    return tableTarget?.columns.filter(col => col.isPrimaryKey).map(col => col.name) || []
  }, [tableTarget])

  // Filter section handlers
  const updateFilterRow = (id: string, field: keyof FilterRow, value: string) => {
    setFilterRows(prev => prev.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ))
  }

  // Mapping section handlers
  const updateMappingRow = (id: string, field: keyof MappingRow, value: string) => {
    setMappingRows(prev => prev.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ))
  }

  const addMappingRow = () => {
    const newRow: MappingRow = {
      id: `mapping-${Date.now()}`,
      operator: 'assign',
      inputData: '',
      tableField: ''
    }
    setMappingRows(prev => [...prev, newRow])
  }

  const removeMappingRow = (id: string) => {
    if (mappingRows.length > 1) {
      setMappingRows(prev => prev.filter(row => row.id !== id))
    }
  }

  const renderInputDataField = (row: MappingRow) => {
    switch (row.operator) {
      case 'assign':
        return (
          <Select
            value={row.inputData}
            onValueChange={(value) => updateMappingRow(row.id, 'inputData', value)}
            
          >
            <SelectTrigger className="p-1.5">
              <SelectValue placeholder="Event field" />
            </SelectTrigger>
            <SelectContent>
              {eventFieldNames.map(field => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'increment':
      case 'decrement':
        return (
          <div className="flex gap-2">
            <Select
              value={row.inputData}
              onValueChange={(value) => updateMappingRow(row.id, 'inputData', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Event field or number" />
              </SelectTrigger>
              <SelectContent>
                {eventFieldNames.map(field => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom number</SelectItem>
              </SelectContent>
            </Select>
            {row.inputData === 'custom' && (
              <Input
                type="number"
                placeholder="0"
                className="w-20"
                onChange={(e) => updateMappingRow(row.id, 'inputData', e.target.value)}
              />
            )}
          </div>
        )
      
      case 'custom':
        return (
          <Input
            placeholder="Enter custom logic"
            value={row.inputData}
            onChange={(e) => updateMappingRow(row.id, 'inputData', e.target.value)}
          />
        )
      
      default:
        return null
    }
  }

  if (!eventSource || !tableTarget) {
    return (
      <div className="p-4 text-center text-gray-500">
        Please configure event source and table target first
      </div>
    )
  }

  return (
    <div className="p-2 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">Stream Configuration</h3>
        <p className="text-sm text-gray-600">
          {eventSource.module}::{eventSource.name} → {tableTarget.name}
        </p>
      </div>

      {/* Filter Section */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-700 flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-400 rounded"></div>
          Filter Configuration
        </h4>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Field
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Table PK
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterRows.map((row) => (
                <tr key={row.id}>
                  <td className="px-2 py-2">
                    <Select
                      value={row.eventField}
                      onValueChange={(value) => updateFilterRow(row.id, 'eventField', value)}
                    >
                      <SelectTrigger className="p-1.5">
                        <SelectValue placeholder="Event field" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventFieldNames.map(field => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-600">
                    {row.tablePK}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mapping Section */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-700 flex items-center gap-2">
          <div className="w-4 h-4 bg-teal-500 rounded"></div>
          Mapping Configuration
        </h4>
        
        <div className="border rounded-lg overflow-hidden">
          <table>
            <thead className="bg-gray-50">
              <tr>
                <th className="ps-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operator
                </th>
                <th className="ps-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Input Data
                </th>
                <th className="ps-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Table Field
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mappingRows.map((row) => (
                <tr key={row.id}>
                  <td className="py-2 ps-2">
                    <Select
                      value={row.operator}
                      onValueChange={(value: MappingRow['operator']) => updateMappingRow(row.id, 'operator', value)}
                    >
                      <SelectTrigger className="p-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assign">Assign</SelectItem>
                        <SelectItem value="increment">Increment</SelectItem>
                        <SelectItem value="decrement">Decrement</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-2 ps-2">
                    {renderInputDataField(row)}
                  </td>
                  <td className="py-2 ps-2">
                    <Select
                      value={row.tableField}
                      onValueChange={(value) => updateMappingRow(row.id, 'tableField', value)}
                    >
                      <SelectTrigger className="p-1.5">
                        <SelectValue placeholder="Table field" />
                      </SelectTrigger>
                      <SelectContent>
                        {tableFieldNames.map(field => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-2 ps-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMappingRow(row.id)}
                      disabled={mappingRows.length <= 1}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Button
          onClick={addMappingRow}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Mapping Row
        </Button>
      </div>
    </div>
  )
}

export default memo(StreamConfig)