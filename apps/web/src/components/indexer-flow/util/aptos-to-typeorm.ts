import { EventData } from '../types/event.node'
import { TableColumn, TableData } from '../types/table.node'

export const aptosEventToTypeorm = (events: EventData[]) => {
//   return Promise.resolve(
  return  [
      {
        name: 'Swapped',
        columns: {
          transaction_version: {
            type: 'bigint',
            primary: true,
          },
          event_index: {
            type: 'int',
            primary: true,
          },
          fa_address: { type: 'string' },
          lp_address: { type: 'string' },
          fa_reserves: { type: 'decimal', precision: 20, scale: 0 },
          apt_reserves: { type: 'decimal', precision: 20, scale: 0 },
          is_buy: { type: 'boolean' },
          gained: { type: 'decimal', precision: 20, scale: 0 },
          given: { type: 'decimal', precision: 20, scale: 0 },
          operator: { type: 'string' },
          price: { type: 'bigint' },
          timestamp: { type: 'datetime' },
        },
      },
      {
        name: 'Token',
        columns: {
          address: { type: 'string', primary: true },
          creator: { type: 'string' },
          lp_address: { type: 'string' },
          hyperion_lp_address: { type: 'string' },
          hyperion_position_address: { type: 'string' },
          graduated: { type: 'boolean', default: false },
          name: { type: 'string' },
          symbol: { type: 'string' },
          icon_uri: { type: 'string' },
          project_uri: { type: 'string' },
          virtual_fa_reserves: { type: 'decimal', precision: 20, scale: 0 },
          virtual_apt_reserves: { type: 'decimal', precision: 20, scale: 0 },
          real_fa_reserves: { type: 'decimal', precision: 20, scale: 0 },
          real_apt_reserves: { type: 'decimal', precision: 20, scale: 0 },
          swap_count: { type: 'bigint' },
          apt_volume: { type: 'decimal', precision: 30, scale: 0 },
          fa_volume: { type: 'decimal', precision: 30, scale: 0 },
          dev_buy_apt: { type: 'decimal', precision: 20, scale: 0 },
          created_at: { type: 'datetime' },
          graduated_at: { type: 'datetime', nullable: true },
        },
      },
      {
        name: 'User',
        columns: {
          address: { type: 'string', primary: true },
        },
      },
      {
        name: 'UserToken',
        columns: {
          user_address: { type: 'string', primary: true },
          token_address: { type: 'string', primary: true },
          amount: { type: 'decimal', precision: 20, scale: 0 },
        },
      },
    ].map((e) => ({
      name: e.name,
      columns:  Object.entries(e.columns).map(([k, v]) => ({
        name: k,
        type: v.type,
        displayType: v.type,
        isPrimaryKey: v.primary,
      })) as TableColumn[]
    }))
//   )
}
