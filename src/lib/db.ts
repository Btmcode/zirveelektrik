import { PrismaClient } from '@prisma/client'

/**
 * Bağlantı adresi çözümleme:
 *
 * 1. Fallback: Bazı sandbox/CI ortamları eski SQLite döneminden kalma
 *    "DATABASE_URL=file:..." değerini kabuk seviyesinde export ediyor ve bu
 *    değer .env.local'i eziyor. Geçersiz şema görürsek postgres mirror
 *    değişkenlerinden birine düşer (DATABASE_POSTGRES_URL / DATABASE_PRISMA_DATABASE_URL).
 * 2. Normalize: Vercel entegrasyonu "postgres://" şemasıyla verebiliyor;
 *    Prisma motoru yalnızca "postgresql://" kabul eder (P1013).
 */
function resolveDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL
  const isPostgres = raw?.startsWith("postgresql://") || raw?.startsWith("postgres://")

  const candidate =
    raw && isPostgres
      ? raw
      : (process.env.DATABASE_POSTGRES_URL ||
        process.env.DATABASE_PRISMA_DATABASE_URL ||
        raw) // son çare: ham değeri bırak (Prisma kendi hatasını verir)

  if (!candidate) return undefined
  return candidate.replace(/^postgres:\/\//, "postgresql://")
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
