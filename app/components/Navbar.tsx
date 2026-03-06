import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { verifyToken } from "lib/jwt";
import { prisma } from "lib/prisma";
import LogoutButton from "./LogoutButton";
import SearchBox from "./SearchBox";

export default async function Navbar() {
  const token = (await cookies()).get("access_token")?.value;

  let account = null;

  if (token) {
    try {
      const user = verifyToken(token);

      account = await prisma.user.findUnique({
        where: { user_id: user.user_id },
        select: { firstname: true,
                  balance: true
        }
      });
    } catch {
      account = null;
    }
  }


  return (
    <header className="sticky top-0 z-50">
      <div className="flex items-center justify-end bg-white px-10 py-1.5">
        <div className="flex items-center gap-1 text-xs text-white/90">
          <span className="text-white/40">|</span>
          {account ? (
            <>
              <Link href="/profile" className="px-2 text-black hover:text-green-600">
                Hello, {account.firstname}
              </Link>
              <span className="text-white/40">|</span>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="px-2 hover:text-white">
              Sign In
            </Link>
          )}
        </div>
      </div>

      <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-3 shadow-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/unnamed.png" alt="Logo" width={40} height={40} className="h-10 w-auto" />
          <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>KU 2Hand</span>
        </Link>

        {/* Search center */}
        <SearchBox />

        <div className="flex items-center gap-4">
          {/* Balance */}
          {account && (
            <Link href="/finance">
              <div className="flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-1.5">
                <span className="text-sm font-bold text-green-700 hover:text-green-800">
                  {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                  }).format(Number(account.balance))}
                </span>
              </div>
            </Link>
          )}

          {/* Wishlist */}
          <Link href="/favorites" className="p-1 text-gray-500 hover:text-green-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </Link>

          {/* Finance */}
          <Link href="/finance" className="p-1 text-gray-500 hover:text-green-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="p-1 text-gray-500 hover:text-green-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
