import Navbar from "@/app/components/Navbar";
import FavoritesItem from "@/app/components/FavoritesItem";

const favoritesItems = [
  {
    image: "/products/shoe1.svg",
    name: "Nike Air Force 1 '07",
    category: "รองเท้าผู้ชาย",
    price: "฿3,700",
  },
  {
    image: "/products/shoe1.svg",
    name: "Nike Mercury '07",
    category: "รองเท้าฟุตบอลผู้ชาย",
    price: "฿4,000",
  },
];

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-10 py-10">
        <h1 className="mb-8 text-2xl font-medium text-black">รายการโปรด</h1>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {favoritesItems.map((item, index) => (
            <FavoritesItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
