"use client";

import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email submitted:", email);
    console.log("Password submitted:", password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-[460px] px-8 py-12">
        {/* Logos */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <Image src="/nike.svg" alt="Nike" width={40} height={16} />
          <Image src="/jordan.svg" alt="Jordan" width={28} height={28} />
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-center text-2xl font-bold leading-tight text-black">
          ป้อนอีเมลของคุณเพื่อมาร่วมกับเรา หรือ
          <br />
          ลงชื่อเข้าใช้
        </h1>


        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="email"
              placeholder="อีเมล*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-4 text-base text-black placeholder-gray-400 outline-none transition-colors focus:border-black"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="รหัสผ่าน*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-4 text-base text-black placeholder-gray-400 outline-none transition-colors focus:border-black"
              required
            />
          </div>

          {/* Terms */}
          <p className="mb-6 text-xs leading-5 text-gray-400">
            การดำเนินการต่อหมายความว่าคุณยอมรับ
            <a href="#" className="underline hover:text-gray-600">
              นโยบายความเป็นส่วนตัว
            </a>
            และ
            <a href="#" className="underline hover:text-gray-600">
              ข้อกำหนดการใช้ของ Nike
            </a>
          </p>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              ดำเนินการต่อ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
