"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "lib/apiServices/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4" style={{ backgroundImage: "url('/gym-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-black/65" />
      {/* Logo */}
      <div className="relative z-10 mb-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-2xl font-black uppercase tracking-widest text-white">NIKO SPORTWEAR</span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">High Performance Elite</span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[480px] rounded-2xl bg-black/60 px-10 py-12 backdrop-blur-md border border-white/10">
        {/* Heading */}
        <h1 className="mb-2 text-center text-3xl font-black uppercase tracking-tight text-white">
          Sign In
        </h1>
        <p className="mb-8 text-center text-sm text-neutral-400">
          Welcome back
        </p>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[#C9A84C]">
              Email
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
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-neutral-700 bg-neutral-800 px-4 py-3 pr-11 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#C9A84C]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="mb-4 text-xs text-red-400">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-[#C9A84C] py-4 text-xs font-black uppercase tracking-widest text-black transition-opacity hover:opacity-90"
          >
            Sign In
          </button>

          <p className="mt-6 text-center text-sm text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[#C9A84C] hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
