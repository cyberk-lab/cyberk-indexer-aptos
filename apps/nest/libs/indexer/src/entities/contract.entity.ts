import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IndexerContractEntity } from './indexer-contract.entity'

export class ContractEntity {
  @ApiProperty()
  @Expose()
  address: string

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date

  @ApiProperty()
  @Expose()
  startVersion: bigint

  @ApiProperty({ type: () => IndexerContractEntity, isArray: true })
  @Type(() => IndexerContractEntity)
  @Expose()
  indexers: IndexerContractEntity[]
}
