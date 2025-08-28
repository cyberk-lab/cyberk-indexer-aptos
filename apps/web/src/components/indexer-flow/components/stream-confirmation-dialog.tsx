import React, { useState } from 'react'
import { EventData } from '../types/event.node'
import { TableData } from '../types/table.node'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface StreamConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (eventSource: EventData, tableTarget: TableData) => void
  events: EventData[]
  tables: TableData[]
}

const StreamConfirmationDialog: React.FC<StreamConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  events,
  tables,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null)

  const handleConfirm = () => {
    if (selectedEvent && selectedTable) {
      onConfirm(selectedEvent, selectedTable)
      onClose()
      // Reset selections
      setSelectedEvent(null)
      setSelectedTable(null)
    }
  }

  const handleCancel = () => {
    onClose()
    // Reset selections
    setSelectedEvent(null)
    setSelectedTable(null)
  }

  const isConfirmEnabled = selectedEvent && selectedTable

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Event Stream</DialogTitle>
          <DialogDescription>
            Select the event source and table target for this stream node.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="event-source" className="text-sm font-medium">
              Event Source
            </label>
            <Select
              value={selectedEvent?.name || ''}
              onValueChange={(value) => {
                const event = events.find(e => e.name === value)
                setSelectedEvent(event || null)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an event source" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={`${event.module}-${event.name}`} value={event.name}>
                    {event.module}::{event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="table-target" className="text-sm font-medium">
              Table Target
            </label>
            <Select
              value={selectedTable?.name || ''}
              onValueChange={(value) => {
                const table = tables.find(t => t.name === value)
                setSelectedTable(table || null)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a table target" />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table.name} value={table.name}>
                    {table.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!isConfirmEnabled}
            className="bg-primary hover:bg-primary/90"
          >
            Create Stream
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default StreamConfirmationDialog
