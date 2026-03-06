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
        name: "Nike Air Zoom Alpha",
        slug: "air-zoom-alpha",
        category: "Running",
        basePrice: 4900,
        images: [
          "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/477abbf8-b37a-4fe6-b516-08e294a8487a/AIR+ZOOM+ALPHAFLY+NEXT%25+3.png",
        ],
        tags: ["running", "nike"],
        rating: [4.5],
      },
      {
        name: "Nike Street Flex Pro",
        slug: "street-flex-pro",
        category: "Lifestyle",
        basePrice: 3900,
        images: [
          "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/45b9bc22-9b41-472a-b742-cdd097f293c8/TIEMPO+STREETGATO+PRM.png",
        ],
        tags: ["casual", "nike"],
        rating: [4.2],
      },
      {
        name: "Adidas Ultraboost Light",
        slug: "ultraboost-light",
        category: "Running",
        basePrice: 6900,
        images: [
          "https://media.arirunningstore.com/media/catalog/product/cache/6e478a31517304dced53ac4d3f3d5560/_/h/_hq6353_-_hq6351__01.jpg"
        ],
        tags: ["running", "adidas"],
        rating: [4.8],
      },
      {
        name: "New Balance 574 Core",
        slug: "574-core",
        category: "Lifestyle",
        basePrice: 3200,
        images: [
          "https://www.footlocker.co.th/media/catalog/product/9/9/9991-NEWWL574EVWBDVY08H-1.jpg",
        ],
        tags: ["casual", "newbalance"],
        rating: [4.4],
      },
      {
        name: "Converse Chuck Taylor All Star",
        slug: "chuck-taylor-all-star",
        category: "Lifestyle",
        basePrice: 2500,
        images: [
          "https://www.converse.co.th/media/catalog/product/cache/8fcecb462959d400cda3532b9c3dc9f0/5/7/570256c_a_08x1-1.png",
        ],
        tags: ["casual", "converse"],
        rating: [4.6],
      },
      {
        name: "Asics Gel-Kayano 30",
        slug: "gel-kayano-30",
        category: "Running",
        basePrice: 6500,
        images: [
          "https://run2paradise.com/wp-content/uploads/2024/01/KAYANO-30-ช-ด.jpg",
        ],
        tags: ["running", "asics"],
        rating: [4.7],
      },
      {
        name: "Puma Clyde All-Pro",
        slug: "clyde-all-pro",
        category: "Basketball",
        basePrice: 4800,
        images: [
          "https://www.nicekicks.com/files/2020/11/puma-clyde-all-pro-release-information-2.jpg",
        ],
        tags: ["basketball", "puma"],
        rating: [4.3],
      },
      {
        name: "Reebok Metcon 9",
        slug: "metcon-9",
        category: "Training",
        basePrice: 5200,
        images: [
          "https://vsathletics.com/store/images/P/AURORA_DZ2617-005_PHSRH000-2000.jpg",
        ],
        tags: ["training", "gym"],
        rating: [4.5],
      },
      {
        name: "New Balance FuelCell Rebel v3",
        slug: "fuelcell-rebel-v3",
        category: "Running",
        basePrice: 4700,
        images: [
          "https://run2paradise.com/wp-content/uploads/2024/01/5-2.jpg",
        ],
        tags: ["running", "newbalance"],
        rating: [4.4],
      },
      {
        name: "Vans Old Skool Classic",
        slug: "old-skool-classic",
        category: "Lifestyle",
        basePrice: 2900,
        images: [
          "https://www.footlocker.co.th/media/catalog/product/9/9/9991-VAS000D3HY2800509H-2.jpg",
        ],
        tags: ["casual", "vans"],
        rating: [4.5],
      },
      {
        name: "Under Armour HOVR Phantom 3",
        slug: "hovr-phantom-3",
        category: "Running",
        basePrice: 5400,
        images: [
          "https://underarmour.scene7.com/is/image/Underarmour/3025517-001_DEFAULT?rp=standard-30pad|pdpZoomDesktop&scl=0.50&fmt=jpg&qlt=85&resMode=sharp2&cache=on,on&bgc=f0f0f0&wid=1836&hei=1950&size=850,850",
        ],
        tags: ["running", "underarmour"],
        rating: [4.2],
      },
      {
        name: "Nike Zoom Freak 5",
        slug: "zoom-freak-5",
        category: "Basketball",
        basePrice: 5300,
        images: [
          "https://image.goxip.com/_ZmyqjEnfiCwDeXHkskCS6KgjDg=/fit-in/500x500/filters:format(jpg):quality(80):fill(white)/https:%2F%2Fimages.stockx.com%2Fimages%2FNike-Zoom-Freak-5-Emerging-Powers-GS.jpg",
        ],
        tags: ["basketball", "nike"],
        rating: [4.6],
      },
    ]);

    console.log("Products inserted in Mongo ✅");

    // =========================
    // 2️⃣ สร้าง Stock ใน MySQL
    // =========================

    for (const product of products) {
      const sizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
      const colors = ["red", "black", "white"]

      for (const size of sizes) {
        for (const color of colors) {
          await prisma.productStock.create({
            data: {
              product_id: product._id.toString(),
              color: color,
              size: size,
              stock: Math.floor(Math.random() * 20) + 1,
            },
          });
        }
      }
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