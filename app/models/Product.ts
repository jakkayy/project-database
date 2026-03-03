import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    category: String,
    basePrice: Number,
    images: [String],
    tags: [String],

    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },  
    toObject: { virtuals: true },
  }
);

productSchema.virtual("averageRating").get(function () {
  if (!this.reviews || this.reviews.length === 0) return 0;

  return (
    this.reviews.reduce((sum, r) => sum + r.rating, 0) /
    this.reviews.length
  );
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);