import { Module } from '@nestjs/common'

import { AuthModule } from '@app/auth/auth.module'
import { CoreModule } from '@app/core/core.module'
import { TodoModule } from '@app/todo/todo.module'
import { AptosModule } from '@app/aptos/aptos.module'

@Module({
  imports: [CoreModule, AuthModule, TodoModule, AptosModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
