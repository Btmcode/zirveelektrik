import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

/**
 * Prisma Postgres (Vercel Storage) uyumlu istemci.
 * prisma+postgres:// bağlantı adresi Accelerate protokolünü kullanır;
 * runtime sorguları için withAccelerate extension'ı ZORUNLUDUR.
 * (Bağlantı havuzu + global cache extension üzerinden gelir.)
 */

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
  return new PrismaClient({
    // Not: query loglaması geliştirmede dev.log'u şişirir; yalnızca hata ve uyarılar.
    log: ['error', 'warn'],
  }).$extends(withAccelerate())
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
