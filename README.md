# Database Project — Nike-Style E-Commerce

ระบบ E-Commerce สไตล์ Nike สร้างด้วย **Next.js 16 (App Router)** ใช้ฐานข้อมูลแบบ Polyglot โดยเก็บข้อมูลผู้ใช้/ออเดอร์ใน **MySQL (Prisma)** และข้อมูลสินค้าใน **MongoDB (Mongoose)**

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Relational DB** | MySQL 8.0 (via Prisma ORM) |
| **Document DB** | MongoDB 7 (via Mongoose) |
| **Auth** | JWT (`jsonwebtoken`) + `bcryptjs` |
| **Container** | Docker Compose |

## โครงสร้างโปรเจค

```
app/
├── api/                    # API Routes
│   ├── auth/
│   │   ├── login/          # POST  - เข้าสู่ระบบ
│   │   ├── logout/         # POST  - ออกจากระบบ
│   │   └── register/       # POST  - สมัครสมาชิก
│   ├── product/
│   │   ├── get-all-product/ # GET  - ดึงสินค้าทั้งหมด
│   │   └── get-by-slug/     # GET  - ดึงสินค้าตาม slug
│   └── profile/
│       └── get-account/     # GET  - ดึงข้อมูลบัญชีผู้ใช้
├── components/             # Shared UI Components
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── NewArrivals.tsx
│   ├── ShopBySport.tsx
│   ├── CartItem.tsx
│   ├── CartSummary.tsx
│   └── ...
├── lib/                    # Utilities & Services
│   ├── apiServices/        # Client-side API service functions
│   ├── auth.ts             # requireAuth helper
│   ├── jwt.ts              # JWT verify/sign
│   ├── mongodb.ts          # Mongoose connection (cached)
│   └── prisma.ts           # Prisma client singleton
├── models/
│   └── Product.ts          # Mongoose Product model
├── scripts/
│   └── seedProducts.ts     # Seed ข้อมูลสินค้าลง MongoDB
├── admin/                  # หน้า Admin (dashboard, product, order)
├── product/[slug]/         # หน้ารายละเอียดสินค้า
├── cart/                   # หน้าตะกร้าสินค้า
├── checkout/               # หน้าชำระเงิน
├── favorites/              # หน้ารายการโปรด
├── history/                # หน้าประวัติการสั่งซื้อ
├── profile/                # หน้าโปรไฟล์
├── setting/                # หน้าตั้งค่า
├── login/                  # หน้าเข้าสู่ระบบ
├── register/               # หน้าสมัครสมาชิก
└── page.tsx                # Homepage
prisma/
├── schema.prisma           # Prisma schema (User, Order, Payment, Address)
└── migrations/             # Migration files
middleware.ts               # Route protection (Admin routes)
docker-compose.yml          # MySQL + MongoDB containers
```

## Database Design

### MySQL (Prisma) — ข้อมูลเชิงสัมพันธ์

- **User** — ผู้ใช้ (role: USER / ADMIN)
- **Order** — คำสั่งซื้อ (status: PENDING → PROCESSING → SHIPPED → DELIVERED / CANCELLED)
- **OrderItem** — รายการสินค้าในออเดอร์ (อ้างอิง `productId` จาก MongoDB)
- **Payment** — ข้อมูลการชำระเงิน
- **Address** — ที่อยู่จัดส่ง

### MongoDB (Mongoose) — ข้อมูลสินค้า

- **Product** — name, slug, category, basePrice, images, variants (color + sizes with stock), tags, rating

## Getting Started

### 1. เตรียม Environment

สร้างไฟล์ `.env` ที่ root ของโปรเจค:

```env
DATABASE_URL="mysql://db_user:db_pass@localhost:3307/database_project"
MONGODB_URI="mongodb://root:root@localhost:27017/mydatabase?authSource=admin"
JWT_SECRET="your-secret-key"
```

### 2. เริ่ม Database Containers

```bash
docker-compose up -d
```

### 3. ติดตั้ง Dependencies

```bash
npm install
```

### 4. Setup Prisma (MySQL)

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed ข้อมูลสินค้า (MongoDB)

```bash
npx tsx app/scripts/seedProducts.ts
```

### 6. รัน Development Server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

## Authentication

- ใช้ **JWT** เก็บใน cookie (`access_token`)
- รหัสผ่านเข้ารหัสด้วย **bcryptjs**
- **Middleware** ป้องกัน route `/admin/*` — ต้อง login ก่อนเข้าถึง
- Role-based: `USER` และ `ADMIN`

## Features

- **Homepage** — แสดงสินค้ามาใหม่ (ดึงจาก MongoDB API) + หมวดหมู่กีฬา
- **Product Detail** — หน้ารายละเอียดสินค้า เลือกสี/ไซส์ ดูรูปภาพ
- **Cart** — ตะกร้าสินค้า + สรุปยอด
- **Checkout** — หน้าชำระเงิน
- **Favorites** — รายการโปรด
- **Order History** — ประวัติการสั่งซื้อ
- **Profile & Settings** — จัดการข้อมูลส่วนตัว
- **Admin Dashboard** — จัดการสินค้า, ออเดอร์
