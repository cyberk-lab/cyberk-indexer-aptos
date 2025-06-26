import { proH } from '@app/helper'
import { createApiClient, OperationStatus, Project } from '@neondatabase/api-client'
import { Injectable } from '@nestjs/common'
import { NeonBranch, NeonProject } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

const neonClient = createApiClient({
  apiKey: process.env.NEON_API_KEY,
})
const ORGANIZATION_ID = process.env.NEON_ORGANIZATION_ID || undefined
const NEON_MAX_BRANCHES = parseInt(process.env.NEON_MAX_BRANCHES || '10')
const NEON_MAX_DATABASES = parseInt(process.env.NEON_MAX_DATABASES || '500')
const NEON_CONFIG_ID = 1
const NEON_PROJECT_NAME = process.env.NEON_PROJECT_NAME || 'cyberk_indexer_aptos'
const NEON_ROLE_NAME = 'cyberk'

interface NeonProjectWithCurrentBranch extends NeonProject {
  currentBranch: NeonBranch
}

@Injectable()
export class NeonService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateConfig() {
    let config = await this.prisma.neonConfig.findUnique({
      where: { id: NEON_CONFIG_ID },
      include: {
        currentProject: { include: { currentBranch: true } },
      },
    })
    if (!config) {
      config = await this.prisma.neonConfig.create({
        data: {
          id: NEON_CONFIG_ID,
        },
        include: { currentProject: { include: { currentBranch: true } } },
      })
    }
    return config
  }

  async createDatabase() {
    const project = await this._getNeonProject()
    const branch = await this._getNeonBranch(project)
    const neonDatabase = await this._createNeonDatabase({
      projectId: project.id,
      branchId: branch.id,
      databaseName: `indexer_${branch.databaseCount + 1}`,
    })
    await this.prisma.neonBranch.update({
      where: { id: branch.id },
      data: {
        databaseCount: { increment: 1 },
        databases: {
          create: {
            id: neonDatabase.data.database.id,
          },
        },
      },
    })
    await this._waitNeonProjectProcess(project.id)
  }

  private async _getNeonBranch(project?: NeonProjectWithCurrentBranch) {
    let branch = project.currentBranch!
    if (branch.databaseCount === 0 || branch.databaseCount >= NEON_MAX_DATABASES) {
      console.log('Creating new branch')
      const neonBranch = await this._createNeonBranch(project.id, project.branchCount + 1)
      project = await this._addNeonBranchIntoPrisma({ projectId: project.id, branchId: neonBranch.branch.id })
      branch = project.currentBranch!
      await this._waitNeonProjectProcess(project.id)
    }
    return branch
  }

  private async _getNeonProject() {
    const config = await this.getOrCreateConfig()
    if (!config.currentProject || config.currentProject.branchCount >= NEON_MAX_BRANCHES) {
      console.log('Creating new project')
      const neonProject = await this._createNeonProject(config.projectCount + 1)
      console.log('neonProject=', neonProject)
      // @dev ignore default branch, other branch will don't need to create schema and data
      config.currentProject = await this._addNeonProjectIntoPrisma({
        projectId: neonProject.project.id,
      })
      await this._waitNeonProjectProcess(neonProject.project.id)
    }
    return config.currentProject! as NeonProjectWithCurrentBranch
  }

  private _createNeonDatabase(options: { projectId: string; branchId: string; databaseName: string }) {
    return neonClient.createProjectBranchDatabase(options.projectId, options.branchId, {
      database: {
        name: options.databaseName,
        owner_name: NEON_ROLE_NAME,
      },
    })
  }

  _addNeonBranchIntoPrisma(options: { projectId: string; branchId: string }) {
    return this.prisma.neonProject.update({
      where: { id: options.projectId },
      data: {
        branchCount: { increment: 1 },
        currentBranch: {
          create: {
            id: options.branchId,
            projectId: options.projectId,
          },
        },
      },
      include: { currentBranch: true },
    })
  }

  _addNeonProjectIntoPrisma(options: { projectId: string }) {
    return this.prisma.neonConfig
      .update({
        where: { id: NEON_CONFIG_ID },
        data: {
          currentProject: {
            create: {
              id: options.projectId,
            },
          },
          projectCount: { increment: 1 },
        },
        include: { currentProject: { include: { currentBranch: true } } },
      })
      .then((res) => res.currentProject)
  }

  private async _waitNeonProjectProcess(projectId: string) {
    do {
      await proH.delay(2000)
      const ops = await neonClient.listProjectOperations({ projectId })
      let ok = !!ops.data.operations.length
      if (!ok) {
        const curPperation = ops.data.operations.some(
          (op) => op.status === OperationStatus.Running || op.status === OperationStatus.Scheduling,
        )
        console.log('curPperation=', curPperation)
        ok = !curPperation
      }
      if (ok) break
      console.log('Waiting for branch to be ready...', ops.data.operations)
    } while (true)
  }

  private _createNeonProject(index: number) {
    return neonClient
      .createProject({
        project: {
          name: `${NEON_PROJECT_NAME}_${index}`,
          org_id: ORGANIZATION_ID,
          region_id: 'aws-ap-southeast-1',
          branch: {
            name: 'indexer_1',
            role_name: NEON_ROLE_NAME,
            database_name: 'LET_IT_GO',
          },
        },
      })
      .then((res) => res.data)
  }

  private _createNeonBranch(projectId: string, index: number) {
    return neonClient
      .createProjectBranch(projectId, {
        branch: {
          name: `indexer_${index}`,
          init_source: 'schema-only',
        },
      })
      .then((res) => res.data)
  }
}
