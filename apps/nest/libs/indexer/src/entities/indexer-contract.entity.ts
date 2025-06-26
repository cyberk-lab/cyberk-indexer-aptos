import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IndexerEntity } from './indexer.entity'
import { ContractEntity } from './contract.entity'

export class IndexerContractEntity {
  @ApiProperty()
  @Expose()
  indexerId: bigint

  @ApiProperty()
  @Expose()
  contractAddress: string

  @ApiProperty({ type: () => IndexerEntity })
  @Type(() => IndexerEntity)
  @Expose()
  indexer: IndexerEntity

  @ApiProperty({ type: () => ContractEntity })
  @Type(() => ContractEntity)
  @Expose()
  contract: ContractEntity
}
