"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Users,
  Wallet,
  AlertTriangle,
  Store,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Phone,
  Check,
  X,
  MapPin,
  Building,
} from "lucide-react";
import { formatRupiah, formatTanggal, formatWhatsAppUrl } from "@/lib/utils";
import { updateWargaStatus } from "@/app/actions/warga";
import type { WargaRantau, WartaPaguyuban, KasSosial } from "@repo/database";
import type { KasSummary } from "@/app/actions/kas";

type Props = {
  totalWarga: number;
  pendingWargaCount: number;
  kasSummary: KasSummary;
  wartaDukaList: WartaPaguyuban[];
  totalNiaga: number;
  recentPendingWarga: WargaRantau[];
  recentKas: KasSosial[];
};

export function RingkasanClient({
  totalWarga,
  pendingWargaCount,
  kasSummary,
  wartaDukaList,
  totalNiaga,
  recentPendingWarga: initialPending,
  recentKas,
}: Props) {
  const [pendingList, setPendingList] = useState<WargaRantau[]>(initialPending);
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<string | null>(null);

  const handleStatusChange = (
    id: string,
    nama: string,
    newStatus: "verified" | "rejected"
  ) => {
    startTransition(async () => {
      const res = await updateWargaStatus(id, newStatus);
      if (res.success) {
        setPendingList((prev) => prev.filter((item) => item.id !== id));
        setNotification(
          `Warga "${nama}" berhasil di-${
            newStatus === "verified" ? "verifikasi" : "tolak"
          }.`
        );
        setTimeout(() => setNotification(null), 4000);
      } else {
        alert(res.error || "Gagal mengubah status");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs text-emerald-600 hover:text-emerald-900 font-semibold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-7 relative overflow-hidden shadow-lg border border-slate-700/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gold/20 text-gold border border-gold/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
              Sistem Informasi Paguyuban Terpadu
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Selamat Bertugas di Ranah Pengabdian KKS Mimika
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Memelihara silaturahmi perantau asal Soppeng di Tanah Mimika dengan
              semangat <em>Salipuri Temmadinging</em> (saling menopang beban duka)
              dan <em>Dongiri Temmatipa</em> (saling mengayomi dalam kebajikan).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/warga"
              className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold text-sm transition shadow-md shadow-gold/30 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Verifikasi Warga
            </Link>
            <Link
              href="/kas"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition border border-white/20 flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              Catat Kas
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 -top-16 w-64 h-64 bg-sky/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Interactive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Warga */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-card transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Warga Rantau
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-gold flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {totalWarga}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              {pendingWargaCount > 0 ? (
                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3" />
                  {pendingWargaCount} menanti verifikasi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3" />
                  Semua terverifikasi
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 2: Kas Siaga Sosial */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-card transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Kas Siaga Sosial
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-light text-sky-dark flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatRupiah(kasSummary.saldoKas)}
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <TrendingUp className="w-3 h-3" />
                {formatRupiah(kasSummary.totalMasuk)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-rose-600 font-medium">
                <TrendingDown className="w-3 h-3" />
                {formatRupiah(kasSummary.totalKeluar)}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Warta Lelayu/Duka Aktif */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-card transition-all duration-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-siri" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Warta Lelayu (Duka)
            </span>
            <div className="w-10 h-10 rounded-xl bg-siri-light text-siri flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{wartaDukaList.length}</span>
              <span className="text-xs font-normal text-slate-500">
                peristiwa aktif
              </span>
            </div>
            <div className="mt-2 text-xs">
              {wartaDukaList.length > 0 ? (
                <span className="font-medium text-siri bg-siri-light/60 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                  Perlu perhatian santunan
                </span>
              ) : (
                <span className="font-medium text-slate-500">
                  Tidak ada berita lelayu baru
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 4: Usaha Warga Terdaftar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-card transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Direktori Usaha Warga
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {totalNiaga}
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <span>Etalase UMKM perantau di Timika</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Antrean Verifikasi & Kas Ringkas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Antrean Warga Masuk (One-Click Approve/Reject) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <span>Antrean Pendaftaran Warga Baru</span>
                {pendingList.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    {pendingList.length} Menunggu
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pendaftar terbaru yang membutuhkan verifikasi keabsahan warga paguyuban.
              </p>
            </div>
            <Link
              href="/warga"
              className="text-xs font-semibold text-gold hover:text-gold-dark flex items-center gap-1 group"
            >
              Lihat Semua Warga
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {pendingList.length === 0 ? (
            <div className="py-12 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                Semua Permohonan Telah Diproses
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Tidak ada data warga yang menanti persetujuan saat ini.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingList.map((warga) => (
                <div
                  key={warga.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-slate-900 text-sm truncate">
                        {warga.namaLengkap}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        Kec. {warga.kecamatanAsal}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {warga.domisiliTimika}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-600">
                        NIK: {warga.nik}
                      </span>
                      <span>•</span>
                      <span>{warga.jumlahKeluarga} Jiwa</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={formatWhatsAppUrl(
                        warga.noWa,
                        `Tabe' Bapak/Ibu ${warga.namaLengkap}, kami dari Pengurus Paguyuban KKS Kabupaten Mimika terkait pendataan warga...`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition"
                      title="Hubungi via WhatsApp"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <button
                      disabled={isPending}
                      onClick={() =>
                        handleStatusChange(warga.id, warga.namaLengkap, "verified")
                      }
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Setujui
                    </button>

                    <button
                      disabled={isPending}
                      onClick={() =>
                        handleStatusChange(warga.id, warga.namaLengkap, "rejected")
                      }
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition border border-rose-200 disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      Tolak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Warta Lelayu & Riwayat Kas Terkini */}
        <div className="space-y-6">
          {/* Card Warta Lelayu Prioritas */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-siri animate-pulse" />
                Warta Lelayu Terkini
              </h3>
              <Link
                href="/warta"
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-900"
              >
                Lihat Semua
              </Link>
            </div>

            {wartaDukaList.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">
                Alhamdulillah, tidak ada kabar lelayu baru di Timika.
              </p>
            ) : (
              <div className="space-y-3">
                {wartaDukaList.slice(0, 2).map((warta) => (
                  <div
                    key={warta.id}
                    className="p-3.5 rounded-xl bg-red-50/50 border-l-4 border-siri border-y border-r border-red-100 space-y-1.5"
                  >
                    <p className="font-semibold text-slate-900 text-xs leading-snug">
                      {warta.judul}
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {warta.ringkasan}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                      <span>{formatTanggal(warta.tanggalPeristiwa)}</span>
                      <span className="font-medium text-slate-700">
                        {warta.lokasiAcara}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card Mutasi Kas Terbaru */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-sky-dark" />
                Mutasi Kas Terakhir
              </h3>
              <Link
                href="/kas"
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-900"
              >
                Buka Buku Kas
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentKas.slice(0, 4).map((kas) => (
                <div
                  key={kas.id}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {kas.namaPenyetorPenerima || kas.keterangan || "Kas Umum"}
                    </p>
                    <p className="text-[11px] text-slate-400 capitalize">
                      {kas.peruntukan.replace("_", " ")} •{" "}
                      {formatTanggal(kas.tanggalTransaksi)}
                    </p>
                  </div>
                  <span
                    className={`font-semibold shrink-0 ${
                      kas.jenisTransaksi === "masuk"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {kas.jenisTransaksi === "masuk" ? "+" : "-"}
                    {formatRupiah(kas.nominal)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
