import Navbar from "@/app/components/Navbar";
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

  const memberSince = new Date(user.createdAt).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Profile Sub Navigation */}
      <div className="flex justify-center gap-8 border-b border-neutral-800 py-4 text-sm text-neutral-500">
        <Link
          href="/profile"
          className="border-b-2 border-[#C9A84C] pb-3 -mb-4 font-semibold text-white"
        >
          โปรไฟล์
        </Link>
        <Link href="/history" className="pb-3 -mb-4 transition-colors hover:text-white">
          คำสั่งซื้อ
        </Link>
        <Link href="/favorites" className="pb-3 -mb-4 transition-colors hover:text-white">
          รายการโปรด
        </Link>
        <Link href="/setting" className="pb-3 -mb-4 transition-colors hover:text-white">
          การตั้งค่า
        </Link>
        <Link href="/finance" className="hover:text-black pb-3 -mb-4">
          การเงิน
        </Link>
      </div>

      {/* Profile Info */}
      <div className="mx-auto max-w-5xl px-10 py-10">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="h-12 w-12 text-neutral-500"
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
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              {user.firstname} {user.lastname}
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
              เป็นสมาชิกตั้งแต่ {memberSince}
            </p>
          </div>
        </div>

        {/* Interests Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-white">ความสนใจ</h2>
            <button className="text-xs uppercase tracking-wider text-neutral-500 transition-colors hover:text-[#C9A84C]">
              แก้ไข
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-4 border-b border-neutral-800">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`pb-3 text-xs uppercase tracking-wider ${
                  index === 0
                    ? "border-b-2 border-[#C9A84C] font-semibold text-white"
                    : "text-neutral-500 transition-colors hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Interest Description */}
          <p className="mt-4 text-xs text-neutral-500">
            เพิ่มความสนใจของคุณเพื่อสื่อสารและแลกเปลี่ยนสินค้าตามสิ่งที่คุณสนใจ
          </p>

          {/* Interest Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {/* Add Interest Card */}
            <div className="flex aspect-square cursor-pointer flex-col items-center justify-center border border-dashed border-neutral-700 transition-colors hover:border-[#C9A84C]">
              <div className="flex h-10 w-10 items-center justify-center border border-neutral-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5 text-neutral-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <span className="mt-3 text-xs uppercase tracking-wider text-neutral-400">
                เพิ่มความสนใจ
              </span>
            </div>

            {/* Interest Image Cards */}
            {interestImages.map((src, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden bg-neutral-900"
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
