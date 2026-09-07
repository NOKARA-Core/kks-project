import Link from "next/link";
import {
  HeartHandshake,
  CreditCard,
  ArrowRight,
  MessageCircle,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  ReceiptText,
} from "lucide-react";
import type { KasSosial } from "@repo/database/schema";
import { siteConfig } from "@/lib/config";
import { formatRupiah, formatTanggal, formatWhatsAppUrl } from "@/lib/utils";

interface KasSosialSectionProps {
  totalSaldo: number;
  totalSantunanKeluar: number;
  jumlahPenerimaSantunan: number;
  recentTransactions?: KasSosial[];
}

export function KasSosialSection({
  totalSaldo,
  totalSantunanKeluar,
  jumlahPenerimaSantunan,
  recentTransactions = [],
}: KasSosialSectionProps) {
  const konfirmasiWaUrl = formatWhatsAppUrl(
    siteConfig.hotlineWa,
    `Halo Bendahara KKS Mimika, saya ingin konfirmasi penyaluran iuran/donasi kas sosial paguyuban melalui rekening ${siteConfig.bank.name}.`
  );

  return (
    <section className="py-10 sm:py-16 bg-canvas-soft border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Main Card Widget */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-8 space-y-6 sm:space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-100">
            <div className="max-w-2xl space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Salipuri Temmadinging &bull; Kas Siaga Duka</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Transparansi Kas Sosial & Santunan Warga
              </h2>
              <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
                Setiap rupiah iuran sukarela warga tercatat terbuka untuk santunan duka cita, pendampingan keluarga musibah, dan operasional layanan kemanusiaan di Timika.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/sosial"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-xs w-full sm:w-auto"
              >
                <span>Lihat Buku Kas Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Kartu Saldo Kas Siaga: Tampil Mandiri di Atas dengan Padding Lega */}
          <div className="p-4 sm:p-7 bg-slate-900 text-white rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Saldo Kas Siaga Terbuka</span>
                </div>
                <div className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  {formatRupiah(totalSaldo)}
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Saldo aktif darurat paguyuban yang dapat dipertanggungjawabkan
                </p>
              </div>

              {/* Sub-Metrics Santunan */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-800 md:pl-6">
                <div className="space-y-0.5">
                  <span className="text-[10px] sm:text-xs font-bold text-rose-400 uppercase tracking-wider">
                    Santunan Disalurkan
                  </span>
                  <div className="text-base sm:text-xl font-extrabold text-rose-300">
                    {formatRupiah(totalSantunanKeluar)}
                  </div>
                  <span className="text-[10px] text-slate-400">Total lelayu warga</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Penerima Santunan
                  </span>
                  <div className="text-base sm:text-xl font-extrabold text-white">
                    {jumlahPenerimaSantunan} Kasus
                  </div>
                  <span className="text-[10px] text-slate-400">Keluarga terbantu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daftar Transaksi Terkini (Anti-Dempet di Mobile) */}
          {recentTransactions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ReceiptText className="w-4 h-4 text-slate-500" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Arus Transaksi & Santunan Terkini
                  </h3>
                </div>
                <Link
                  href="/sosial"
                  className="text-xs font-semibold text-gold hover:underline"
                >
                  Riwayat Lengkap &rarr;
                </Link>
              </div>

              {/* 1. Mobile Format: Kartu Terpisah Vertikal Mini (Anti Dempet) */}
              <div className="block sm:hidden space-y-2">
                {recentTransactions.map((trx) => {
                  const isMasuk = trx.jenisTransaksi === "masuk";
                  const isDuka = trx.peruntukan === "santunan_duka";

                  const pillClass = isDuka
                    ? "bg-rose-50 text-rose-700 border-rose-200/70"
                    : isMasuk
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                    : "bg-amber-50 text-amber-800 border-amber-200/60";

                  const pillLabel = isDuka
                    ? "Santunan Duka"
                    : isMasuk
                    ? "Iuran Warga"
                    : "Kas Siaga";

                  return (
                    <div
                      key={trx.id}
                      className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-2xs"
                    >
                      {/* Baris 1: Tanggal & Pill Kategori */}
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-medium">
                          {formatTanggal(trx.tanggalTransaksi)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-bold border text-[9px] ${pillClass}`}>
                          {pillLabel}
                        </span>
                      </div>

                      {/* Baris 2: Keterangan Singkat & Penyetor/Penerima */}
                      <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {trx.keterangan || (isMasuk ? "Penerimaan Iuran Warga" : "Penyaluran Santunan")}
                        {trx.namaPenyetorPenerima && (
                          <span className="text-slate-500 font-normal">
                            {" "}
                            &bull; {trx.namaPenyetorPenerima}
                          </span>
                        )}
                      </div>

                      {/* Baris 3: Nominal yang Mencolok di Kanan Bawah */}
                      <div className="flex items-center justify-end pt-0.5 border-t border-slate-100/80">
                        <span
                          className={`text-xs sm:text-sm font-bold font-mono inline-flex items-center gap-0.5 ${
                            isMasuk ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isMasuk ? (
                            <>
                              <ArrowDownLeft className="w-3 h-3" />
                              <span>+ {formatRupiah(Number(trx.nominal))}</span>
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="w-3 h-3" />
                              <span>- {formatRupiah(Number(trx.nominal))}</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 2. Desktop Format: Clean Responsive Grid Cards */}
              <div className="hidden sm:grid sm:grid-cols-2 gap-3">
                {recentTransactions.map((trx) => {
                  const isMasuk = trx.jenisTransaksi === "masuk";
                  const isDuka = trx.peruntukan === "santunan_duka";

                  const pillClass = isDuka
                    ? "bg-rose-50 text-rose-700 border-rose-200/70"
                    : isMasuk
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                    : "bg-amber-50 text-amber-800 border-amber-200/60";

                  const pillLabel = isDuka
                    ? "Santunan Duka"
                    : isMasuk
                    ? "Iuran Warga"
                    : "Kas Siaga";

                  return (
                    <div
                      key={trx.id}
                      className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-200/80 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${pillClass}`}>
                            {pillLabel}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatTanggal(trx.tanggalTransaksi)}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {trx.keterangan || (isMasuk ? "Penerimaan Iuran Warga" : "Penyaluran Santunan")}
                          {trx.namaPenyetorPenerima && (
                            <span className="text-slate-500 font-normal">
                              {" "}
                              &bull; {trx.namaPenyetorPenerima}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`text-sm font-bold font-mono inline-flex items-center gap-0.5 ${
                            isMasuk ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isMasuk ? "+" : "-"} {formatRupiah(Number(trx.nominal))}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rekening Resmi & CTA Iuran */}
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                <CreditCard className="w-5 h-5 text-gold" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Rekening Resmi Kas Sosial KKS:
                </span>
                <div className="font-mono text-base sm:text-xl font-extrabold text-slate-900 tracking-wide">
                  {siteConfig.bank.accountNo}{" "}
                  <span className="text-xs font-sans font-bold text-slate-500">
                    ({siteConfig.bank.name})
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Atas Nama: <strong className="text-slate-800">{siteConfig.bank.accountHolder}</strong>
                </p>
              </div>
            </div>

            <a
              href={konfirmasiWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-xs w-full md:w-auto justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konfirmasi Bukti Transfer via WA</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
