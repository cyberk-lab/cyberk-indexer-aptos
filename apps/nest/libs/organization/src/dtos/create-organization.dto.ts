import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateOrganizationDto {
  @ApiProperty({ description: 'The name of the organization', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Expose()
  name: string

  @ApiPropertyOptional({ description: 'Optional description for the organization' })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string
}
