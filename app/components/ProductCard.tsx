import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  image: string;
  name: string;
  category: string;
  basePrice: string;
  slug?: string;
  badge?: string;
}

export default function ProductCard({
  image,
  name,
  category,
  basePrice,
  slug,
  badge,
}: ProductCardProps) {
  const content = (
    <div className="min-w-72 shrink-0 cursor-pointer group">
      <div className="relative mb-4 aspect-square w-full overflow-hidden bg-neutral-900">
        {badge && (
          <span className="absolute left-3 top-3 z-10 bg-[#C9A84C] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
            {badge}
          </span>
        )}
        <Image
          src={image}
          alt={name}
          width={600}
          height={600}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-white">{name}</h3>
      <p className="mt-1 text-sm text-neutral-400">{basePrice} ฿</p>
    </div>
  );

  console.log("IMAGE:", image);

  if (slug) {
    return <Link href={`/product/${slug}`}>{content}</Link>;
  }

  return content;
}
