# 🛒 Project Database (Docker Dev Version)

โปรเจค E-commerce Fullstack  
พัฒนาด้วยเทคโนโลยี:

- ⚡ Next.js 16  
- 🥟 Bun  
- 🗄 Prisma (MySQL)  
- 🍃 Mongoose (MongoDB)  
- 🐳 Docker + Docker Compose  

---

# 🚀 วิธีเริ่มต้นใช้งาน (Development ด้วย Docker)

## 1️⃣ Clone โปรเจค

```bash
git clone <your-repo-url>
cd project-database
```

---

## 2️⃣ สร้างไฟล์ Environment

สร้างไฟล์ `.env.local` ที่ root ของโปรเจค

```env
DATABASE_URL="mysql://root:root@mysql:3306/database_project"
MONGODB_URI="mongodb://root:root@mongodb:27017/database_project?authSource=admin"
JWT_SECRET="supersecretkey123"
```

⚠ หมายเหตุสำคัญ:

- ต้องใช้ `mysql` และ `mongodb` เป็น hostname (ชื่อ service ใน Docker)
- ห้ามใช้ `localhost` เมื่อรันผ่าน Docker

---

## 3️⃣ รันโปรเจคด้วย Docker

```bash
docker compose -f docker-compose.dev.yml up --build
```

การรันครั้งแรกจะทำสิ่งต่อไปนี้อัตโนมัติ:

- ติดตั้ง dependencies
- Sync Prisma schema ด้วย `db push`
- Seed ข้อมูลสินค้าใน MongoDB
- เปิด Next.js
- เปิด Prisma Studio

---

# 🌐 URL สำหรับเข้าใช้งาน

| Service | URL |
|----------|------|
| 🖥 Next.js | http://localhost:3000 |
| 🗄 Prisma Studio | http://localhost:5555 |
| 🐬 MySQL (จากเครื่อง Host) | localhost:3307 |
| 🍃 MongoDB (จากเครื่อง Host) | localhost:27017 |

---

# 🧩 โครงสร้างฐานข้อมูล

## 🟢 MySQL (ผ่าน Prisma)

ใช้สำหรับ:

- Users  
- Orders  
- Cart  
- Transactions  

ในโหมดพัฒนา จะ sync schema ด้วย:

```bash
bunx prisma db push
```

---

## 🟢 MongoDB (ผ่าน Mongoose)

ใช้สำหรับ:

- Products  
- Variants  
- Catalog แบบ dynamic  

ไฟล์ seed อยู่ที่:

```
app/scripts/seedProducts.ts
```

---

# 🔄 คำสั่งที่ใช้บ่อยในการพัฒนา

## 🔁 ล้างและสร้างใหม่ทั้งหมด (Reset Database)

```bash
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up --build
```

---

## 🌱 รัน Seed เองแบบ manual (จริงๆ docker รันให้แล้ว)

```bash
docker compose exec app bun run app/scripts/seedProducts.ts
```

---

## 🐚 เข้า shell ของ container

```bash
docker compose exec app sh
```

---

# 🛠 คำสั่ง Prisma (รันใน container)

```bash
bunx prisma db push
bunx prisma generate
bunx prisma studio
```

---

# 📦 Services ใน Docker

| Service | รายละเอียด |
|----------|------------|
| app | Next.js + Bun |
| mysql | MySQL 8 |
| mongodb | MongoDB 7 |

---

# พร้อมเริ่มพัฒนา

เข้าใช้งาเว็บที่ : http://localhost:3000
เข้าใช้งาน prisma studio : http://localhost:5555

Happy Coding 🚀