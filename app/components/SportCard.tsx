import Image from "next/image";

interface SportCardProps {
  image: string;
  label: string;
}

export default function SportCard({ image, label }: SportCardProps) {
  return (
    <div className="min-w-75 shrink-0 cursor-pointer">
      <div className="mb-3 aspect-3/4 w-full overflow-hidden">
        <Image
          src={image}
          alt={label}
          width={600}
          height={800}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <p className="text-base font-medium text-black">{label}</p>
    </div>
  );
}
