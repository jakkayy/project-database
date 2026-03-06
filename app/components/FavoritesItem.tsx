import Image from "next/image";
import Link from "next/link";

interface WishlistItemProps {
  image: string;
  name: string;
  category: string;
  price: string;
  slug: string;
  onDelete?: () => void;
}

export default function FavoritesItem({
  image,
  name,
  category,
  price,
  slug,
  onDelete,
}: WishlistItemProps) {
  const imageSrc = image && image.trim() !== "" ? image : "/products/shoe1.svg";

  return (
    <div className="w-full max-w-sm">
      {/* Product image with heart icon */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Link href={`/product/${slug}`} className="block h-full w-full">
          <Image
            src={imageSrc}
            alt={name || "Product Image"}
            width={600}
            height={600}
            className="h-full w-full object-cover"
            unoptimized={imageSrc.startsWith("http") ? false : true}
          />
        </Link>
        {/* Heart icon — black on white (favorited state) */}
        <button
          onClick={onDelete}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        </button>
      </div>

      {/* Product info */}
      <Link href={`/product/${slug}`}>
        <div className="mt-3 flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium text-white">{name}</h3>
            <p className="text-sm text-[#C9A84C]">{category}</p>
          </div>
          <p className="text-base text-white">{price}</p>
        </div>
      </Link>
    </div>
  );
}
