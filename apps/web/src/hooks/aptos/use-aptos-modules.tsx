'use client'

import { api } from '@/lib/api'
import { Network } from '@aptos-labs/ts-sdk'
import { useQuery } from '@tanstack/react-query'

export const useAptosModules = (network: Network, address: string) => {
  return useQuery({
    queryKey: ['aptos-modules', network, address],
    enabled: !!network && !!address,
    staleTime: 1000 * 60 * 3, // 30 minutes
    queryFn: async () => {
        const res = await api.getAptosModules(network, address)
        console.log('useAptosModules=', res)
        return res
    },
  })
}
