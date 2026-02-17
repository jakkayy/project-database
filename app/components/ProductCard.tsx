import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  image: string;
  name: string;
  category: string;
  basePrice: string;
  slug?: string;
}

export default function ProductCard({
  image,
  name,
  category,
  basePrice,
  slug,
}: ProductCardProps) {
  const content = (
    <div className="min-w-75 shrink-0 cursor-pointer">
      <div className="mb-3 aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          width={600}
          height={600}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h3 className="text-base font-medium text-black">{name}</h3>
      <p className="text-sm text-gray-500">{category}</p>
      <p className="mt-1 text-base text-black">{basePrice} ฿</p>
    </div>
  );

  if (slug) {
    return <Link href={`/product/${slug}`}>{content}</Link>;
  }

  return content;
}
