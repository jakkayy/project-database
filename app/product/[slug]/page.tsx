"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  addCart,
  addFav,
  deleteFav,
  getCurrentUser,
  getFav,
  getProductBySlug,
  addReview,
  deleteReview,
} from "lib/apiServices/user.service";
import { toast } from "sonner";

interface Variant {
  color: string;
  sizes: { size: string; stock: number }[];
}

interface FavoriteItem {
  favItem_id: number;
  product_id: string;
}


interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  basePrice: number;
  size: string;
  images: string[];
  variants: Variant[];
  tags: string[];
  shop_id?: number;
  shop?: { shop_id: number; name: string; image: string | null } | null;
  reviews?: {
    _id: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
    userFirstname?: string;
  }[];
  averageRating?: number;
}


export default function ProductDetailPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.slug as string);

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [favItemId, setFavItemId] = useState<number | null>(null);
  const [favLoading, setFavLoading] = useState(false);

  const syncFavoriteState = async (productId: string) => {
    try {
      const favItems = (await getFav()) as FavoriteItem[];
      const matched = (favItems ?? []).find((item) => item.product_id === productId);
      setIsFav(Boolean(matched));
      setFavItemId(matched?.favItem_id ?? null);
    } catch {
      setIsFav(false);
      setFavItemId(null);
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductBySlug(slug);
        if (!data.averageRating && data.reviews && data.reviews.length > 0) {
          data.averageRating =
            data.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) /
            data.reviews.length;
        }
        setProduct(data);
        await syncFavoriteState(data._id);
        if (data.variants && data.variants.length > 0) {
          setSelectedColor(data.variants[0].color);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchProduct();
  }, [slug]);


  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUserId(user._id);
      } catch {
        setCurrentUserId(null);
      }
    }
    fetchUser();
  }, []);

  const handleAddToFav = async () => {
    if (!product || favLoading) return;

    setFavLoading(true);
    try {
      if (isFav) {
        let targetFavItemId = favItemId;
        if (targetFavItemId === null) {
          const favItems = (await getFav()) as FavoriteItem[];
          const matched = (favItems ?? []).find((item) => item.product_id === product._id);
          targetFavItemId = matched?.favItem_id ?? null;
        }

        if (targetFavItemId !== null) {
          await deleteFav(targetFavItemId);
        }

        setIsFav(false);
        setFavItemId(null);
        toast("Removed from wishlist", {
          description: product.name,
        });
        return;
      }

      const res = await addFav({ product_id: product._id });
      setIsFav(true);
      setFavItemId(res?.data?.favItem_id ?? null);

      toast.success("Added to wishlist", {
        description: product.name,
        icon: "♡",
      });
    } catch (error: unknown) {
      console.error(error);
      const status = (error as { status?: number })?.status;
      if (status === 401) {
        toast.error("Please sign in first", {
          description: "Sign in to save your wishlist",
        });
        return;
      }
      toast.error("An error occurred", {
        description: "Could not add to wishlist. Please try again",
      });
    } finally {
      setFavLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedSize) {
      toast.warning("Please select a size", {
        description: "Choose your size above",
      });
      return;
    }

    try {
      await addCart({
        product_id: product._id,
        quantity: 1,
        basePrice: product.basePrice,
        size: selectedSize, 
        color: selectedColor,
      });

      toast.success("Added to cart", {
        description: `${product.name} — EU ${selectedSize}`,
        icon: "🛒",
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred", {
        description: "Could not add item. Please try again",
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!product) return;

    try {
      const response = await deleteReview({ productId: product._id, reviewId });
      toast.success("Review deleted", { description: "Your review has been removed" });
      if (response.product) setProduct(response.product);
    } catch (error: unknown) {
      console.error(error);
      const status = (error as { status?: number })?.status;
      const message = (error as { message?: string })?.message;
      if (status === 401) {
        toast.error("Please sign in", { description: "You must be signed in to delete a review" });
      } else {
        toast.error("An error occurred", { description: message || "Could not delete review. Please try again" });
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!product) return;
    
    if (rating === 0) {
      toast.warning("Please rate the product", {
        description: "Select a rating from 1 to 5 stars",
      });
      return;
    }

    setSubmittingReview(true);
    
    try {
      const response = await addReview({ productId: product._id, rating, comment });
      toast.success("Review submitted", { description: "Thank you for your feedback" });
      setRating(0);
      setComment("");
      if (response.product) setProduct(response.product);
    } catch (error: unknown) {
      console.error(error);
      const message = (error as { message?: string })?.message;
      toast.error("An error occurred", {
        description: message || "Could not submit review. Please try again",
      });
    } finally {
      setSubmittingReview(false);
    }
  };




  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900">
        <h1 className="text-2xl font-black uppercase">Product Not Found</h1>
        <Link href="/" className="mt-4 text-sm text-gray-400 underline hover:text-green-600">
          Back to Home
        </Link>
      </div>
    );
  }

  const currentVariant = product.variants?.find((v) => v.color.toLowerCase() === selectedColor.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Left: Images */}
          <div className="flex gap-4 lg:flex-1">
            {/* Thumbnail column */}
            {product.images.length > 1 && (
              <div className="flex flex-col gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-16 w-16 overflow-hidden border-2 bg-gray-100 rounded-lg ${
                      selectedImage === i
                        ? "border-green-500"
                        : "border-transparent hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="relative flex-1">
              <div className="aspect-square w-full overflow-hidden bg-gray-100 rounded-2xl">
                <Image
                  src={product.images[selectedImage] || "/products/shoe1.svg"}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Image navigation arrows */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-white text-gray-500 rounded-lg transition-colors hover:border-green-500 hover:text-green-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-white text-gray-500 rounded-lg transition-colors hover:border-green-500 hover:text-green-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product info */}
          <div className="lg:w-100 lg:shrink-0">
            {/* Shop info */}
            {product.shop && (
              <Link href={`/shop/${product.shop.shop_id}`} className="flex items-center gap-3 mb-5 group w-fit">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                  {product.shop.image ? (
                    <Image src={product.shop.image} alt={product.shop.name} width={36} height={36} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-green-100 text-sm font-black text-green-600">
                      {product.shop.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">Sold by</p>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors">{product.shop.name}</p>
                </div>
              </Link>
            )}

            {/* Name & Category */}
            <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">{product.name}</h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-gray-400">{product.category}</p>
            <p className="mt-4 text-2xl font-black text-green-600">
              ฿{product.basePrice.toLocaleString()}
            </p>

            {/* Color selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.color}
                      onClick={() => {
                        setSelectedColor(v.color);
                        setSelectedSize(null);
                      }}
                      className={`border rounded-lg px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                        selectedColor === v.color
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-200 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {v.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {currentVariant && currentVariant.sizes && currentVariant.sizes.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Size</p>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {currentVariant.sizes.map(({ size, stock }) => (
                    <button
                      key={size}
                      disabled={stock === 0}
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-lg py-3 text-center text-xs uppercase tracking-wider transition-colors ${
                        selectedSize === size
                          ? "border-green-500 bg-green-500 text-white font-bold"
                          : stock === 0
                          ? "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                          : "border-gray-200 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart button */}
            <button 
              onClick={handleAddToCart}
              className="mt-8 flex w-full items-center justify-center gap-2 bg-green-500 py-4 text-xs font-black uppercase tracking-widest text-white rounded-xl transition-opacity hover:opacity-90">
              Add to Cart
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>

            {/* Wishlist button */}
            <button 
              onClick={handleAddToFav}
              disabled={favLoading}
              className={`mt-3 flex w-full items-center justify-center gap-2 border py-4 text-xs font-black uppercase tracking-widest rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                isFav
                  ? "border-green-500 bg-green-500 text-white hover:opacity-90"
                  : "border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-500"
              }`}>
              {isFav ? "In Wishlist" : "Add to Wishlist"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isFav ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>

            {/* Product details section */}
            <div className="mt-8 border-t border-gray-200 pt-6 space-y-2 text-xs uppercase tracking-wider text-gray-400">
              {product.tags && product.tags.length > 0 && (
                <p>Tags: {product.tags.join(", ")}</p>
              )}
              {currentVariant && (
                <p>Color: {currentVariant.color}</p>
              )}
              {selectedSize && currentVariant && (() => {
                const sizeData = currentVariant.sizes.find(s => s.size === selectedSize);
                return sizeData ? (
                  <p className={sizeData.stock === 0 ? "text-red-400" : "text-green-600"}>
                    Stock: {sizeData.stock === 0 ? "Out of stock" : `${sizeData.stock} units`}
                  </p>
                ) : null;
              })()}
            </div>

            {/* Rating */}
            {(product.averageRating !== undefined || (product.reviews && product.reviews.length > 0)) && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Reviews ({product.reviews?.length || 0})
                  </span>
                  <div className="flex items-center gap-1 text-green-500">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const averageRating = product.averageRating || 0;
                      const isFilled = star <= Math.floor(averageRating);
                      const isHalfFilled = star === Math.ceil(averageRating) && averageRating % 1 !== 0;
                      const fillPercentage = isHalfFilled ? (averageRating % 1) * 100 : isFilled ? 100 : 0;
                      
                      return (
                        <div key={star} className="relative h-4 w-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                            />
                          </svg>
                          {(isFilled || isHalfFilled) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="#22c55e"
                              stroke="none"
                              strokeWidth={0}
                              className="absolute top-0 left-0 h-4 w-4 overflow-hidden"
                              style={{ clipPath: fillPercentage < 100 ? `inset(0 ${100 - fillPercentage}% 0 0)` : 'none' }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                              />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                    <span className="ml-2 text-xs text-gray-400">
                      {(product.averageRating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Review Form */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
                Rate &amp; Review
              </h3>

              {/* Star Rating */}
              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Rating
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={
                          star <= (hoveredStar || rating)
                            ? "#22c55e"
                            : "none"
                        }
                        stroke="#22c55e"
                        strokeWidth={1.5}
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Form */}
              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Comment
                </p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || rating === 0}
                className="w-full rounded-lg bg-green-500 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>

            {/* Comments Section */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                    Comments ({product.reviews.length})
                  </h3>
                  {product.reviews.some(review => review.userId === currentUserId) && (
                    <button
                      onClick={() => {
                        const userReviews = product.reviews?.filter(review => review.userId === currentUserId) || [];
                        userReviews.forEach(review => handleDeleteReview(review._id || 'delete-by-user-id'));
                      }}
                      className="text-xs text-red-500 hover:text-red-400 transition-colors"
                    >
                      Delete my review
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {(showAllComments ? product.reviews : product.reviews.slice(0, 3)).map((review, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">
                            {review.userFirstname || 'Anonymous'}
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={star <= review.rating ? "#22c55e" : "none"}
                                stroke="#22c55e"
                                strokeWidth={1.5}
                                className="h-3 w-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          {review.userId === currentUserId && (
                            <button
                              onClick={() => handleDeleteReview(review._id || 'delete-by-user-id')}
                              className="text-xs text-red-500 hover:text-red-400 transition-colors"
                              title="Delete review"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-4 w-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
                {product.reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllComments(!showAllComments)}
                    className="mt-4 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 transition-colors hover:border-green-500 hover:text-green-500"
                  >
                    {showAllComments ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}

            
          </div>
        </div>
      </div>
    </div>
  );
}
