import { Module } from '@nestjs/common'
import { OrganizationController } from './controllers/organization.controller'
import { OrganizationService } from './services/organization.service'
import { PrismaModule } from 'nestjs-prisma'

@Module({
  imports: [PrismaModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
