import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "lib/mongodb";
import Product from "@/app/models/Product";
import { prisma } from "lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Convert to plain object and calculate average rating
    const productObj = product.toObject();
    console.log("Raw reviews from DB:", JSON.stringify(productObj.reviews, null, 2));
    
    // Fetch user information for reviews
    if (productObj.reviews && productObj.reviews.length > 0) {
      const userIds = [...new Set(productObj.reviews.map((review: any) => review.userId))];
      console.log("User IDs from reviews:", userIds);
      
      // Convert to numbers for Prisma query (Prisma user_id is number)
      const numericUserIds = userIds.map(id => Number(id)).filter(id => !isNaN(id));
      console.log("Numeric user IDs for Prisma:", numericUserIds);
      
      // Fetch user data from Prisma
      const users = await prisma.user.findMany({
        where: {
          user_id: { in: numericUserIds }
        },
        select: {
          user_id: true,
          firstname: true
        }
      });
      
      console.log("Found users:", users);
      
      // Create user map for quick lookup (use string keys to match review userIds)
      const userMap = users.reduce((acc, user) => {
        acc[user.user_id.toString()] = user.firstname;
        return acc;
      }, {} as Record<string, string>);
      
      console.log("User map:", userMap);
      
      // Add user firstname to each review
      productObj.reviews = productObj.reviews.map((review: any) => ({
        ...review,
        userFirstname: userMap[review.userId.toString()] || 'Anonymous'
      }));
      
      console.log("Reviews with usernames:", productObj.reviews);
      
      // Calculate average rating
      productObj.averageRating = productObj.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / productObj.reviews.length;
    } else {
      productObj.averageRating = 0;
    }

    // Fetch variants (color/size/stock) from MySQL ProductStock
    const stocks = await prisma.productStock.findMany({
      where: { product_id: productObj._id.toString() },
    });

    // Group into { color, sizes: [{ size, stock }] }[]
    const variantMap: Record<string, { size: string; stock: number }[]> = {};
    for (const s of stocks) {
      if (!variantMap[s.color]) variantMap[s.color] = [];
      variantMap[s.color].push({ size: s.size, stock: s.stock });
    }
    productObj.variants = Object.entries(variantMap).map(([color, sizes]) => ({
      color,
      sizes,
    }));

    // Include shop info
    if (productObj.shop_id) {
      const shop = await prisma.shop.findUnique({
        where: { shop_id: productObj.shop_id },
        select: { shop_id: true, name: true, image: true },
      });
      productObj.shop = shop ?? null;
    }

    return NextResponse.json(productObj);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
