import { AptosModule } from "@/types/aptos.type"
import { EventData } from "../types/event.node"
import { flatten, omit } from "lodash"

export const extractEventsFromAptosModules = (modules: AptosModule[]): EventData[] => {
  const moduleEvents = modules.map((module) => {
    return module.abi.structs.filter(s => s.is_event && !s.generic_type_params.length).map(s => ({
      name: s.name,
      module: module.abi.name,
      columns: s.fields.map(f => ({
        name: f.name,
        type: f.type,
        displayType: f.type.includes("::") ? 'address' : f.type,
        kind: 'event'
      }))
    }))
  })

  const events = flatten(moduleEvents)
//   console.log('events', events.map(x => omit(x, ['type'])))
//   const compressedEvents = events.reduce((acc, event) => {
//     const { module, name, columns } = event
//     if (!acc[module]) {
//       acc[module] = {}
//     }
//     if (!acc[module][name]) {
//       acc[module][name] = {}
//     }
//     acc[module][name] = columns.reduce((acc, column) => {
//       acc[column.name] = column.displayType
//       return acc
//     }, {} as {[field: string]: string})
//     return acc
//   }, {} as {[module: string]: {[eventName: string]: {[field: string]: string}}})
//   console.log('compressedEvents', compressedEvents)
  return events;
}