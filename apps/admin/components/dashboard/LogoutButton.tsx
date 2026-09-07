"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutAdminAction } from "@/app/actions/auth-actions";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    if (confirm("Apakah Anda yakin ingin keluar dari dasbor admin?")) {
      setIsLoading(true);
      try {
        const res = await logoutAdminAction();
        router.push(res.redirectUrl || "/login");
        router.refresh();
      } catch (err) {
        console.error("Logout error:", err);
        setIsLoading(false);
      }
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      title="Keluar Sesi Admin"
      aria-label="Keluar sesi admin"
      className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-2xs"
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
      ) : (
        <LogOut className="w-3.5 h-3.5 text-slate-400" />
      )}
      <span className="hidden sm:inline">Keluar</span>
    </button>
  );
}
