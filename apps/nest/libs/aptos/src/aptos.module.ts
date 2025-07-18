import { Module } from '@nestjs/common'
import { AptosService } from './aptos.service'
import { AptosController } from './aptos.controller'

@Module({
  controllers: [AptosController],
  providers: [AptosService],
  exports: [AptosService],
})
export class AptosModule {}
