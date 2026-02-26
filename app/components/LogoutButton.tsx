"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh(); 
  };

  return (
    <button
      onClick={handleLogout}
      className="px-2 text-red-400 hover:text-red-500"
    >
      ออกจากระบบ
    </button>
  );
}