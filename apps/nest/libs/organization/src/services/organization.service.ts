import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { CreateOrganizationDto } from '../dtos/create-organization.dto'
import { UpdateOrganizationDto } from '../dtos/update-organization.dto'
import { QueryOrganizationDto } from '../dtos/query-organization.dto'
import { User } from '@prisma/client'
import { th } from '@app/helper/transform.helper'
import { OrganizationEntity } from '../entities/organization.entity'
import { OrganizationRole } from '@prisma/client'
import { OrganizationMemberEntity } from '../entities/organization-member.entity'

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrganizations(queryOrganizationDto: QueryOrganizationDto) {
    const { select, include, where, sort, take, skip } = queryOrganizationDto
    const organizations = await this.prisma.organization.findMany({
      where,
      orderBy: sort,
      take,
      skip,
      ...(select
        ? { select: Object.fromEntries(select.map((key) => [key, true])) }
        : include
          ? { include: Object.fromEntries(include.map((key) => [key, true])) }
          : {}),
    })
    return th.toInstancesSafe(OrganizationEntity, organizations)
  }

  async getMyOrganizations(user: User) {
    const organizations = await this.prisma.organizationMember.findMany({
      where: {
        profileId: user.profileId,
      },
      include: {
        organization: true,
      },
    })
    return th.toInstancesSafe(OrganizationMemberEntity, organizations)
  }

  async getOrganization(id: bigint) {
    const organization = await this.prisma.organization.findUniqueOrThrow({
      where: { id },
      include: {
        members: true,
      },
    })
    return th.toInstanceSafe(OrganizationEntity, organization)
  }

  async createOrganization(dto: CreateOrganizationDto, user: User) {
    const organization = await this.prisma.organization.create({
      data: {
        ...dto,
        members: {
          create: {
            profileId: user.profileId,
            role: OrganizationRole.OWNER,
          },
        },
      },
    })
    return th.toInstanceSafe(OrganizationEntity, organization)
  }

  async updateOrganization(id: bigint, dto: UpdateOrganizationDto, user: User) {
    await this.requireOrganizationRole(id, user)

    const updatedOrganization = await this.prisma.organization.update({
      where: { id },
      data: dto,
    })
    return th.toInstanceSafe(OrganizationEntity, updatedOrganization)
  }

  async deleteOrganization(id: bigint, user: User) {
    await this.requireOrganizationRole(id, user)

    await this.prisma.organizationMember.deleteMany({ where: { organizationId: id } })
    await this.prisma.organization.delete({ where: { id } })
  }

  private async requireOrganizationRole(id: bigint, user: User) {
    const organization = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_profileId: {
          organizationId: id,
          profileId: user.profileId,
        },
        role: OrganizationRole.OWNER,
      },
    })

    if (!organization) throw new ForbiddenException('You are not the owner of this organization')
  }
}
