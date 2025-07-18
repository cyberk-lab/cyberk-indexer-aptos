import { Injectable } from '@nestjs/common'
import { DataSource, EntitySchema, Table, TableForeignKey } from 'typeorm'

@Injectable()
export class IndexerService {
  async create() {
    const PostgresDataSource = new DataSource({
      type: 'postgres',
      url: 'postgresql://cyberk:npg_peWotEcH1LA9@ep-empty-snow-a1cudls3-pooler.ap-southeast-1.aws.neon.tech/indexer_1?sslmode=require',
    })

    await PostgresDataSource.initialize()

    const SwappedTable = new Table({
      name: 'swapped',
      columns: [
        {
          name: 'transaction_version',
          type: 'bigint',
          isPrimary: true,
        },
        {
          name: 'event_index',
          type: 'bigint',
          isPrimary: true,
        },
        {
          name: 'fa_address',
          type: 'varchar',
        },
        {
          name: 'lp_address',
          type: 'varchar',
        },
        {
          name: 'fa_reserves',
          type: 'decimal',
          precision: 20,
          scale: 0,
        },
        {
          name: 'apt_reserves',
          type: 'decimal',
          precision: 20,
          scale: 0,
        },
        {
          name: 'is_buy',
          type: 'boolean',
        },
        {
          name: 'gained',
          type: 'decimal',
          precision: 20,
          scale: 0,
        },
        {
          name: 'given',
          type: 'decimal',
          precision: 20,
          scale: 0,
        },
        {
          name: 'operator',
          type: 'varchar',
        },
        {
          name: 'price',
          type: 'bigint',
        },
        {
          name: 'timestamp',
          type: 'timestamp',
        },
      ],
      indices: [
        {
          name: 'IDX_swapped_fa_address',
          columnNames: ['fa_address'],
        },
        {
          name: 'IDX_swapped_operator',
          columnNames: ['operator'],
        },
        {
          name: 'IDX_swapped_timestamp',
          columnNames: ['timestamp'],
        },
      ],
    })

    const LiquidityPairGraduatedTable = new Table({
      name: 'liquidity_pair_graduated',
      columns: [
        {
          name: 'transaction_version',
          type: 'bigint',
          isPrimary: true,
        },
        {
          name: 'event_index',
          type: 'bigint',
          isPrimary: true,
        },
        {
          name: 'fa_address',
          type: 'varchar',
        },
        {
          name: 'lp_address',
          type: 'varchar',
        },
        {
          name: 'position_address',
          type: 'varchar',
        },
        {
          name: 'timestamp',
          type: 'timestamp',
        },
      ],
    })

    const AiptosTokenTable = new Table({
      name: 'aiptos_token',
      columns: [
        {
          name: 'address',
          type: 'varchar',
          isPrimary: true,
        },
        {
          name: 'creator',
          type: 'varchar',
        },
        {
          name: 'lp_address',
          type: 'varchar',
        },
        {
          name: 'hyperion_lp_address',
          type: 'varchar',
        },
        {
          name: 'hyperion_position_address',
          type: 'varchar',
        },
        {
          name: 'graduated',
          type: 'boolean',
          default: false,
        },
        {
          name: 'name',
          type: 'varchar',
        },
        {
          name: 'symbol',
          type: 'varchar',
        },
        {
          name: 'icon_uri',
          type: 'varchar',
        },
        {
          name: 'project_uri',
          type: 'varchar',
        },
        {
          name: 'virtual_fa_reserves',
          type: 'decimal',
          precision: 20,
          scale: 0,
        },
        {
          name: 'virtual_apt_reserves',
          type: 'decimal',
          precision: 20,
          scale: 0,
        },
        {
          name: 'real_fa_reserves',
          type: 'decimal',
          precision: 20,
          scale: 0,
        },
        {
          name: 'real_apt_reserves',
          type: 'decimal',
          precision: 20,
          scale: 0,
        },
        {
          name: 'holder_count',
          type: 'bigint',
        },
        {
          name: 'swap_count',
          type: 'bigint',
        },
        {
          name: 'apt_volume',
          type: 'decimal',
          precision: 30,
          scale: 0,
        },
        {
          name: 'fa_volume',
          type: 'decimal',
          precision: 30,
          scale: 0,
        },
        {
          name: 'dev_buy_apt',
          type: 'decimal',
          precision: 20,
          scale: 0,
        },
        {
          name: 'created_at',
          type: 'timestamp',
        },
        {
          name: 'graduated_at',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'transaction_version',
          type: 'bigint',
        },
      ],
    })

    const AiptosUserTable = new Table({
      name: 'aiptos_user',
      columns: [
        {
          name: 'address',
          type: 'varchar',
          isPrimary: true,
        },
      ],
    })

    const AiptosUserTokenTable = new Table({
      name: 'aiptos_user_token',
      columns: [
        {
          name: 'user_address',
          type: 'varchar',
          isPrimary: true,
        },
        {
          name: 'token_address',
          type: 'varchar',
          isPrimary: true,
        },
        {
          name: 'amount',
          type: 'decimal',
          precision: 20,
          scale: 0,
        },
      ],
    })

    const TokenSwapStatsTable = new Table({
      name: 'token_swap_stats',
      columns: [
        {
          name: 'address',
          type: 'varchar',
          isPrimary: true,
        },
        {
          name: 'type',
          type: 'varchar',
          isPrimary: true,
        },
        {
          name: 'timestamp',
          type: 'timestamp',
          isPrimary: true,
        },
        {
          name: 'apt_volume',
          type: 'decimal',
          precision: 30,
          scale: 0,
        },
        {
          name: 'fa_volume',
          type: 'decimal',
          precision: 30,
          scale: 0,
        },
        {
          name: 'count',
          type: 'bigint',
        },
      ],
      indices: [
        {
          name: 'IDX_token_swap_stats_timestamp',
          columnNames: ['timestamp'],
        },
      ],
    })

    // Foreign Key Constraints
    const SwappedFaAddressForeignKey = new TableForeignKey({
      columnNames: ['fa_address'],
      referencedColumnNames: ['address'],
      referencedTableName: AiptosTokenTable.name,
    })

    const SwappedOperatorForeignKey = new TableForeignKey({
      columnNames: ['operator'],
      referencedColumnNames: ['address'],
      referencedTableName: AiptosUserTable.name,
    })

    const AiptosUserTokenUserAddressForeignKey = new TableForeignKey({
      columnNames: ['user_address'],
      referencedColumnNames: ['address'],
      referencedTableName: AiptosUserTable.name,
    })

    const AiptosUserTokenTokenAddressForeignKey = new TableForeignKey({
      columnNames: ['token_address'],
      referencedColumnNames: ['address'],
      referencedTableName: AiptosTokenTable.name,
    })

    const TokenSwapStatsAddressForeignKey = new TableForeignKey({
      columnNames: ['address'],
      referencedColumnNames: ['address'],
      referencedTableName: AiptosTokenTable.name,
    })

    const runner = PostgresDataSource.createQueryRunner()
    await runner.createTable(SwappedTable)
    await runner.createTable(LiquidityPairGraduatedTable)
    await runner.createTable(AiptosTokenTable)
    await runner.createTable(AiptosUserTable)
    await runner.createTable(AiptosUserTokenTable)
    await runner.createTable(TokenSwapStatsTable)

    // Add foreign key constraints
    await runner.createForeignKey('swapped', SwappedFaAddressForeignKey)
    await runner.createForeignKey('swapped', SwappedOperatorForeignKey)
    await runner.createForeignKey('aiptos_user_token', AiptosUserTokenUserAddressForeignKey)
    await runner.createForeignKey('aiptos_user_token', AiptosUserTokenTokenAddressForeignKey)
    await runner.createForeignKey('token_swap_stats', TokenSwapStatsAddressForeignKey)

    const queryBuilder = PostgresDataSource.createQueryBuilder()
    await PostgresDataSource.transaction(async (manager) => {
      const qb = manager.createQueryBuilder()
      qb.insert()
        .into('aiptos_token')
        .values([
          {
            address: '0x0000000000000000000000000000000000000000',
            creator: '0x0000000000000000000000000000000000000000',
          },
        ])
        .execute()
    })
    await queryBuilder
      .insert()
      .into('aiptos_token')
      .values([
        {
          address: '0x0000000000000000000000000000000000000000',
          creator: '0x0000000000000000000000000000000000000000',
        },
      ])
      .orUpdate({
        columns: ['creator'],
        overwrite: true,
      })
      .execute()
    const x = queryBuilder
      .update('aiptos_token')
      .set({
        creator: '0x0000000000000000000000000000000000000000',
      })
      .where({
        address: '0x0000000000000000000000000000000000000000',
      })
      .execute()
  }

  async promptEventsToTables(events: any) {
    //
  }
}
