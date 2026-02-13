interface CartSummaryProps {
  subtotal: string;
  total: string;
}

export default function CartSummary({ subtotal, total }: CartSummaryProps) {
  return (
    <div className="sticky top-24">
      <h2 className="mb-6 text-2xl font-medium text-black">สรุป</h2>

      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-base text-gray-600">ยอดรวมย่อย</span>
          <span className="text-base text-black">{subtotal}</span>
        </div>

        {/* Shipping */}
        <div className="flex items-start justify-between">
          <span className="text-base text-gray-600">
            ค่าธรรมเนียมการจัดส่งและดำเนินการโดย
            <br />
            ประมาณ
          </span>
          <span className="text-base text-black">ฟรี</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-black">ยอดรวม</span>
            <span className="text-base font-medium text-black">{total}</span>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <button className="mt-8 w-full rounded-full bg-black py-4 text-base font-medium text-white transition-colors hover:bg-gray-800">
        สมาชิกชำระเงิน
      </button>

      {/* PayPal */}
      <div className="mt-3 flex w-full items-center justify-center rounded-full border border-gray-300 py-3">
        <span className="text-base font-bold italic text-blue-800">
          Pay
        </span>
        <span className="text-base font-bold italic text-blue-500">Pal</span>
      </div>
    </div>
  );
}
