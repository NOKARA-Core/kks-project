"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

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

interface SidebarNavContentProps {
  onItemClick?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function SidebarNavContent({
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarNavContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Brand Header */}
      <div>
        <div
          className={cn(
            "border-b border-slate-100 transition-all duration-200",
            isCollapsed ? "p-3 flex flex-col items-center gap-3" : "p-6"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between gap-3",
              isCollapsed && "flex-col justify-center"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo-kks.svg"
                  alt="Logo Kerukunan Keluarga Soppeng Kab. Mimika"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <h1 className="font-bold text-slate-900 leading-tight text-sm tracking-tight truncate">
                    KKS KAB. MIMIKA
                  </h1>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    Kerukunan Soppeng
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Collapse/Expand Toggle Icon */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                title={isCollapsed ? "Buka Sidebar (Lengkap)" : "Tutup Sidebar (Hanya Ikon)"}
                aria-label={isCollapsed ? "Buka sidebar" : "Tutup sidebar ke mode ringkas"}
                className={cn(
                  "hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200/60",
                  isCollapsed ? "mt-1 w-8 h-8 items-center justify-center" : ""
                )}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {!isCollapsed && (
            <div className="mt-4 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gold" />
                Sekretariat Timika
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                Papua Tengah
              </span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav
          className={cn(
            "space-y-1.5 transition-all duration-200",
            isCollapsed ? "p-2" : "p-4"
          )}
        >
          {!isCollapsed && (
            <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Menu Administrasi
            </p>
          )}

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
                onClick={onItemClick}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  "relative flex items-center rounded-xl font-medium text-sm transition-colors duration-150 group",
                  isCollapsed
                    ? "justify-center p-3 h-11 w-full"
                    : "justify-between px-3.5 py-2.5",
                  isActive
                    ? "text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {/* Active Sliding Indicator (layoutId="activeNav") */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gold rounded-xl shadow-md shadow-gold/25"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 flex items-center gap-3",
                    isCollapsed && "justify-center"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors shrink-0",
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-700"
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    className={cn(
                      "relative z-10 text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide transition-colors",
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
      <div
        className={cn(
          "border-t border-slate-100 space-y-3 transition-all duration-200",
          isCollapsed ? "p-2" : "p-4"
        )}
      >
        {/* Link to public portal */}
        {isCollapsed ? (
          <a
            href="http://localhost:3009"
            target="_blank"
            rel="noopener noreferrer"
            title="Buka Portal Publik Warga"
            className="flex items-center justify-center w-full h-9 rounded-lg text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        ) : (
          <a
            href="http://localhost:3009"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              Portal Publik Warga
            </span>
            <span className="text-[10px] text-slate-400 font-mono">3009</span>
          </a>
        )}

        {/* Database Status */}
        {isCollapsed ? (
          <div
            className="flex items-center justify-center w-full h-9 rounded-lg bg-emerald-50/60 border border-emerald-200/50"
            title="PostgreSQL Database Aktif"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        ) : (
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
          </div>
        )}

        {/* Admin profile */}
        <div
          className={cn(
            "pt-1 flex items-center gap-3",
            isCollapsed ? "justify-center px-0" : "px-1"
          )}
          title={isCollapsed ? "Admin Pengurus (admin@kks-mimika.id)" : undefined}
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                Admin Pengurus
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                admin@kks-mimika.id
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isOpen, closeSidebar, isCollapsed, toggleCollapse } = useSidebar();

  return (
    <>
      {/* 1. Desktop Static / Collapsible Sidebar (lg+) */}
      <aside
        className={cn(
          "hidden lg:flex border-r border-slate-200/80 bg-white flex-col shrink-0 h-screen sticky top-0 shadow-xs select-none z-30 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarNavContent
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </aside>

      {/* 2. Mobile Responsive Slide-Over Drawer (< lg) */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop with fade transition */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              aria-label="Tutup Menu"
            />

            {/* Slide-over Drawer with spring physics */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-50 border-r border-slate-200 overflow-y-auto"
            >
              {/* Close Button at top corner of drawer */}
              <button
                onClick={closeSidebar}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20"
                aria-label="Tutup navigasi"
              >
                <X className="w-5 h-5" />
              </button>

              <SidebarNavContent onItemClick={closeSidebar} isCollapsed={false} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}


