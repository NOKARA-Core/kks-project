"use client";

import { useState, useTransition } from "react";
import type { AdminUser } from "@repo/database";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import {
  updateSelfProfile,
  changeSelfPassword,
} from "@/app/actions/user-actions";

interface ProfileSettingsFormProps {
  user: AdminUser;
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  // Form State: Profile
  const [profileData, setProfileData] = useState({
    namaLengkap: user.namaLengkap,
    noWa: user.noWa || "",
    jabatan: user.jabatan || "Pengurus Paguyuban",
  });
  const [isProfilePending, startProfileTransition] = useTransition();
  const [profileFeedback, setProfileFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form State: Password
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Submit Profile
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileFeedback(null);

    startProfileTransition(async () => {
      const res = await updateSelfProfile(profileData);
      if (res.success) {
        setProfileFeedback({
          type: "success",
          message: res.message || "Profil berhasil diperbarui.",
        });
      } else {
        setProfileFeedback({
          type: "error",
          message: res.error || "Gagal memperbarui profil.",
        });
      }
    });
  };

  // Submit Password
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (passwordData.newPassword.length < 8) {
      setPasswordFeedback({
        type: "error",
        message: "Kata sandi baru minimal 8 karakter.",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordFeedback({
        type: "error",
        message: "Konfirmasi kata sandi baru tidak cocok.",
      });
      return;
    }

    startPasswordTransition(async () => {
      const res = await changeSelfPassword(passwordData);
      if (res.success) {
        setPasswordFeedback({
          type: "success",
          message: res.message || "Kata sandi berhasil diperbarui.",
        });
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordFeedback({
          type: "error",
          message: res.error || "Gagal mengubah kata sandi.",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* ===================================================================
          CARD 1: BIODATA AKUN PENGURUS
          =================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-700" />
              <span>Biodata Akun Pengurus</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Informasi personal akun yang digunakan saat bertugas di panel admin KKS Mimika.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Role: {user.role === "superadmin" ? "Superadmin (Akses Penuh)" : "Pengurus"}
            </span>
          </div>
        </div>

        {/* Feedback Alert Profile */}
        {profileFeedback && (
          <div
            className={`p-3.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
              profileFeedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {profileFeedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{profileFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Nama Lengkap</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={profileData.namaLengkap}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      namaLengkap: e.target.value,
                    }))
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                  placeholder="Masukkan nama lengkap"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Alamat Email (Read-only dengan info) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Alamat Email Masuk</span>
                <span className="text-[10px] text-slate-400">Terkunci (Hubungi Superadmin)</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Jabatan Organisasi */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Jabatan di Paguyuban</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={profileData.jabatan}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      jabatan: e.target.value,
                    }))
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                  placeholder="Contoh: Sekretaris, Bendahara, Koordinator Sektor"
                />
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Nomor WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Nomor WhatsApp Aktif</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={profileData.noWa}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      noWa: e.target.value,
                    }))
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                  placeholder="Contoh: 6281248011234"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isProfilePending}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isProfilePending ? "Menyimpan Perubahan..." : "Simpan Biodata"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ===================================================================
          CARD 2: KEAMANAN & KATA SANDI AKUN
          =================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-700" />
              <span>Keamanan & Kata Sandi</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Gunakan kata sandi kuat minimal 8 karakter yang memadukan huruf besar, angka, dan simbol.
            </p>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200/60">
            <KeyRound className="w-4 h-4 text-slate-600" />
          </div>
        </div>

        {/* Feedback Alert Password */}
        {passwordFeedback && (
          <div
            className={`p-3.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
              passwordFeedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {passwordFeedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{passwordFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Kata Sandi Saat Ini */}
          <div className="space-y-1.5 max-w-md">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span>Kata Sandi Saat Ini</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                placeholder="Masukkan kata sandi saat ini"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kata Sandi Baru */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Kata Sandi Baru</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                  placeholder="Minimal 8 karakter"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Konfirmasi Kata Sandi Baru */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Konfirmasi Kata Sandi Baru</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                  placeholder="Ulangi kata sandi baru"
                />
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isPasswordPending}
              className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isPasswordPending ? "Memperbarui Sandi..." : "Ubah Kata Sandi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
