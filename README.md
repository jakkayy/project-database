# 🛒 Project Database

โปรเจค E-commerce Fullstack (กีฬา)
พัฒนาด้วยเทคโนโลยี:

- ⚡ Next.js 16
- 🥟 Bun
- 🗄 Prisma (MySQL)
- 🍃 Mongoose (MongoDB)
- 🐳 Docker (สำหรับ Database เท่านั้น)

---

# 🚀 วิธีเริ่มต้นใช้งาน

## 1️⃣ Clone โปรเจค

```bash
git clone <your-repo-url>
cd project-database
```

---

## 2️⃣ สร้างไฟล์ Environment

สร้างไฟล์ `.env.local` ที่ root ของโปรเจค

```env
DATABASE_URL="mysql://root:root@localhost:3307/database_project"
MONGODB_URI="mongodb://root:root@localhost:27017/database_project?authSource=admin"
JWT_SECRET="supersecretkey123"
```

> หมายเหตุ: ใช้ `localhost` เพราะ Next.js รันบนเครื่อง ไม่ได้อยู่ใน Docker

---

## 3️⃣ รัน Database ด้วย Docker

```bash
docker compose up -d
```

จะเปิด MySQL และ MongoDB ใน background

---

## 4️⃣ ติดตั้ง Dependencies และ Sync Schema

```bash
bun install
bunx prisma db push
```

---

## 5️⃣ รัน Next.js

```bash
bun dev
```

---

## 6️⃣ Seed ข้อมูลสินค้า
ก่อนจะรัน seed ให้ register ไอดีของผู้ขายมาก่อน 2 ไอดี
```bash
bun run app/scripts/seedProducts.ts
```

---



# 🌐 URL สำหรับเข้าใช้งาน

| Service | URL |
|---|---|
| 🖥 Next.js | http://localhost:3000 |
| 🐬 MySQL (จากเครื่อง Host) | localhost:3307 |
| 🍃 MongoDB (จากเครื่อง Host) | localhost:27017 |

---

# 🧩 โครงสร้างฐานข้อมูล

## 🟢 MySQL (ผ่าน Prisma)

| Model | รายละเอียด |
|---|---|
| User | ผู้ใช้งาน (USER / ADMIN), มี balance |
| Address | ที่อยู่จัดส่งของผู้ใช้ |
| Order, OrderItem | คำสั่งซื้อและรายการสินค้า |
| Payment | การชำระเงินต่อ Order |
| Transaction | ประวัติการเงิน (DEPOSIT / TRANSFER) |
| Cart, CartItem | ตะกร้าสินค้า |
| Fav, FavItem | รายการสินค้าโปรด |
| ProductStock | สต็อกสินค้าแยก color/size (อ้างอิง MongoDB _id) |

Sync schema ด้วย:

```bash
bunx prisma db push
```

---

## 🟢 MongoDB (ผ่าน Mongoose)

ใช้สำหรับ:

- Products
- Variants
- Catalog แบบ dynamic

ไฟล์ Mongoose model อยู่ที่:

```
app/models/Product.ts
```

ไฟล์ seed อยู่ที่:

```
app/scripts/seedProducts.ts
```

---

# 📦 Services ใน Docker

| Service | รายละเอียด |
|---|---|
| mysql | MySQL 8.0 (port 3307) |
| mongodb | MongoDB 7 (port 27017) |

> Next.js **ไม่ได้**รันใน Docker — ใช้ `bun dev` บนเครื่องโดยตรง

---

# 🔄 คำสั่งที่ใช้บ่อยในการพัฒนา

## ล้างและสร้าง Database ใหม่

```bash
docker compose down -v
docker compose up -d
bunx prisma db push
bun run app/scripts/seedProducts.ts
```

---

## Prisma Studio (รันบนเครื่อง)

```bash
bunx prisma studio
```

เข้าใช้งานที่: http://localhost:5555

---

# 🗂 โครงสร้างโปรเจค

```
app/
├── api/              # API Routes
│   ├── auth/         # login, register, logout, profile
│   ├── product/      # สินค้า, search, review, stock
│   ├── cart/         # ตะกร้าสินค้า
│   ├── favorite/     # รายการโปรด
│   ├── checkout/     # ชำระเงิน
│   ├── finance/      # balance, deposit, transactions
│   ├── history/      # ประวัติคำสั่งซื้อ
│   ├── address/      # ที่อยู่จัดส่ง
│   ├── admin/        # admin panel APIs
│   └── user/         # ข้อมูลผู้ใช้
├── components/       # UI Components
├── models/           # Mongoose Models
├── scripts/          # seed scripts
├── admin/            # Admin pages (dashboard, products, orders, inventory)
├── cart/             # หน้าตะกร้า
├── checkout/         # หน้าชำระเงิน
├── favorites/        # หน้าสินค้าโปรด
├── finance/          # หน้าการเงิน
├── history/          # หน้าประวัติคำสั่งซื้อ
├── product/          # หน้าสินค้า (dynamic slug)
├── profile/          # หน้าโปรไฟล์
├── setting/          # หน้าตั้งค่า
├── login/            # หน้าเข้าสู่ระบบ
└── register/         # หน้าสมัครสมาชิก
prisma/
└── schema.prisma     # MySQL schema
```

---

Happy Coding 🚀
