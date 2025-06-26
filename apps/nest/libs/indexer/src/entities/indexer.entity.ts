import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IndexerContractEntity } from './indexer-contract.entity'
import { OrganizationEntity } from '@app/organization/entities/organization.entity'

export class IndexerEntity {
  @ApiProperty()
  @Expose()
  id: bigint

  @ApiProperty()
  @Expose()
  organizationId: bigint

  @ApiProperty()
  @Expose()
  neonProjectId: string

  @ApiProperty()
  @Expose()
  neonBranchId: string

  @ApiProperty()
  @Expose()
  neonDbName: string

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date

  @ApiProperty({ type: () => OrganizationEntity })
  @Type(() => OrganizationEntity)
  @Expose()
  organization: OrganizationEntity

  @ApiProperty({ type: () => IndexerContractEntity, isArray: true })
  @Type(() => IndexerContractEntity)
  @Expose()
  contracts: IndexerContractEntity[]
}
