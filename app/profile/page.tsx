import Navbar from "@/app/components/Navbar";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/prisma";
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
      where: { id: payload.user_id },
      select: {
        id: true,
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

  const memberSince = new Date(user.createdAt).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Profile Sub Navigation */}
      <div className="flex justify-center gap-8 border-b border-gray-200 py-4 text-sm text-gray-500">
        <Link
          href="/profile"
          className="text-black font-medium border-b-2 border-black pb-3 -mb-4"
        >
          โปรไฟล์
        </Link>
        <Link href="/checkout" className="hover:text-black pb-3 -mb-4">
          คำสั่งซื้อ
        </Link>
        <Link href="/favorites" className="hover:text-black pb-3 -mb-4">
          รายการโปรด
        </Link>
        <Link href="/setting" className="hover:text-black pb-3 -mb-4">
          การตั้งค่า
        </Link>
      </div>

      {/* Profile Info */}
      <div className="mx-auto max-w-5xl px-10 py-10">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="h-12 w-12 text-gray-400"
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
            <h1 className="text-2xl font-medium text-black">
              {user.firstname} {user.lastname}
            </h1>
            <p className="text-sm text-gray-500">
              เป็นสมาชิก Nike ตั้งแต่ {memberSince}
            </p>
          </div>
        </div>

        {/* Interests Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-black">ความสนใจ</h2>
            <button className="text-sm text-gray-500 hover:text-black">
              แก้ไข
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-4 border-b border-gray-200">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`pb-3 text-sm ${
                  index === 0
                    ? "border-b-2 border-black font-medium text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Interest Description */}
          <p className="mt-4 text-sm text-gray-500">
            เพิ่มความสนใจของคุณเพื่อสื่อสารและแลกเปลี่ยนสินค้าตามสิ่งที่คุณสนใจ
          </p>

          {/* Interest Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {/* Add Interest Card */}
            <div className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-100 transition hover:bg-gray-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <span className="mt-3 text-sm font-medium text-black">
                เพิ่มความสนใจ
              </span>
            </div>

            {/* Interest Image Cards */}
            {interestImages.map((src, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              >
                <img
                  src={src}
                  alt={`Interest ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
