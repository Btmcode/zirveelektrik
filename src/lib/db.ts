import { PrismaClient } from '@prisma/client'

/**
 * Prisma Postgres (Vercel Storage) istemcisi.
 *
 * Not: Vercel entegrasyonu bağlantı adresini "postgres://" şemasıyla verebiliyor;
 * Prisma motoru ise yalnızca "postgresql://" kabul eder (P1013). Aşağıdaki
 * normalize adımı iki şemayı da sorunsuz çalıştırır.
 */
function resolveDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL
  if (!raw) return undefined
  return raw.replace(/^postgres:\/\//, "postgresql://")
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: resolveDatabaseUrl(),
    // Not: query loglaması geliştirmede dev.log'u şişirir; yalnızca hata ve uyarılar.
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
