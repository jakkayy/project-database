import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    category: String,
    basePrice: Number,
    images: [String],

    variants: [
      {
        color: String,
        sizes: [
          {
            size: String,
            stock: Number,
          },
        ],
      },
    ],

    tags: [String],
    rating: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
