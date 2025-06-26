import { ParseBigIntPipe } from '@app/core/pipes/parse-bigint.pipe'
import { CreateOrganizationDto } from '../dtos/create-organization.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common'
import { UpdateOrganizationDto } from '../dtos/update-organization.dto'
import { QueryOrganizationDto } from '../dtos/query-organization.dto'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtGuard } from '@app/auth/guards/jwt.guard'
import { OrganizationEntity } from '../entities/organization.entity'
import { CacheTTL } from '@nestjs/cache-manager'
import { AppCacheInterceptor } from '@app/core/interceptors/app-cache-interceptor'
import { AppCacheKey } from '@app/core/decorators/app-cache-key.decorator'
import { CurUser } from '@app/core/decorators/user.decorator'
import { User } from '@prisma/client'
import { RawQuery } from '@app/core/decorators/query.decorator'
import { Role } from '@prisma/client'
import { Roles } from '@app/core/decorators/role.decorator'
import { OrganizationService } from '../services/organization.service'
import { OrganizationMemberEntity } from '../entities/organization-member.entity'

@Controller('organization')
@ApiTags('Organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all organizations (Admin only)' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => OrganizationEntity, isArray: true })
  @UseGuards(JwtGuard)
  @Roles(Role.ADMIN)
  @CacheTTL(2000)
  @UseInterceptors(AppCacheInterceptor)
  getOrganizations(@RawQuery() queryOrganizationDto: QueryOrganizationDto) {
    return this.organizationService.getOrganizations(queryOrganizationDto)
  }

  @Get('my')
  @ApiOperation({ summary: 'Get all organizations of current user' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => OrganizationMemberEntity, isArray: true })
  @UseGuards(JwtGuard)
  @CacheTTL(2000)
  @UseInterceptors(AppCacheInterceptor)
  getMyOrganizations(@CurUser() user: User) {
    return this.organizationService.getMyOrganizations(user)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific organization by ID' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => OrganizationEntity })
  @UseGuards(JwtGuard)
  @CacheTTL(2000)
  @AppCacheKey((req) => `organization-${req.params.id}`)
  @UseInterceptors(AppCacheInterceptor)
  getOrganization(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.organizationService.getOrganization(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => OrganizationEntity })
  @UseGuards(JwtGuard)
  createOrganization(@Body() createOrganizationDto: CreateOrganizationDto, @CurUser() user: User) {
    return this.organizationService.createOrganization(createOrganizationDto, user)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing organization (Owner only)' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => OrganizationEntity })
  @UseGuards(JwtGuard)
  updateOrganization(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @CurUser() user: User,
  ) {
    return this.organizationService.updateOrganization(id, updateOrganizationDto, user)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization (Owner only)' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => OrganizationEntity })
  @UseGuards(JwtGuard)
  deleteOrganization(@Param('id', ParseBigIntPipe) id: bigint, @CurUser() user: User) {
    return this.organizationService.deleteOrganization(id, user)
  }
}
