import ClientNavbar from "@/app/components/ClientNavbar";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

const tabs = ["ทั้งหมด", "กีฬา", "สินค้า", "ทีม", "นักกีฬา", "เมือง"];

const interestImages = [
  "/products/shoe1.svg",
  "/products/shoe2.svg",
  "/products/shoe3.svg",
];

export default async function ProfilePage() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user = null;

  try {
    const payload = verifyToken(token);
    user = await prisma.user.findUnique({
      where: { user_id: payload.user_id },
      select: {
        user_id: true,
        firstname: true,
        lastname: true,
        email: true,
        createdAt: true,
      },
    });
  } catch {
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ClientNavbar />

      {/* Sub Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-4">
        <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">Profile</h1>
        <div className="flex gap-8 text-sm text-gray-400">
          <Link
            href="/profile"
            className="border-b-2 border-green-500 pb-3 -mb-4 font-semibold text-gray-900"
          >
            Profile
          </Link>
          <Link href="/history" className="transition-colors hover:text-gray-900">
            Orders
          </Link>
          <Link href="/favorites" className="transition-colors hover:text-gray-900">
            Wishlist
          </Link>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 px-10 py-8">

      {/* Profile Info */}
      <div className="mx-auto max-w-5xl px-10 py-10">
        <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="h-12 w-12 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>

            {/* Name & Member Since */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstname} {user.lastname}
              </h1>
              <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">
                Member since {memberSince}
              </p>
              <p className="mt-0.5 text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

