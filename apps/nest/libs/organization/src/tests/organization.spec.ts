import { TestContext, testHelper, UserContextTestType } from '@app/spec/test.helper'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { CreateOrganizationDto } from '../dtos/create-organization.dto'
import { OrganizationModule } from '../organization.module'
import qs from 'qs'
import { Organization, OrganizationMember, Role } from '@prisma/client'
import { UpdateOrganizationDto } from '../dtos/update-organization.dto'

describe('OrganizationSpec', () => {
  let tc: TestContext
  let app: INestApplication
  let prismaService: PrismaService
  let uc: UserContextTestType
  let adminUc: UserContextTestType

  beforeAll(async () => {
    tc = await testHelper.createContext({
      imports: [OrganizationModule],
    })
    app = tc.app
    prismaService = app.get(PrismaService)
    uc = await tc.generateAcount()
    adminUc = await tc.generateAcount({ role: Role.ADMIN })
  })

  afterAll(async () => await tc?.clean())

  describe('Create', () => {
    test('Create:NameIsRequired', async () => {
      const res = await uc.request((r) => r.post('/organization')).send({} as CreateOrganizationDto)
      expect(res).toBeBad(/name should not be empty/)
    })

    test('Create:Success', async () => {
      const res = await uc
        .request((r) => r.post('/organization'))
        .send({ name: 'Test Organization' } as CreateOrganizationDto)
      expect(res).toBeCreated()
      expect(res.body.name).toBe('Test Organization')
    })
  })

  describe('Fetch', () => {
    let organization: Organization
    beforeAll(async () => {
      const res = await uc
        .request((r) => r.post('/organization'))
        .send({ name: 'Test Organization' } as CreateOrganizationDto)
      organization = res.body
    })

    test('GetOrganization', async () => {
      const res = await uc.request((r) => r.get(`/organization/${organization.id}`))
      expect(res).toBeOK()
      expect(res.body.id).toBe(organization.id)
    })

    test('GetOrganizations:AdminOnly', async () => {
      // Regular user should not be able to list all organizations
      const regularUserRes = await uc.request((r) => r.get('/organization'))
      expect(regularUserRes).toBeForbidden()

      // Admin should be able to list all organizations
      const adminRes = await adminUc.request((r) => r.get('/organization'))
      expect(adminRes).toBeOK()
      expect(adminRes.body.length).toBeGreaterThan(0)
    })

    test('GetMyOrganizations', async () => {
      const res = await uc.request((r) => r.get('/organization/my'))
      expect(res).toBeOK()
      expect(res.body.length).toBeGreaterThan(0)
      expect(res.body[0].organization).toBeDefined()
      expect(res.body[0].role).toBe('OWNER')
    })

    test('GetOrganizations:WithQuery', async () => {
      const paramDto = {
        where: {
          id: { gt: 0 },
          name: { startsWith: 'Test' },
        },
        include: ['members'],
        take: 3,
      }
      const param = qs.stringify(paramDto)
      const res = await adminUc.request((r) => r.get(`/organization?${param}`))
      expect(res).toBeOK()
      expect(res.body.length).toBeGreaterThan(0)
    })
  })

  describe('Update', () => {
    let organization: Organization
    beforeAll(async () => {
      const res = await uc
        .request((r) => r.post('/organization'))
        .send({ name: 'Test Organization' } as CreateOrganizationDto)
      organization = res.body
    })

    test('Update:Forbidden', async () => {
      // Create another user who is not a member
      const otherUser = await tc.generateAcount()
      const res = await otherUser
        .request((r) => r.put(`/organization/${organization.id}`))
        .send({ name: 'Updated Organization' } as UpdateOrganizationDto)
      expect(res).toBeForbidden()
    })

    test('Update:Success', async () => {
      const res = await uc
        .request((r) => r.put(`/organization/${organization.id}`))
        .send({ name: 'Updated Organization' } as UpdateOrganizationDto)
      expect(res).toBeOK()
      const updatedOrgRes = await uc.request((r) => r.get(`/organization/${organization.id}`))
      expect(updatedOrgRes.body.name).toBe('Updated Organization')
    })
  })

  describe('Delete', () => {
    let organization: Organization
    beforeAll(async () => {
      const res = await uc
        .request((r) => r.post('/organization'))
        .send({ name: 'Test Organization' } as CreateOrganizationDto)
      organization = res.body
    })

    test('Delete:Forbidden', async () => {
      // Create another user who is not a member
      const otherUser = await tc.generateAcount()
      const res = await otherUser.request((r) => r.delete(`/organization/${organization.id}`))
      expect(res).toBeForbidden()
    })

    test('Delete:Success', async () => {
      const res = await uc.request((r) => r.delete(`/organization/${organization.id}`))
      expect(res).toBeOK()
      const deletedOrgRes = await uc.request((r) => r.get(`/organization/${organization.id}`))
      expect(deletedOrgRes).toBe404()
    })
  })
})
