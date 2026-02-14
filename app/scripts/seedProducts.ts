import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product";

dotenv.config();

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;

    console.log("MONGO URI:", process.env.MONGODB_URI);

    if (!uri) {
      throw new Error("MONGODB_URI not found");
    }

    await mongoose.connect(uri);

    console.log("MongoDB connected ✅");

    await Product.deleteMany();

    await Product.insertMany([
      {
        name: "Air Zoom Alpha",
        slug: "air-zoom-alpha",
        category: "Running",
        basePrice: 4900,
        images: ["/products/zoom-alpha-1.jpg"],
        variants: [
          {
            color: "Black",
            sizes: [
              { size: "42", stock: 10 },
              { size: "43", stock: 8 }
            ]
          }
        ],
        tags: ["running", "men"],
        rating: 4.5
      },
      {
        name: "Street Flex Pro",
        slug: "street-flex-pro",
        category: "Lifestyle",
        basePrice: 3900,
        images: ["/products/street-flex-1.jpg"],
        variants: [
          {
            color: "White",
            sizes: [
              { size: "41", stock: 6 },
              { size: "42", stock: 12 }
            ]
          }
        ],
        tags: ["casual"],
        rating: 4.2
      },
      {
        name: "Velocity Max",
        slug: "velocity-max",
        category: "Basketball",
        basePrice: 5200,
        images: ["/products/velocity-max-1.jpg"],
        variants: [
          {
            color: "Red",
            sizes: [
              { size: "42", stock: 5 },
              { size: "44", stock: 7 }
            ]
          }
        ],
        tags: ["basketball"],
        rating: 4.8
      }
    ]);

    console.log("Seed completed 🚀");
    process.exit();
  } catch (error) {
    console.error("Seed failed ❌", error);
    process.exit(1);
  }
}

seed();
