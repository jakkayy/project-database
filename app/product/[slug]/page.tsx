"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { addCart, addFav, getStock } from "lib/apiServices/user.service";

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
  size: string;
  images: string[];
  variants: Variant[];
  tags: string[];
  rating: number;
}

interface ProductStock {
  product_id: string;
  color: string;
  size: string;
  stock: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [productStock, setProductStock] = useState<ProductStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("red");
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

  useEffect(() => {
    async function fetchProductStock() {
      if (!product) return;
      if (!selectedColor || !selectedSize) return;
      try {
        const data = await getStock({
          product_id: product._id,
          color: selectedColor,
          size: selectedSize,
        });
        setProductStock(data);
      } catch (err) {
        console.error("Failed to fetch product stock", err);
      }
    }
    fetchProductStock();
  }, [product, selectedColor, selectedSize]);

  const handleAddToFav = async () => {
    if (!product) return;

    try {
      await addFav({
        product_id: product._id,
      });

      alert("เพิ่มในรายการโปรดแล้ว");
    } catch (error: any) {
      console.error(error);
      if (error?.status === 401) {
        alert("กรุณา login ก่อน");
        return;
      }
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedSize) {
      alert("กรุณาเลือกไซส์ก่อน");
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

      alert("เพิ่มลงตะกร้าแล้ว");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด");
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-700 border-t-[#C9A84C]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <h1 className="text-2xl font-black uppercase">ไม่พบสินค้า</h1>
        <Link href="/" className="mt-4 text-sm text-neutral-400 underline hover:text-[#C9A84C]">
          กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  const currentVariant = product.variants?.find((v) => v.color.toLowerCase() === selectedColor.toLowerCase());

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top banner */}
      <div className="bg-neutral-900 py-2 text-center text-xs uppercase tracking-widest text-neutral-400">
        จัดส่งฟรีมาตรฐาน &amp; คืนสินค้าฟรี 30 วัน{" "}
        <span className="cursor-pointer text-[#C9A84C] underline">
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
                    className={`h-16 w-16 overflow-hidden border-2 bg-neutral-900 ${
                      selectedImage === i
                        ? "border-[#C9A84C]"
                        : "border-transparent hover:border-neutral-600"
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
              <div className="aspect-square w-full overflow-hidden bg-neutral-900">
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
                    className="flex h-10 w-10 items-center justify-center border border-neutral-700 bg-neutral-900 text-neutral-300 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
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
                    className="flex h-10 w-10 items-center justify-center border border-neutral-700 bg-neutral-900 text-neutral-300 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
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
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">{product.name}</h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-neutral-500">{product.category}</p>
            <p className="mt-4 text-2xl font-black text-[#C9A84C]">
              ฿{product.basePrice.toLocaleString()}
            </p>

            {/* Color selector */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">เลือกสี</p>
              <div className="flex gap-2">
                {(["red", "black", "white"] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize(null);
                    }}
                    className={`border px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                      selectedColor === color
                        ? "border-[#C9A84C] bg-[#C9A84C] text-black"
                        : "border-neutral-700 text-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    {color === "red" ? "แดง" : color === "black" ? "ดำ" : "ขาว"}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">เลือกไซส์</p>
                <button className="text-xs text-neutral-500 underline hover:text-[#C9A84C]">
                  คำแนะนำในการเลือกไซส์
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border py-3 text-center text-xs uppercase tracking-wider transition-colors ${
                      selectedSize === size
                        ? "border-[#C9A84C] bg-[#C9A84C] text-black font-bold"
                        : "border-neutral-700 text-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    EU {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart button */}
            <button 
              onClick={handleAddToCart}
              className="mt-8 flex w-full items-center justify-center gap-2 bg-[#C9A84C] py-4 text-xs font-black uppercase tracking-widest text-black transition-opacity hover:opacity-90">
              เพิ่มลงตะกร้า
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>

            {/* Wishlist button */}
            <button 
              onClick={handleAddToFav}
              className="mt-3 flex w-full items-center justify-center gap-2 border border-neutral-700 py-4 text-xs font-black uppercase tracking-widest text-neutral-300 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]">
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
            <div className="mt-8 border-t border-neutral-800 pt-6">
              <p className="text-xs leading-relaxed text-neutral-500">
                {product.tags && product.tags.length > 0 && (
                  <span className="mb-2 block uppercase tracking-wider">
                    แท็ก: {product.tags.join(", ")}
                  </span>
                )}
              </p>

              {currentVariant && (
                <ul className="mt-4 space-y-1 text-xs uppercase tracking-wider text-neutral-500">
                  <li>• สีที่แสดง: {currentVariant.color}</li>
                </ul>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="mt-6 border-t border-neutral-800 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    รีวิว ({product.rating})
                  </span>
                  <div className="flex items-center gap-1 text-[#C9A84C]">
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
                        className="h-4 w-4"
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
