import { NeonService } from './neon.service'
import { testHelper } from '@app/spec'
import { NeonModule } from './neon.module'
import { random } from 'lodash'
import { randomUUID } from 'crypto'
import { PrismaService } from 'nestjs-prisma'

describe('NeonService', () => {
  jest.setTimeout(25000)
  let service: NeonService
  let prisma: PrismaService

  beforeEach(async () => {
    const context = await testHelper.createContext({
      imports: [NeonModule],
    })
    service = context.app.get(NeonService)
    prisma = context.app.get(PrismaService)
  })

  it('projects', async () => {
    // try {
    //   await service.createDatabase()
    // } catch (error) {
    //   console.log(error?.response?.data)
    //   console.log(error?.data)
    //   throw error
    // }
  })

  it('prisma test', async () => {
    await service.getOrCreateConfig()
    await service._addNeonProjectIntoPrisma({
      projectId: randomUUID(),
    })
  })
  it('prisma test 2', async () => {
    const config = await service.getOrCreateConfig()
    const projectId = randomUUID()
    const branchId = randomUUID()
    await service._addNeonProjectIntoPrisma({
      projectId,
    })
    await service._addNeonBranchIntoPrisma({
      projectId,
      branchId: branchId,
    })
  })
})
