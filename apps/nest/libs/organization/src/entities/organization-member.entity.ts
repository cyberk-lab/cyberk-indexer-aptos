import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { OrganizationEntity } from './organization.entity'
import { ProfileEntity } from '@app/profile/entities/profile.entity'
import { OrganizationRole } from '@prisma/client'

export class OrganizationMemberEntity {
  @ApiProperty()
  @Expose()
  organizationId: bigint

  @ApiProperty()
  @Expose()
  profileId: bigint

  @ApiProperty({ enum: OrganizationRole })
  @Expose()
  role: OrganizationRole

  @ApiProperty({ type: () => OrganizationEntity })
  @Type(() => OrganizationEntity)
  @Expose()
  organization: OrganizationEntity

  @ApiProperty({ type: () => ProfileEntity })
  @Type(() => ProfileEntity)
  @Expose()
  profile: ProfileEntity
}
