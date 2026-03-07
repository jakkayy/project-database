import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI not found");
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected ✅");

    await prisma.$connect();
    console.log("MySQL connected ✅");

    // ลบข้อมูลเก่า
    console.log("Clearing old data...");

    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.productStock.deleteMany();
    await Product.deleteMany();

    console.log("Old data cleared ✅");

    // =========================
    // 1️⃣ สร้าง Product ใน Mongo
    // =========================

    const products = await Product.insertMany([
      {
        name: "Vintage Michael Jackson T-Shirt",
        slug: "Vintage Michael Jackson T-Shirt",
        category: "Clothes",
        basePrice: 1800,
        images: [
          "https://di2ponv0v5otw.cloudfront.net/posts/2024/03/23/65ff1e386c0504f4fb2a543c/m_wp_65ff1f11c5df6c1134f12582.webp",
        ],
        tags: ["Clothes", "Michael Jackson", "Vintage"],
        shop_id: 1,
        rating: [4.5],
      },
      {
        name: "เสื้อ liverpool มือสอง",
        slug: "เสื้อ liverpool มือสอง",
        category: "Clothes",
        basePrice: 1300,
        images: [
          "https://www.tradeinn.com/f/14211/142117501/adidas-liverpool-fc-25-26-goalkeeper-third-junior-short-sleeve-t-shirt.webp",
        ],
        tags: ["Clothes", "liverpool", "football"],
        shop_id: 1,
        rating: [4.2],
      },
      {
        name: "แจ้คเก็ต ny มือสอง",
        slug: "แจ้คเก็ต ny มือสอง",
        category: "Clothes",
        basePrice: 2900,
        images: [
          "https://down-th.img.susercontent.com/file/id-11134207-7rasg-m48aw2u20kh60a.webp"
        ],
        tags: ["Clothes", "ny", "jacket"],
        shop_id: 2,
        rating: [4.8],
      },
      {
        name: "Uniqlo Shirt Light Blue Denim",
        slug: "Uniqlo Shirt Light Blue Denim",
        category: "Clothes",
        basePrice: 400,
        images: [
          "https://i.ebayimg.com/images/g/Z~kAAOSw8odnf5wo/s-l1600.webp",
        ],
        tags: ["Clothes", "Uniqlo", "Denim Shirt"],
        shop_id: 2,
        rating: [4.4],
      },
      {
        name: "รองเท้าvintage มือสอง",
        slug: "รองเท้าvintage มือสอง",
        category: "Shoes",
        basePrice: 2500,
        images: [
          "https://down-th.img.susercontent.com/file/th-11134207-7r98r-lwu2fipopbrjf3",
        ],
        tags: ["shoes", "vintage", "sneakers"],
        shop_id: 1,
        rating: [4.6],
      },
      {
        name: "UNIQLO SHORT SLEEVE SHIRT",
        slug: "uniqlo-short-sleeve-shirt",
        category: "Clothes",
        basePrice: 500,
        images: [
          "https://media.karousell.com/media/photos/products/2023/5/22/uniqlo_short_sleeve_shirt_1684748311_fdac1cb7_progressive.jpg",
        ],
        tags: ["Clothes", "Uniqlo", "Short Sleeve Shirt"],
        shop_id: 1,
        rating: [4.7],
      },
      {
        name: "หนังสือเรียนมือสอง",
        slug: "หนังสือเรียนมือสอง",
        category: "Other",
        basePrice: 200,
        images: [
          "https://down-th.img.susercontent.com/file/th-11134207-7r991-loanpdb9jzzk93@resize_w900_nl.webp",
        ],
        tags: ["basketball", "puma"],
        shop_id: 2,
        rating: [4.3],
      },
      {
        name: "Bellaria Hand Purse for Women",
        slug: "bellaria-hand-purse-for-women",
        category: "Accessories",
        basePrice: 5200,
        images: [
          "https://theholistik.com/cdn/shop/files/Bellaria-womens-purse-brown-1.webp?v=1724437313&width=823",
        ],
        tags: ["Accessories", "Bellaria", "Hand Purse"],
        shop_id: 1,
        rating: [4.5],
      },
      {
        name: "New Balance FuelCell Rebel v3",
        slug: "fuelcell-rebel-v3",
        category: "Shoes",
        basePrice: 1700,
        images: [
          "https://run2paradise.com/wp-content/uploads/2024/01/5-2.jpg",
        ],
        tags: ["running", "newbalance"],
        shop_id: 2,
        rating: [4.4],
      },
      {
        name: "Vans Old Skool Classic",
        slug: "old-skool-classic",
        category: "Shoes",
        basePrice: 900,
        images: [
          "https://www.footlocker.co.th/media/catalog/product/9/9/9991-VAS000D3HY2800509H-2.jpg",
        ],
        tags: ["casual", "vans"],
        shop_id: 2,
        rating: [4.5],
      },
      {
        name: "Under Armour HOVR Phantom 3",
        slug: "hovr-phantom-3",
        category: "Shoes",
        basePrice: 3400,
        images: [
          "https://underarmour.scene7.com/is/image/Underarmour/3025517-001_DEFAULT?rp=standard-30pad|pdpZoomDesktop&scl=0.50&fmt=jpg&qlt=85&resMode=sharp2&cache=on,on&bgc=f0f0f0&wid=1836&hei=1950&size=850,850",
        ],
        tags: ["running", "underarmour"],
        shop_id: 1,
        rating: [4.2],
      },
      {
        name: "Nike Zoom Freak 5",
        slug: "zoom-freak-5",
        category: "Shoes",
        basePrice: 3300,
        images: [
          "https://image.goxip.com/_ZmyqjEnfiCwDeXHkskCS6KgjDg=/fit-in/500x500/filters:format(jpg):quality(80):fill(white)/https:%2F%2Fimages.stockx.com%2Fimages%2FNike-Zoom-Freak-5-Emerging-Powers-GS.jpg",
        ],
        tags: ["basketball", "nike"],
        shop_id: 2,
        rating: [4.6],
      },
    ]);

    console.log("Products inserted in Mongo ✅");

    // =========================
    // 2️⃣ สร้าง Stock ใน MySQL
    // =========================

    for (const product of products) {
      await prisma.productStock.create({
        data: {
          product_id: product._id.toString(),
          color: "black",
          size: "M",
          stock: Math.floor(Math.random() * 20) + 1,
        },
      });
    }

    console.log("ProductStock inserted in MySQL ✅");

    console.log("Seed completed 🚀");
    process.exit(0);

  } catch (error) {
    console.error("Seed failed ❌", error);
    process.exit(1);
  }
}

seed();