import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsString } from 'class-validator'
import { Expose } from 'class-transformer'

export class NetworkParamDto {
  @ApiProperty({
    description: 'Aptos network',
    enum: ['mainnet', 'testnet'],
    example: 'mainnet',
  })
  @IsString()
  @IsIn(['mainnet', 'testnet'], { message: 'Network must be either mainnet or testnet' })
  @Expose()
  network: 'mainnet' | 'testnet'
}
