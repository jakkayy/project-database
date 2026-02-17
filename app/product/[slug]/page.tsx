"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { addCart } from "@/app/lib/apiServices/user.service";

interface Variant {
  color: string;
  sizes: { size: string; stock: number }[];
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  basePrice: number;
  images: string[];
  variants: Variant[];
  tags: string[];
  rating: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/product/get-by-slug?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;

    // if (!selectedSize) {
    //   alert("กรุณาเลือกไซส์ก่อน");
    //   return;
    // }

    try {
      await addCart({
        product_id: product._id,
        quantity: 1,
        basePrice: product.basePrice,
      });

      alert("เพิ่มลงตะกร้าแล้ว");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด");
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black">
        <h1 className="text-2xl font-medium">ไม่พบสินค้า</h1>
        <Link href="/" className="mt-4 underline">
          กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  const currentVariant = product.variants[selectedColor];
  const sizes = currentVariant?.sizes || [];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top banner */}
      <div className="bg-gray-100 py-2 text-center text-sm">
        จัดส่งฟรีมาตรฐาน &amp; คืนสินค้าฟรี 30 วัน{" "}
        <span className="cursor-pointer font-medium underline">
          ดูรายละเอียด
        </span>
      </div>

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
                    className={`h-16 w-16 overflow-hidden rounded border-2 bg-gray-100 ${
                      selectedImage === i
                        ? "border-black"
                        : "border-transparent"
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
              <div className="aspect-square w-full overflow-hidden bg-gray-100">
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
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
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
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
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
            {/* Name & Category */}
            <h1 className="text-2xl font-medium">{product.name}</h1>
            <p className="mt-1 text-base text-gray-500">{product.category}</p>
            <p className="mt-3 text-lg font-medium">
              ฿{product.basePrice.toLocaleString()}
            </p>

            {/* Color selector */}
            {product.variants.length > 1 && (
              <div className="mt-6">
                <p className="mb-2 text-base font-medium">เลือกสี</p>
                <div className="flex gap-2">
                  {product.variants.map((variant, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedColor(i);
                        setSelectedSize(null);
                      }}
                      className={`rounded-full border-2 px-4 py-2 text-sm ${
                        selectedColor === i
                          ? "border-black"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Single color display */}
            {product.variants.length === 1 && currentVariant && (
              <p className="mt-4 text-sm text-gray-500">
                สี: {currentVariant.color}
              </p>
            )}

            {/* Size selector */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-base font-medium">เลือกไซส์</p>
                <button className="text-sm text-gray-500 underline">
                  คำแนะนำในการเลือกไซส์
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    disabled={s.stock === 0}
                    className={`rounded-md border py-3 text-center text-sm transition-colors ${
                      selectedSize === s.size
                        ? "border-black bg-black text-white"
                        : s.stock === 0
                          ? "cursor-not-allowed border-gray-200 text-gray-300"
                          : "border-gray-300 hover:border-black"
                    }`}
                  >
                    US {s.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart button */}
            <button 
              onClick={handleAddToCart}
              className="mt-8 w-full rounded-full bg-black py-4 text-base font-medium text-white transition-colors hover:bg-gray-800">
              เพิ่มในตะกร้า
            </button>

            {/* Wishlist button */}
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 py-4 text-base font-medium transition-colors hover:border-black">
              รายการโปรด
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
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
            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="text-sm leading-relaxed text-gray-600">
                {product.tags && product.tags.length > 0 && (
                  <span className="mb-2 block">
                    แท็ก: {product.tags.join(", ")}
                  </span>
                )}
              </p>

              {currentVariant && (
                <ul className="mt-4 space-y-1 text-sm text-gray-600">
                  <li>
                    • สีที่แสดง: {currentVariant.color}
                  </li>
                </ul>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">
                    รีวิว ({product.rating})
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={
                          star <= Math.round(product.rating)
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="h-5 w-5"
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
