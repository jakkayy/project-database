import { PrismaClient } from "@prisma/client"

// เพิ่มบรรทัดนี้เพื่อเช็คค่าใน Console (ฝั่ง Terminal ของคุณ)
console.log("Checking DATABASE_URL:", process.env.DATABASE_URL);

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

export const prisma =
  globalForPrisma.prisma || 
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // เปิด Log เพื่อดูว่าติดตรงไหน
  })

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma