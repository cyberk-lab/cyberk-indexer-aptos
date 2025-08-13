'use client'

import { useQuery } from '@tanstack/react-query'
import { Network } from '@aptos-labs/ts-sdk'
import { api } from '@/lib/api'

export const useAptosModules = (network: Network, address: string) => {
  return useQuery({
    queryKey: ['aptos-modules', network, address],
    enabled: !!network && !!address,
    staleTime: 1000 * 60 * 3, // 30 minutes
    queryFn: async () => {
      const res = await api.getAptosModules(network, address)
      return res
    },
  })
}
