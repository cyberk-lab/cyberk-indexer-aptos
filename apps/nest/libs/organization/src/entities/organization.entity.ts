import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { OrganizationMemberEntity } from './organization-member.entity'
import { IndexerEntity } from '@app/indexer/entities/indexer.entity'

export class OrganizationEntity {
  @ApiProperty()
  @Expose()
  id: bigint

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date

  @ApiProperty()
  @Expose()
  name: string

  @ApiProperty()
  @Expose()
  description?: string

  @ApiProperty({ type: () => OrganizationMemberEntity, isArray: true })
  @Type(() => OrganizationMemberEntity)
  @Expose()
  members: OrganizationMemberEntity[]

  @ApiProperty({ type: () => IndexerEntity, isArray: true })
  @Type(() => IndexerEntity)
  @Expose()
  indexers: IndexerEntity[]
}
