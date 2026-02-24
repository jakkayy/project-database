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
        images: ["https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/477abbf8-b37a-4fe6-b516-08e294a8487a/AIR+ZOOM+ALPHAFLY+NEXT%25+3.png"],
        variants: [
          {
            color: "Black",
            sizes: [
              { size: "36", stock: 10 },
              { size: "37", stock: 8 },
              { size: "38", stock: 10 },
              { size: "39", stock: 8 },
              { size: "40", stock: 10 },
              { size: "41", stock: 8 },
              { size: "42", stock: 10 },
              { size: "43", stock: 8 },
              { size: "44", stock: 10 },
              { size: "45", stock: 8 }
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
        images: ["https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/45b9bc22-9b41-472a-b742-cdd097f293c8/TIEMPO+STREETGATO+PRM.png"],
        variants: [
          {
            color: "White",
            sizes: [
              { size: "36", stock: 10 },
              { size: "37", stock: 8 },
              { size: "38", stock: 10 },
              { size: "39", stock: 8 },
              { size: "40", stock: 10 },
              { size: "41", stock: 8 },
              { size: "42", stock: 10 },
              { size: "43", stock: 8 },
              { size: "44", stock: 10 },
              { size: "45", stock: 8 }
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
        images: ["https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/a94f4554-f17c-4f3f-924b-24eac25d3682/AS+M+NK+DF+VLCTY+PANT.png"],
        variants: [
          {
            color: "Red",
            sizes: [
              { size: "36", stock: 10 },
              { size: "37", stock: 8 },
              { size: "38", stock: 10 },
              { size: "39", stock: 8 },
              { size: "40", stock: 10 },
              { size: "41", stock: 8 },
              { size: "42", stock: 10 },
              { size: "43", stock: 8 },
              { size: "44", stock: 10 },
              { size: "45", stock: 8 }
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
