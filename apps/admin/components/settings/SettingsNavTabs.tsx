"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Users, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsNavTabsProps {
  isSuperadmin: boolean;
}

export function SettingsNavTabs({ isSuperadmin }: SettingsNavTabsProps) {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Profil Saya",
      href: "/settings/profile",
      icon: User,
      description: "Identitas personal & kata sandi akun",
    },
    ...(isSuperadmin
      ? [
          {
            name: "Manajemen Pengurus",
            href: "/settings/users",
            icon: Users,
            description: "Daftar pengurus, role & status aktif",
          },
        ]
      : []),
  ];

  return (
    <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150",
              isActive
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/70"
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4",
                isActive ? "text-white" : "text-slate-400"
              )}
            />
            <span>{tab.name}</span>
            {tab.href === "/settings/users" && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                  isActive
                    ? "bg-rose-500 text-white"
                    : "bg-rose-50 text-rose-700 border border-rose-200/60"
                )}
              >
                Superadmin
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
