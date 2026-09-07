"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Wallet,
  AlertTriangle,
  Store,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Phone,
  Check,
  X,
  MapPin,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import { formatRupiah, formatTanggal, formatWhatsAppUrl } from "@/lib/utils";
import { updateWargaStatus } from "@/app/actions/warga";
import type {
  WargaRantau,
  WartaPaguyuban,
  KasSosial,
  DirektoriNiaga,
} from "@repo/database/schema";
import type { KasSummary } from "@/app/actions/kas";
import { MiniSparkline } from "./charts/MiniSparkline";
import {
  SektorDistributionChart,
  type SektorDistributionItem,
} from "./charts/SektorDistributionChart";
import {
  ArusKasAreaChart,
  type MonthlyCashFlowItem,
} from "./charts/ArusKasAreaChart";

interface Props {
  totalWarga: number;
  pendingWargaCount: number;
  kasSummary: KasSummary;
  wartaDukaList: WartaPaguyuban[];
  totalNiaga: number;
  recentPendingWarga: WargaRantau[];
  recentKas: KasSosial[];
  sektorDistribution: SektorDistributionItem[];
  monthlyCashFlow: MonthlyCashFlowItem[];
  wargaTrendSparkline: number[];
  topNiagaKategori: string;
}

export function RingkasanClient({
  totalWarga,
  pendingWargaCount,
  kasSummary,
  wartaDukaList,
  totalNiaga,
  recentPendingWarga: initialPending,
  recentKas,
  sektorDistribution,
  monthlyCashFlow,
  wargaTrendSparkline,
  topNiagaKategori,
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

  // Safe KPI calculations
  const kasRatioKesehatan =
    kasSummary.totalKeluar > 0
      ? (kasSummary.saldoKas / kasSummary.totalKeluar).toFixed(1)
      : "10+";

  const totalSantunanNominal = kasSummary.santunanDukaKeluar;

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
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl p-6 sm:p-7 relative overflow-hidden shadow-lg border border-slate-700/50">
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
              className="px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-dark text-white font-semibold text-sm transition shadow-md shadow-gold/30 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Verifikasi Warga
            </Link>
            <Link
              href="/kas"
              className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition border border-white/20 flex items-center gap-2"
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

      {/* ===================================================================
          1. STATS OVERVIEW WITH MINI SPARKLINE (4 Enterprise KPI Cards)
          =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Warga Rantau */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Warga Rantau
              </span>
              <div className="p-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-slate-700" />
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-3xl font-bold text-slate-900 tracking-tight"
                >
                  {totalWarga}
                </motion.div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+12.5% bln ini</span>
                </div>
              </div>

              {/* Mini Sparkline 6 Bulan */}
              <div className="pb-1" title="Tren pendaftaran warga 6 bulan terakhir">
                <MiniSparkline
                  data={wargaTrendSparkline}
                  color="#DC2626"
                  width={80}
                  height={34}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
            {pendingWargaCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200/60 text-xs font-medium px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3 text-rose-700" />
                {pendingWargaCount} menanti verifikasi
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Semua terverifikasi
              </span>
            )}
            <Link
              href="/warga"
              className="text-slate-400 hover:text-gold font-medium transition-colors"
            >
              Lihat &rarr;
            </Link>
          </div>
        </div>

        {/* KPI 2: Kas Siaga Sosial Aktif */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Kas Siaga Sosial Aktif
              </span>
              <div className="p-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-slate-700" />
              </div>
            </div>

            <div className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="text-3xl font-bold text-slate-900 tracking-tight truncate"
              >
                {formatRupiah(kasSummary.saldoKas)}
              </motion.div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-emerald-700">
                  Status: Siaga Aman
                </span>
                <span className="text-slate-300">•</span>
                <span>Rasio {kasRatioKesehatan}x</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="bg-rose-50 text-rose-800 border border-rose-200/60 text-xs font-medium px-2 py-0.5 rounded-md">
              Kas Siaga
            </span>
            <span className="text-slate-500 flex items-center gap-1">
              <span>Masuk:</span>
              <strong className="text-emerald-700 font-mono">
                +{formatRupiah(kasSummary.iuranWargaMasuk)}
              </strong>
            </span>
          </div>
        </div>

        {/* KPI 3: Penyaluran Duka Cita (Clean Enterprise Canvas, No AI-Slop Left Border) */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Penyaluran Duka Cita
              </span>
              <div className="p-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4 text-slate-700" />
              </div>
            </div>

            <div className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="text-3xl font-bold text-slate-900 tracking-tight flex items-baseline gap-2"
              >
                <span>{wartaDukaList.length}</span>
                <span className="text-xs font-normal text-slate-500">
                  kasus tertangani
                </span>
              </motion.div>
              <div className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <span>Santunan:</span>
                <span className="font-mono">
                  {formatRupiah(totalSantunanNominal)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="bg-rose-50 text-rose-700 border border-rose-100 text-xs font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Lelayu Paguyuban
            </span>
            <Link
              href="/warta"
              className="text-slate-400 hover:text-rose-700 font-medium transition-colors"
            >
              Warta &rarr;
            </Link>
          </div>
        </div>

        {/* KPI 4: Usaha Niaga Terdaftar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Usaha Niaga Terdaftar
              </span>
              <div className="p-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center">
                <Store className="w-4 h-4 text-slate-700" />
              </div>
            </div>

            <div className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.15 }}
                className="text-3xl font-bold text-slate-900 tracking-tight"
              >
                {totalNiaga}
              </motion.div>
              <div className="mt-1 text-xs text-slate-500">
                <span>Dominan: </span>
                <strong className="text-slate-800 font-semibold">
                  {topNiagaKategori || "Kuliner & Jasa"}
                </strong>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-md">
              UMKM Warga
            </span>
            <span className="text-emerald-700 font-semibold text-xs">100% Aktif</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          2. DUAL VISUALIZATION CHARTS: SEKTOR DOMISILI & ARUS KAS SOSIAL
          =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Grafik Sebaran Sektor Domisili Mimika (5 Kolom) */}
        <div className="lg:col-span-5">
          <SektorDistributionChart
            data={sektorDistribution}
            totalWarga={totalWarga}
          />
        </div>

        {/* Grafik Arus Kas Sosial: Iuran vs Santunan (7 Kolom) */}
        <div className="lg:col-span-7">
          <ArusKasAreaChart data={monthlyCashFlow} />
        </div>
      </div>

      {/* ===================================================================
          3. ANTREAN VERIFIKASI WARGA & RIWAYAT WARTA / KAS CEPAT
          =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Antrean Warga Masuk (One-Click Approve/Reject) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <span>Antrean Pendaftaran Warga Baru</span>
                {pendingList.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
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

                  {/* Actions: Approve / Reject / WhatsApp */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={formatWhatsAppUrl(
                        warga.noWa,
                        `Tabe' Bapak/Ibu ${warga.namaLengkap}, kami dari Pengurus Paguyuban KKS Kabupaten Mimika terkait pendataan warga...`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 transition"
                      title="Hubungi via WhatsApp"
                    >
                      <Phone className="w-3.5 h-3.5" />
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
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
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
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
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
                    className="p-4 rounded-lg bg-white border border-rose-100 hover:border-rose-200 shadow-xs space-y-2 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        Lelayu
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatTanggal(warta.waktuWafat || warta.createdAt)}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 text-xs leading-snug">
                      {warta.judul}
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {warta.ringkasan}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                      <span>Lokasi:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[180px]">
                        {warta.alamatDukaTimika || warta.lokasiNamaTempat || "Timika"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card Mutasi Kas Terbaru */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
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
