import Navbar from "@/app/components/Navbar";
import CartItem from "@/app/components/CartItem";
import CartSummary from "@/app/components/CartSummary";

const cartItems = [
  {
    image: "/products/shoe1.svg",
    name: "Nike Mercurial Vapor 16 Academy",
    description: "รองเท้าฟุตบอลไม่มีข้อสำหรับสนามในร่ม/คอร์ท",
    color: "Racer Blue/ขาว",
    size: "M 9 / W 10.5",
    price: "฿3,300.00",
  },
  {
    image: "/products/shoe2.svg",
    name: "Nike Tiempo Maestro Elite LE",
    description: "รองเท้าสตั๊ดฟุตบอลไม่มีข้อสำหรับพื้นสนามทั่วไป",
    color: "Metallic Red Bronze/Metallic Rose Gold",
    size: "M 8 / W 9.5",
    price: "฿8,700.00",
  },
  {
    image: "/products/shoe3.svg",
    name: "Nike Tiempo Maestro Elite",
    description: "รองเท้าสตั๊ดฟุตบอลไม่มีข้อสำหรับพื้นสนามหญ้าเทียม",
    color: "ขาว/Racer Blue/Pink Blast/ดำ",
    size: "M 7 / W 8.5",
    price: "฿8,300.00",
  },
];

export default function CartPage() {
  const subtotal = "฿20,300.00";
  const total = "฿20,300.00";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Promo banner */}
      <div className="bg-gray-100 py-3 text-center text-sm text-black">
        ข้อเสนอมีจำกัด: รับส่วนลดสูงสุด 45% โดยไม่ต้องใช้โค้ด{" "}
        <a href="#" className="font-medium underline">
          เมื่อไม่เป็นไปตามที่กำหนด ข้อเสนอ
        </a>
      </div>

      {/* Cart content */}
      <div className="mx-auto max-w-7xl px-10 py-10">
        <div className="flex gap-12">
          {/* Left: Cart items */}
          <div className="flex-1">
            <h1 className="mb-2 text-2xl font-medium text-black">ตะกร้า</h1>
            {cartItems.map((item, index) => (
              <CartItem key={index} {...item} />
            ))}

            {/* Urgency message */}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
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
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <span>เหลืออีกไม่มากแล้ว รีบสั่งซื้อเลย</span>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="w-80 shrink-0">
            <CartSummary subtotal={subtotal} total={total} />
          </div>
        </div>
      </div>
    </div>
  );
}
