"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "lib/apiServices/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      const res = await login({ email, password });

      if (res.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
      
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-1">
        <span className="text-2xl font-black uppercase tracking-widest text-white">⬡ NIKO</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">High Performance Elite</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-[480px] bg-neutral-900 px-10 py-12">
        {/* Heading */}
        <h1 className="mb-2 text-center text-3xl font-black uppercase tracking-tight text-white">
          เข้าสู่ระบบ
        </h1>
        <p className="mb-8 text-center text-sm text-neutral-400">
          ยินดีต้อนรับกลับมา
        </p>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[#C9A84C]">
              อีเมล
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#C9A84C]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[#C9A84C]">
              รหัสผ่าน
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#C9A84C]"
              required
            />
          </div>

          {error && (
            <p className="mb-4 text-xs text-red-400">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-[#C9A84C] py-4 text-xs font-black uppercase tracking-widest text-black transition-opacity hover:opacity-90"
          >
            เข้าสู่ระบบ
          </button>

          <p className="mt-6 text-center text-sm text-neutral-400">
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="font-semibold text-[#C9A84C] hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-10 flex gap-6 text-[10px] uppercase tracking-widest text-neutral-600">
        <a href="#" className="hover:text-neutral-400">นโยบายความเป็นส่วนตัว</a>
        <a href="#" className="hover:text-neutral-400">เงื่อนไขการใช้งาน</a>
        <a href="#" className="hover:text-neutral-400">ติดต่อเรา</a>
      </div>
    </div>
  );
}
