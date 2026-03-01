import Link from "next/link";

interface CartSummaryProps {
  subtotal: string;
  total: string;
}

export default function CartSummary({ subtotal, total }: CartSummaryProps) {
  return (
    <div className="sticky top-24 rounded-none bg-neutral-900 p-6">
      <h2 className="mb-6 text-sm font-black uppercase tracking-widest text-white">
        ORDER SUMMARY
      </h2>

      {/* Free Shipping Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
          <span className="text-neutral-300">FREE SHIPPING</span>
          <span className="text-[#C9A84C]">{subtotal} / ฿5,000</span>
        </div>
        <div className="mt-2 h-0.5 w-full bg-neutral-700">
          <div className="h-full w-2/5 bg-[#C9A84C]" />
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-wider text-neutral-500">
          เพิ่มสินค้าให้ครบ ฿5,000 เพื่อรับการจัดส่งฟรี
        </p>
      </div>

      <div className="my-5 border-t border-neutral-800" />

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-neutral-400">SUBTOTAL</span>
          <span className="text-sm text-white">{subtotal}</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-neutral-400">SHIPPING</span>
          <span className="text-sm font-semibold text-[#C9A84C]">FREE</span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-neutral-400">TAX (8%)</span>
          <span className="text-sm text-white">-</span>
        </div>
      </div>

      <div className="my-5 border-t border-neutral-800" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-black uppercase tracking-widest text-white">TOTAL</span>
        <span className="text-xl font-black text-[#C9A84C]">{total}</span>
      </div>

      {/* Checkout button */}
      <Link href="/checkout" className="mt-6 flex w-full items-center justify-center gap-2 bg-[#C9A84C] py-4 text-xs font-black uppercase tracking-widest text-black transition-opacity hover:opacity-90">
        PROCEED TO CHECKOUT
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </Link>

      {/* Secure badge */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 text-neutral-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
        </div>
        <p className="text-[9px] uppercase tracking-widest text-neutral-600">SECURE SSL ENCRYPTED CHECKOUT SYSTEM</p>
      </div>
    </div>
  );
}
