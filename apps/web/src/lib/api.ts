import { AptosModule } from '@/types/aptos.type'
import { Network } from '@aptos-labs/ts-sdk'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const api = {
  getAptosModules: (network: Network, address: string) => {
    return axiosInstance.get(`/aptos/${network}/modules/${address}`).then(x => x.data as AptosModule[])
  },
}