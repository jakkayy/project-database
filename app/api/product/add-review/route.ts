import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "lib/mongodb";
import { requireAuth } from "lib/auth";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { prisma } from "lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Please login before giving review." },
        { status: 401 }
      );
    }

    const user = requireAuth(token);
    const { productId, rating, comment } = await request.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Invalid data." },
        { status: 400 }
      );
    }

    await connectMongo();
    
    // Use raw MongoDB collection
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database not connected");
    }
    const productsCollection = db.collection('products');
    
    console.log("Using raw MongoDB operations...");
    
    // First, check if product exists
    const product = await productsCollection.findOne({ _id: new mongoose.Types.ObjectId(productId) });
    
    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }
    
    console.log("Found product:", product.name);
    console.log("Current reviews:", product.reviews);
    
    // Check if user already reviewed
    const existingReviewIndex = product.reviews?.findIndex(
      (review: any) => review.userId === user.user_id
    );
    
    const newReview = {
      userId: user.user_id,
      rating,
      comment,
      createdAt: new Date()
    };
    
    let updateResult;
    
    if (existingReviewIndex >= 0) {
      // Update existing review
      console.log("Updating existing review at index:", existingReviewIndex);
      updateResult = await productsCollection.updateOne(
        { _id: new mongoose.Types.ObjectId(productId) },
        { 
          $set: { 
            [`reviews.${existingReviewIndex}`]: newReview
          }
        }
      );
    } else {
      // Add new review
      console.log("Adding new review");
      updateResult = await productsCollection.updateOne(
        { _id: new mongoose.Types.ObjectId(productId) },
        { 
          $push: { 
            reviews: newReview
          }
        } as any
      );
    }
    
    console.log("Update result:", updateResult);
    
    // Verify the update
    const updatedProduct = await productsCollection.findOne({ _id: new mongoose.Types.ObjectId(productId) });
    if (!updatedProduct) {
      throw new Error("Failed to retrieve updated product");
    }
    console.log("Updated product reviews:", updatedProduct.reviews);
    
    // Fetch user information for reviews
    let reviewsWithUsers = updatedProduct.reviews || [];
    if (reviewsWithUsers.length > 0) {
      const userIds = [...new Set(reviewsWithUsers.map((review: any) => review.userId))];
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
      reviewsWithUsers = reviewsWithUsers.map((review: any) => ({
        ...review,
        userFirstname: userMap[review.userId.toString()] || 'Anonymous'
      }));
      
      console.log("Reviews with usernames:", reviewsWithUsers);
    }
    
    // Calculate average rating manually since we're using raw MongoDB
    const reviews = updatedProduct.reviews || [];
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
      : 0;
    
    // Add averageRating to the response
    const productWithAverage = {
      ...updatedProduct,
      averageRating,
      reviews: reviewsWithUsers
    };
    
    return NextResponse.json(
      { 
        message: "Review added successfully.", 
        product: productWithAverage,
        updateResult: updateResult
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred while adding review." },
      { status: error.status || 500 }
    );
  }
}
