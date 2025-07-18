import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiOkResponse, ApiTags, ApiParam } from '@nestjs/swagger'
import { CacheTTL } from '@nestjs/cache-manager'
import { AppCacheInterceptor } from '@app/core/interceptors/app-cache-interceptor'
import { AppCacheKey } from '@app/core/decorators/app-cache-key.decorator'
import { TransformerExposeAll } from '@app/core/decorators/transformer-expose-all.decorator'
import { AptosService } from './aptos.service'

@Controller('aptos/:network')
@ApiParam({
  name: 'network',
  enum: ['mainnet', 'testnet'],
  description: 'Aptos network (mainnet or testnet)',
})
@ApiTags('Aptos')
export class AptosController {
  constructor(private readonly aptosService: AptosService) {}

  @Get('modules/:address')
  @ApiOperation({ summary: 'Get modules for an Aptos account on specified network' })
  @ApiParam({
    name: 'address',
    description: 'Aptos account address',
  })
  @ApiOkResponse({
    description: 'List of modules for the specified account',
    schema: {
      type: 'array',
      items: { type: 'object' },
    },
  })
  @CacheTTL(3600000) // 1 hour cache
  @AppCacheKey((req) => `aptos-modules-${req.params.network}-${req.params.address}`)
  @UseInterceptors(AppCacheInterceptor)
  @TransformerExposeAll() // Return raw response without transformation
  async getModules(@Param('network') network: 'mainnet' | 'testnet', @Param('address') address: string) {
    // Validate network parameter
    if (!['mainnet', 'testnet'].includes(network)) {
      throw new Error('Network must be either mainnet or testnet')
    }

    return this.aptosService.getModules(network, address)
  }
}
