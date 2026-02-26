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
    await Product.deleteMany();
    await prisma.productStock.deleteMany();

    // =========================
    // 1️⃣ สร้าง Product ใน Mongo
    // =========================

    const products = await Product.insertMany([
      {
        name: "Air Zoom Alpha",
        slug: "air-zoom-alpha",
        category: "Running",
        basePrice: 4900,
        images: [
          "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/477abbf8-b37a-4fe6-b516-08e294a8487a/AIR+ZOOM+ALPHAFLY+NEXT%25+3.png",
        ],
        tags: ["running", "men"],
        rating: 4.5,
      },
      {
        name: "Street Flex Pro",
        slug: "street-flex-pro",
        category: "Lifestyle",
        basePrice: 3900,
        images: [
          "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/45b9bc22-9b41-472a-b742-cdd097f293c8/TIEMPO+STREETGATO+PRM.png",
        ],
        tags: ["casual"],
        rating: 4.2,
      },
      {
        name: "Velocity Max",
        slug: "velocity-max",
        category: "Basketball",
        basePrice: 5200,
        images: [
          "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/a94f4554-f17c-4f3f-924b-24eac25d3682/AS+M+NK+DF+VLCTY+PANT.png",
        ],
        tags: ["basketball"],
        rating: 4.8,
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