"use client";

import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

const ROUTE_NAMES: Record<string, string> = {
  "/": "Ringkasan Eksekutif",
  "/warga": "Buku Warga Rantau",
  "/warta": "Warta Suka & Duka",
  "/kas": "Arus Kas Sosial",
  "/niaga": "Direktori Usaha Warga",
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

  return (
    <header className="h-16 px-8 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Dynamic Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400 font-medium">KKS Mimika</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="font-semibold text-slate-800">{currentTitle}</span>
      </div>

      {/* Right side info */}
      <div className="flex items-center gap-4">
        {/* Falsafah Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/80 border border-amber-200/60 text-[11px] font-medium text-amber-800">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>Salipuri Temmadinging • Dongiri Temmatipa</span>
        </div>

        {/* Timika Time indicator */}
        <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{timikaTime || "Memuat waktu Timika..."}</span>
        </div>
      </div>
    </header>
  );
}
