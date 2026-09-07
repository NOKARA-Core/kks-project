"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Clock,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSidebar } from "./SidebarContext";

const ROUTE_NAMES: Record<string, string> = {
  "/": "Ringkasan Eksekutif",
  "/warga": "Buku Warga Rantau",
  "/warta": "Warta Suka & Duka",
  "/kas": "Arus Kas Sosial",
  "/niaga": "Direktori Usaha Warga",
  "/studio": "Prompt Studio (Asisten Gambar AI)",
  "/settings": "Pengaturan Akun & Pengurus",
  "/settings/profile": "Profil Saya",
  "/settings/users": "Manajemen Pengurus",
};

export function Topbar() {
  const pathname = usePathname();
  const [timikaTime, setTimikaTime] = useState<string>("");

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      // Timika berada di WIT (Waktu Indonesia Timur, UTC+9)
      const formatted = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jayapura",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(now);
      setTimikaTime(`${formatted} WIT`);
    }

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentTitle = ROUTE_NAMES[pathname] || "Dashboard";

  const { isOpen, toggleSidebar, isCollapsed, toggleCollapse } = useSidebar();

  return (
    <header className="h-16 px-4 lg:px-8 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left side: Hamburger (Mobile) + Desktop Rail Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button (< lg) */}
        <button
          onClick={toggleSidebar}
          aria-label={isOpen ? "Tutup navigasi" : "Buka navigasi"}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden border border-slate-200/80 transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop Collapse/Expand Toggle Button (lg+) */}
        <button
          onClick={toggleCollapse}
          title={isCollapsed ? "Buka Sidebar Penuh" : "Kecilkan Sidebar (Hanya Ikon)"}
          aria-label={isCollapsed ? "Buka sidebar penuh" : "Kecilkan sidebar ke mode ringkas"}
          className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors"
        >
          {isCollapsed ? (
            <Menu className="w-4 h-4 text-slate-700" />
          ) : (
            <Menu className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Dynamic Breadcrumbs with Logo */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0"
            title="Dashboard KKS Mimika"
          >
            <div className="relative w-7 h-7 flex-shrink-0">
              <Image
                src="/logo-kks.svg"
                alt="Logo KKS Mimika"
                width={28}
                height={28}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <span className="text-slate-400 font-medium hidden sm:inline">KKS Mimika</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
            <span className="font-semibold text-slate-800 truncate max-w-[160px] sm:max-w-none">{currentTitle}</span>
          </div>
        </div>
      </div>

      {/* Right side info */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Falsafah Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50/80 border border-rose-200/60 text-[11px] font-medium text-rose-800">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>Salipuri Temmadinging • Dongiri Temmatipa</span>
        </div>

        {/* Timika Time indicator */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono bg-slate-50 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{timikaTime || "Memuat waktu Timika..."}</span>
        </div>
      </div>
    </header>
  );
}

