import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />

      {/* Profile Sub Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-10 py-4">
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">คำสั่งซื้อ</h1>
        <div className="flex gap-8 text-sm text-neutral-500">
          <Link href="/profile" className="transition-colors hover:text-white">
            โปรไฟล์
          </Link>
          <Link
            href="/history"
            className="border-b-2 border-[#C9A84C] pb-3 -mb-4 font-semibold text-white"
          >
            คำสั่งซื้อ
          </Link>
          <Link href="/favorites" className="transition-colors hover:text-white">
            รายการโปรด
          </Link>
          <Link href="/setting" className="transition-colors hover:text-white">
            การตั้งค่า
          </Link>
        </div>
      </div>

      {/* Empty Orders Content */}
      <div className="flex-1 px-10 py-6">
        <p className="text-xs uppercase tracking-wider text-neutral-500">คุณยังไม่มีคำสั่งซื้อ</p>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-900 px-10 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              แหล่งข้อมูล
            </h3>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  ค้นหาร้านค้า
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  สมัครสมาชิก Nike
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  ข้อเสนอสำหรับนักเรียน
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  ส่งข้อเสนอแนะ
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  โค้ดโปรโมชัน
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              ความช่วยเหลือ
            </h3>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  รับความช่วยเหลือ
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  สถานะคำสั่งซื้อ
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  การจัดส่ง
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  การคืนสินค้า
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  ตัวเลือกการชำระเงิน
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              บริษัท
            </h3>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  เกี่ยวกับ Nike
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  ข่าวสาร
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  อาชีพ
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  นักลงทุน
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  ความยั่งยืน
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Location */}
          <div className="flex justify-end">
            <div className="flex items-start gap-2 text-xs text-neutral-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              <span>ไทย</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
