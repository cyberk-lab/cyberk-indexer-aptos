-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'MEMBER');

-- CreateTable
CREATE TABLE "Organization" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "organizationId" BIGINT NOT NULL,
    "profileId" BIGINT NOT NULL,
    "role" "OrganizationRole" NOT NULL,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("organizationId","profileId")
);

-- CreateTable
CREATE TABLE "Indexer" (
    "id" BIGSERIAL NOT NULL,
    "organizationId" BIGINT NOT NULL,
    "neonProjectId" TEXT NOT NULL,
    "neonBranchId" TEXT NOT NULL,
    "neonDbName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Indexer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startVersion" BIGINT NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "IndexerContract" (
    "indexerId" BIGINT NOT NULL,
    "contractAddress" TEXT NOT NULL,

    CONSTRAINT "IndexerContract_pkey" PRIMARY KEY ("indexerId","contractAddress")
);

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indexer" ADD CONSTRAINT "Indexer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexerContract" ADD CONSTRAINT "IndexerContract_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexerContract" ADD CONSTRAINT "IndexerContract_contractAddress_fkey" FOREIGN KEY ("contractAddress") REFERENCES "Contract"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
