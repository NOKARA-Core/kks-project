"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  WalletCards,
  Store,
  ExternalLink,
  ShieldCheck,
  Database,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    name: "Ringkasan",
    href: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Buku Warga Rantau",
    href: "/warga",
    icon: Users,
    badge: "Warga",
  },
  {
    name: "Warta Suka & Duka",
    href: "/warta",
    icon: Megaphone,
    badge: "Lelayu",
  },
  {
    name: "Arus Kas Sosial",
    href: "/kas",
    icon: WalletCards,
    badge: "Kas",
  },
  {
    name: "Direktori Usaha",
    href: "/niaga",
    icon: Store,
    badge: "UMKM",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-slate-200/80 bg-white flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-sm select-none z-30">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark text-white flex items-center justify-center font-bold text-lg shadow-md shadow-gold/20">
              KKS
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight text-sm tracking-tight">
                KKS KAB. MIMIKA
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Kerukunan Keluarga Soppeng
              </p>
            </div>
          </div>

          <div className="mt-4 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-gold" />
              Sekretariat Timika
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              Papua Tengah
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Menu Administrasi
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group",
                  isActive
                    ? "bg-gold text-white shadow-md shadow-gold/25 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-700"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Database Status & Admin Profile */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {/* Link to public portal */}
        <a
          href="http://localhost:3009"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            Buka Portal Publik Warga
          </span>
          <span className="text-[10px] text-slate-400">Port 3009</span>
        </a>

        {/* Database Status Pill */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>PostgreSQL Database</span>
            </div>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Aktif
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono truncate">
            127.0.0.1:5432 / kks_platform_db
          </p>
          <p className="text-[10px] text-sky-dark font-medium">
            ✓ Siap dialihkan ke Supabase Cloud
          </p>
        </div>

        {/* Admin profile */}
        <div className="pt-1 flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">
              Admin Pengurus
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              admin@kks-mimika.id
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
