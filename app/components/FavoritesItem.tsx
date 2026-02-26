import Image from "next/image";

interface WishlistItemProps {
  image: string;
  name: string;
  category: string;
  price: string;
}

export default function FavoritesItem({
  image,
  name,
  category,
  price,
}: WishlistItemProps) {
  
  // สร้างตัวแปรมาเช็ค ถ้า image เป็นค่าว่าง ให้ใช้รูป placeholder แทน
  const imageSrc = image && image.trim() !== "" ? image : "/products/shoe1.svg";

  return (
    <div className="w-full max-w-sm">
      {/* Product image with heart icon */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={imageSrc} // เปลี่ยนมาใช้ imageSrc ที่เราเช็คแล้ว
          alt={name || "Product Image"}
          width={600}
          height={600}
          className="h-full w-full object-cover"
          // แนะนำให้ใส่ตัวนี้ถ้าภาพไม่ขึ้น หรือเพื่อความปลอดภัย
          unoptimized={imageSrc.startsWith("http") ? false : true} 
        />
        {/* Heart icon */}
        <button className="absolute right-3 top-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 text-black"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        </button>
      </div>

      {/* Product info */}
      <div className="mt-3 flex items-start justify-between">
        <div>
          <h3 className="text-base font-medium text-white">{name}</h3>
          <p className="text-sm text-[#C9A84C]">{category}</p>
        </div>
        <p className="text-base text-black">{price}</p>
      </div>

      {/* Add to cart button */}
      <button className="mt-3 rounded-full border border-[#C9A84C] px-5 py-2 text-sm font-medium text-[#C9A84C] transition-colors hover:border-black">
        เพิ่มในตะกร้า
      </button>
    </div>
  );
}