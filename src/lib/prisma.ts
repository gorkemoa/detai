import { PrismaClient } from '@prisma/client';

// PrismaClient'ın global bir örneğini oluştur
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Development ortamında hot-reloading sırasında birden fazla Prisma Client örneği oluşmasını önle
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 