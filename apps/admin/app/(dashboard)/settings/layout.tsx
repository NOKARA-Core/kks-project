import { getCurrentAdminUser } from "@/lib/auth";
import { SettingsNavTabs } from "@/components/settings/SettingsNavTabs";
import { Shield, Sparkles } from "lucide-react";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentAdminUser();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Pengaturan Akun & Akses Pengurus
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
              <Shield className="w-3 h-3 text-rose-600" />
              {currentUser.role === "superadmin" ? "Superadmin" : "Pengurus"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola identitas pribadi, kredensial masuk, dan hak akses pengurus paguyuban KKS Mimika.
          </p>
        </div>

        {/* Falsafah mini context */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>Amanah, Transparan, & Terpercaya</span>
        </div>
      </div>

      {/* Horizontal Nav Tabs */}
      <SettingsNavTabs isSuperadmin={currentUser.role === "superadmin"} />

      {/* Tab Page Content */}
      <div>{children}</div>
    </div>
  );
}
