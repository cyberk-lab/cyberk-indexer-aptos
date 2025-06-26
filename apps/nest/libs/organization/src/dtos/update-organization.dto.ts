import { PartialType, PickType } from '@nestjs/swagger'
import { CreateOrganizationDto } from './create-organization.dto'

class _UpdateOrganizationDto extends PickType(CreateOrganizationDto, ['name', 'description']) {}
export class UpdateOrganizationDto extends PartialType(_UpdateOrganizationDto) {}
