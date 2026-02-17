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
        images: ["http://localhost:3000/_next/image?url=https%3A%2F%2Fstatic.nike.com%2Fa%2Fimages%2Ft_web_pw_592_v2%2Ff_auto%2Fu_9ddf04c7-2a9a-4d76-add1-d15af8f0263d%2Cc_scale%2Cfl_relative%2Cw_1.0%2Ch_1.0%2Cfl_layer_apply%2F802aa7ae-10bf-46b4-ac61-9ddf0f79f890%2FAIR%2BZOOM%2BALPHAFLY%2BNEXT%2525%2B3.png&w=640&q=75"],
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
        images: ["https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/45b9bc22-9b41-472a-b742-cdd097f293c8/TIEMPO+STREETGATO+PRM.png"],
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
        images: ["https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/a94f4554-f17c-4f3f-924b-24eac25d3682/AS+M+NK+DF+VLCTY+PANT.png"],
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
