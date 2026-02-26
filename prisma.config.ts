import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // ดึงค่าจากไฟล์ .env มาใช้
    url: process.env.DATABASE_URL,
  },
});