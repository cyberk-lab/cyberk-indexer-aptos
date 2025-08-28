import { useCallback, useState } from 'react'
import { Network } from '@aptos-labs/ts-sdk'
import { Search } from 'lucide-react'
import { useAptosModules } from '@/hooks/aptos/use-aptos-modules'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import IndexerFlow from '@/components/indexer-flow'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export default function Project() {
  const [inputAddress, setInputAddress] = useState('0xc4c89099f912a7df3e9244a65c588cfd3df90ce7c25341d15272955c0e927a45')

  const [targetAddress, setTargetAddress] = useState('')
  const { data: aptosModules } = useAptosModules(Network.TESTNET, targetAddress)
  // const events = useMemo(() => extractEventsFromAptosModules(aptosModules || []), [aptosModules])

  const startIndexing = useCallback(() => {
    setTargetAddress(inputAddress)
  }, [inputAddress])

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/* <TopNav links={topNav} /> */}
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='h-full p-0'>
        <div className='mx-auto flex max-w-sm items-center gap-2'>
          <Input
            type='text'
            placeholder='Enter a contract address'
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
          <Button type='submit' variant='outline' onClick={startIndexing}>
            Start Indexing
          </Button>
        </div>
        <IndexerFlow modules={aptosModules || []} />
      </Main>
    </>
  )
}
