import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAuth } from "lib/auth";
import { connectMongo } from "lib/mongodb";
import mongoose from "mongoose";

export async function DELETE(request: Request) {
  console.log("=== DELETE REVIEW API CALLED ===");
  
  try {
    console.log("1. Parsing request body...");
    const body = await request.json();
    console.log("Request body:", body);
    
    const { productId, reviewId } = body;

    console.log("2. Validating parameters...");
    console.log("productId:", productId);
    console.log("reviewId:", reviewId);

    if (!productId || !reviewId) {
      console.log("ERROR: Missing parameters");
      return NextResponse.json(
        { message: "Product ID and Review ID are required" },
        { status: 400 }
      );
    }

    // Get token from cookies
    console.log("3. Getting token from cookies...");
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    console.log("Token found:", !!token);

    if (!token) {
      console.log("ERROR: No token found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("4. Decoding token...");
    const decoded = await requireAuth(token);
    const userId = decoded.user_id;
    console.log("User ID from token:", userId);

    // Connect to database
    await connectMongo();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database not connected");
    }
    const productsCollection = db.collection("products");

    console.log("5. Converting productId to ObjectId...");
    // Convert productId to ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(productId);
      console.log("ObjectId converted:", objectId);
    } catch (error) {
      console.log("ERROR: Invalid ObjectId format:", error);
      return NextResponse.json(
        { message: "Invalid product ID format." },
        { status: 400 }
      );
    }

    console.log("6. Finding product...");
    // Find product
    const product = await productsCollection.findOne({ _id: objectId });
    console.log("Product found:", !!product);
    if (!product) {
      console.log("ERROR: Product not found");
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    console.log("7. Checking reviews...");
    console.log("Product reviews:", product.reviews);
    
    // Handle special case for deleting without specific reviewId
    if (reviewId === 'delete-by-user-id') {
      console.log("8. Deleting user's review by userId (fallback method)...");
      // Remove the review using only userId (for old reviews or when _id is not available)
      const result = await productsCollection.updateOne(
        { _id: objectId },
        {
          $pull: {
            reviews: { userId: userId } as any
          }
        } as any
      );
      console.log("Delete result:", result);
      
      // Continue with the rest of the function...
      if (result.modifiedCount === 0) {
        console.log("ERROR: No documents modified");
        return NextResponse.json(
          { message: "Failed to delete review" },
          { status: 500 }
        );
      }
      
      // Get updated product and continue with user data fetching...
      const updatedProduct = await productsCollection.findOne({ _id: objectId });
      if (!updatedProduct) {
        console.log("ERROR: Failed to retrieve updated product");
        throw new Error("Failed to retrieve updated product");
      }
      
      // Recalculate average rating and fetch user data (same as before)
      let newAverageRating = 0;
      if (updatedProduct.reviews && updatedProduct.reviews.length > 0) {
        const totalRating = updatedProduct.reviews.reduce(
          (sum: number, review: any) => sum + review.rating,
          0
        );
        newAverageRating = totalRating / updatedProduct.reviews.length;
        console.log("New average rating:", newAverageRating);
      }
      
      // Update average rating
      await productsCollection.updateOne(
        { _id: objectId },
        { $set: { averageRating: newAverageRating } }
      );
      
      // Fetch user data for remaining reviews
      let reviewsWithUsers = updatedProduct.reviews || [];
      if (reviewsWithUsers.length > 0) {
        const userIds = [...new Set(reviewsWithUsers.map((review: any) => review.userId))];
        const numericUserIds = userIds.map(id => Number(id)).filter(id => !isNaN(id));
        const { prisma } = await import("lib/prisma");
        const users = await prisma.user.findMany({
          where: { user_id: { in: numericUserIds } },
          select: { user_id: true, firstname: true }
        });
        
        const userMap = users.reduce((acc, user) => {
          acc[user.user_id.toString()] = user.firstname;
          return acc;
        }, {} as Record<string, string>);
        
        reviewsWithUsers = reviewsWithUsers.map((review: any) => ({
          ...review,
          userFirstname: userMap[review.userId.toString()] || 'Anonymous'
        }));
      }
      
      return NextResponse.json({
        message: "Review deleted successfully",
        product: {
          ...updatedProduct,
          averageRating: newAverageRating,
          reviews: reviewsWithUsers
        }
      });
    }
    
    // Check if user has any reviews to delete
    const userReviewIndex = product.reviews?.findIndex(
      (review: any) => review.userId === userId
    );
    console.log("User review index:", userReviewIndex);

    if (userReviewIndex === -1 || userReviewIndex === undefined) {
      console.log("ERROR: User has not reviewed this product");
      return NextResponse.json(
        { message: "Review not found or unauthorized" },
        { status: 404 }
      );
    }

    console.log("8. Deleting user's review...");
    // Remove the review using only userId (simple and reliable)
    const result = await productsCollection.updateOne(
      { _id: objectId },
      {
        $pull: {
          reviews: { userId: userId } as any
        }
      } as any
    );
    console.log("Delete result:", result);

    console.log("9. Checking delete result...");
    if (result.modifiedCount === 0) {
      console.log("ERROR: No documents modified");
      return NextResponse.json(
        { message: "Failed to delete review" },
        { status: 500 }
      );
    }

    console.log("10. Getting updated product...");
    // Get updated product with new average rating
    const updatedProduct = await productsCollection.findOne({ _id: objectId });
    console.log("Updated product found:", !!updatedProduct);
    if (!updatedProduct) {
      console.log("ERROR: Failed to retrieve updated product");
      throw new Error("Failed to retrieve updated product");
    }
    
    console.log("11. Recalculating average rating...");
    // Recalculate average rating
    let newAverageRating = 0;
    if (updatedProduct.reviews && updatedProduct.reviews.length > 0) {
      const totalRating = updatedProduct.reviews.reduce(
        (sum: number, review: any) => sum + review.rating,
        0
      );
      newAverageRating = totalRating / updatedProduct.reviews.length;
      console.log("New average rating:", newAverageRating);
    }

    console.log("12. Updating average rating...");
    // Update average rating
    await productsCollection.updateOne(
      { _id: objectId },
      { $set: { averageRating: newAverageRating } }
    );

    console.log("13. Fetching user data for remaining reviews...");
    // Fetch user information for remaining reviews (same as add-review API)
    let reviewsWithUsers = updatedProduct.reviews || [];
    if (reviewsWithUsers.length > 0) {
      const userIds = [...new Set(reviewsWithUsers.map((review: any) => review.userId))];
      console.log("User IDs from reviews:", userIds);
      
      // Convert to numbers for Prisma query
      const numericUserIds = userIds.map(id => Number(id)).filter(id => !isNaN(id));
      console.log("Numeric user IDs for Prisma:", numericUserIds);
      
      // Import prisma and fetch user data
      const { prisma } = await import("lib/prisma");
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
      
      // Create user map for quick lookup
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

    console.log("14. Sending success response...");
    return NextResponse.json({
      message: "Review deleted successfully",
      product: {
        ...updatedProduct,
        averageRating: newAverageRating,
        reviews: reviewsWithUsers
      }
    });

  } catch (error: any) {
    console.error("=== DELETE REVIEW ERROR ===");
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
