import { IsIncludeOnlyKeys, IsIncludeOnlyValues } from '@app/helper/class.validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { Expose, Type } from 'class-transformer'
import { IsOptional, IsNumber, IsObject, IsArray } from 'class-validator'

const OrganizationFields = Object.values(Prisma.OrganizationScalarFieldEnum)
const OrganizationRelationFields = ['members', 'indexers']
const OrganizationSortOrders = Object.values(Prisma.SortOrder)

export class QueryOrganizationDto {
  @ApiPropertyOptional({
    description: 'Filter criteria based on Organization fields',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  @IsIncludeOnlyKeys(OrganizationFields)
  @Expose()
  where?: Record<string, any>

  @ApiPropertyOptional({
    description: 'Sorting criteria (field: asc|desc)',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  @IsIncludeOnlyKeys(OrganizationFields)
  @IsIncludeOnlyValues(OrganizationSortOrders)
  @Expose()
  sort?: Record<string, string>

  @ApiPropertyOptional({ description: 'Select specific fields to return', type: [String] })
  @IsOptional()
  @IsArray()
  @IsIncludeOnlyKeys(OrganizationFields)
  @Expose()
  select?: string[]

  @ApiPropertyOptional({ description: 'Include relations', type: [String] })
  @IsOptional()
  @IsArray()
  @IsIncludeOnlyKeys(OrganizationRelationFields)
  @Expose()
  include?: string[]

  @ApiPropertyOptional({ description: 'Number of records to skip (pagination)' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose()
  skip?: number

  @ApiPropertyOptional({ description: 'Number of records to take (pagination)' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose()
  take?: number
}
