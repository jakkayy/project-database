import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { verifyToken } from "lib/jwt";
import { prisma } from "lib/prisma";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const token = (await cookies()).get("access_token")?.value;

  let account = null;

  if (token) {
    try {
      const user = verifyToken(token);

      account = await prisma.user.findUnique({
        where: { user_id: user.user_id },
        select: { firstname: true }
      });
    } catch {
      account = null;
    }
  }


  return (
    <header className="sticky top-0 z-50">
      <div className="flex items-center justify-between bg-neutral-900 px-10 py-2">
        <Image src="/jordan.svg" alt="Jordan" width={20} height={20} className="invert" />

        <div className="flex items-center gap-1 text-xs text-neutral-300">
          <Link href="#" className="px-2 hover:text-[#C9A84C]">
            ค้นหาร้าน
          </Link>

          <span className="text-neutral-600">|</span>

          <Link href="#" className="px-2 hover:text-[#C9A84C]">
            ความช่วยเหลือ
          </Link>

          <span className="text-neutral-600">|</span>

          <Link href="/register" className="px-2 hover:text-[#C9A84C]">
            เข้าร่วมกับเรา
          </Link>

          <span className="text-neutral-600">|</span>

          {account ? (
            <>
              <Link href="/profile" className="px-2 hover:text-[#C9A84C]">
                สวัสดีคุณ {account.firstname}
              </Link>

              <span className="text-neutral-600">|</span>

              <LogoutButton />
            </>

          ) : (
            <Link href="/login" className="px-2 hover:text-[#C9A84C]">
              ลงชื่อเข้าใช้
            </Link>
          )}
        </div>
      </div>
      
      <nav className="flex items-center justify-between border-b border-neutral-800 bg-black px-10 py-3">
      {/* Logo */}
      <Link href="/">
        <Image src="/nike.svg" alt="Nike" width={60} height={24} className="invert" />
      </Link>

      {/* Nav Links */}
      <ul className="flex items-center gap-6 text-sm font-medium text-neutral-200">
        <li>
          <Link href="#" className="hover:text-[#C9A84C] transition-colors">
            ข้อเสนอจำกัดเวลา
          </Link>
        </li>
        <li>
          <Link href="#" className="hover:text-[#C9A84C] transition-colors">
            ใหม่และโดดเด่น
          </Link>
        </li>
        <li>
          <Link href="#" className="hover:text-[#C9A84C] transition-colors">
            ผู้ชาย
          </Link>
        </li>
        <li>
          <Link href="#" className="hover:text-[#C9A84C] transition-colors">
            ผู้หญิง
          </Link>
        </li>
        <li>
          <Link href="#" className="hover:text-[#C9A84C] transition-colors">
            เด็ก
          </Link>
        </li>
        <li>
          <Link href="#" className="hover:text-[#C9A84C] transition-colors">
            SNKRS
          </Link>
        </li>
      </ul>

      {/* Right side: Search, Wishlist, Cart */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-full bg-neutral-800 px-4 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4 text-neutral-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <span className="text-sm text-neutral-500">ค้นหา</span>
        </div>

        {/* Wishlist */}
        <Link href="/favorites" className="p-1 text-neutral-300 hover:text-[#C9A84C] transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </Link>

        {/* Finance */}
        <Link href="/finance" className="p-1 text-neutral-300 hover:text-[#C9A84C] transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </Link>

        {/* Cart */}
        <Link href="/cart" className="p-1 text-neutral-300 hover:text-[#C9A84C] transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </Link>
      </div>
    </nav>
    </header>
  );
}
