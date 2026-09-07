"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { loginAdminAction } from "../actions/auth-actions";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage("Silakan lengkapi email/WhatsApp dan kata sandi Anda.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginAdminAction({
        identifier: identifier.trim(),
        password,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Kredensial tidak cocok atau akun dinonaktifkan");
        setIsLoading(false);
        return;
      }

      // Login berhasil, arahkan ke dashboard
      router.push(res.redirectUrl || "/");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Terjadi gangguan koneksi. Silakan coba beberapa saat lagi.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Form Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          
          {/* Header Brand */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50/80 border border-rose-100 p-2 mx-auto shadow-2xs">
              <Image
                src="/logo-kks.svg"
                alt="Logo Resmi KKS Mimika"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Masuk Dasbor Pengurus
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Sistem Administrasi Warta &amp; Warga KKS Timika
              </p>
            </div>
          </div>

          {/* Error Banner Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/70 flex items-start gap-2.5 text-xs sm:text-sm text-rose-800"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field Identifier */}
            <div className="space-y-1.5">
              <label
                htmlFor="identifier"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Email / No. WhatsApp Pengurus
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  disabled={isLoading}
                  placeholder="Email pengurus atau nomor WhatsApp..."
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 text-sm sm:text-base rounded-xl border border-slate-300 bg-white placeholder:text-slate-400 focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all disabled:bg-slate-100 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Field Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-10 pr-12 text-sm sm:text-base rounded-xl border border-slate-300 bg-white placeholder:text-slate-400 focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all disabled:bg-slate-100 disabled:opacity-70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm sm:text-base shadow-xs hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <span>Masuk ke Dasbor</span>
                )}
              </button>
            </div>
          </form>

          {/* Card Footer Info */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-1">
            <p className="text-[11px] text-slate-500">
              Lupa kata sandi atau kendala akses akun?
            </p>
            <p className="text-[11px] text-slate-500">
              Hubungi Sekretariat Pusat KKS Mimika di{" "}
              <span className="font-semibold text-slate-700">+62 812-4801-1234</span>
            </p>
          </div>

        </div>

        {/* Outer Brand Watermark */}
        <div className="text-center mt-6 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Kerukunan Keluarga Soppeng Kab. Mimika</p>
          <p className="text-[10px] mt-0.5">Yassisoppengi di Tanah Amungsa</p>
        </div>
      </div>
    </div>
  );
}
