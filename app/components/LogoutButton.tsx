"use client";

import { useRouter } from "next/navigation";
import { logout } from "lib/apiServices/auth.service";

interface LogoutButtonProps {
  onLogout?: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();

    // Call custom onLogout if provided
    if (onLogout) {
      onLogout();
    }

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