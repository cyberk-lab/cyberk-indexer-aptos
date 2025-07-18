import { Injectable } from '@nestjs/common'
import { omit } from 'lodash'

@Injectable()
export class AptosService {
  async getModules(network: 'mainnet' | 'testnet', address: string): Promise<any> {
    console.log('getModules', network, address)
    const baseUrl =
      network === 'mainnet' ? 'https://api.mainnet.aptoslabs.com/v1' : 'https://api.testnet.aptoslabs.com/v1'

    const url = `${baseUrl}/accounts/${address}/modules`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch modules: ${response.status} ${response.statusText}`)
    }

    return await response.json().then((data) => {
      return data.map((x) => omit(x, ['bytecode']))
    })
  }
}
