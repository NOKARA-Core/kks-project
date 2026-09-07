"use client";

import { useState, useTransition, useMemo } from "react";
import {
  WalletCards,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  FileSpreadsheet,
  Calendar,
  Trash2,
  X,
  CheckCircle2,
  Filter,
  Receipt,
  User,
} from "lucide-react";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import {
  createTransaksiKas,
  deleteTransaksiKas,
  type KasSummary,
} from "@/app/actions/kas";
import type { KasSosial, NewKasSosial } from "@repo/database/schema";

type Props = {
  initialKas: KasSosial[];
  initialSummary: KasSummary;
};

export function KasManager({ initialKas, initialSummary }: Props) {
  const [kasList, setKasList] = useState<KasSosial[]>(initialKas);
  const [summary, setSummary] = useState<KasSummary>(initialSummary);
  const [filterJenis, setFilterJenis] = useState<string>("all");
  const [filterPeruntukan, setFilterPeruntukan] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Filtered transactions
  const filteredKas = useMemo(() => {
    return kasList.filter((item) => {
      const matchJenis = filterJenis === "all" || item.jenisTransaksi === filterJenis;
      const matchPeruntukan =
        filterPeruntukan === "all" || item.peruntukan === filterPeruntukan;
      return matchJenis && matchPeruntukan;
    });
  }, [kasList, filterJenis, filterPeruntukan]);

  // Recalculate summary helper
  const updateLocalSummary = (newList: KasSosial[]) => {
    let totalMasuk = 0;
    let totalKeluar = 0;
    let santunanDukaKeluar = 0;
    let iuranWargaMasuk = 0;

    for (const item of newList) {
      const nom = parseFloat(item.nominal) || 0;
      if (item.jenisTransaksi === "masuk") {
        totalMasuk += nom;
        if (item.peruntukan === "iuran_warga") iuranWargaMasuk += nom;
      } else {
        totalKeluar += nom;
        if (item.peruntukan === "santunan_duka") santunanDukaKeluar += nom;
      }
    }

    setSummary({
      totalMasuk,
      totalKeluar,
      saldoKas: totalMasuk - totalKeluar,
      santunanDukaKeluar,
      iuranWargaMasuk,
    });
  };

  const handleDelete = (id: string, ket: string | null) => {
    if (!confirm(`Hapus pencatatan kas "${ket || "transaksi ini"}"?`)) return;
    startTransition(async () => {
      const res = await deleteTransaksiKas(id);
      if (res.success) {
        const updated = kasList.filter((k) => k.id !== id);
        setKasList(updated);
        updateLocalSummary(updated);
      } else {
        alert(res.error || "Gagal menghapus transaksi kas");
      }
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Tanggal",
      "Jenis",
      "Peruntukan",
      "Nominal (Rp)",
      "Penyetor / Penerima",
      "Keterangan",
    ];

    const rows = filteredKas.map((k) => [
      formatTanggal(k.tanggalTransaksi),
      k.jenisTransaksi.toUpperCase(),
      k.peruntukan.replace("_", " "),
      k.nominal,
      `"${(k.namaPenyetorPenerima || "").replace(/"/g, '""')}"`,
      `"${(k.keterangan || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Laporan_Kas_Sosial_KKS_Mimika_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Arus Kas Sosial & Santunan Duka
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pembukuan kas sosial terbuka paguyuban KKS Kabupaten Mimika berasaskan
            amanah dan transparansi musyawarah.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-400" />
            Ekspor CSV Laporan
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold text-xs transition shadow-md shadow-gold/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Catat Transaksi Kas
          </button>
        </div>
      </div>

      {/* 3 Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card Saldo Kas */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Saldo Kas Siaga Sosial
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-gold flex items-center justify-center">
              <WalletCards className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {formatRupiah(summary.saldoKas)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dana likuid siap pakai tanggap darurat & lelayu
            </p>
          </div>
        </div>

        {/* Card Pemasukan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Dana Masuk
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-emerald-600 tracking-tight">
              +{formatRupiah(summary.totalMasuk)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Termasuk iuran warga: {formatRupiah(summary.iuranWargaMasuk)}
            </p>
          </div>
        </div>

        {/* Card Pengeluaran */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Pengeluaran Kas
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-rose-600 tracking-tight">
              -{formatRupiah(summary.totalKeluar)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Santunan lelayu: {formatRupiah(summary.santunanDukaKeluar)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Filter Mutasi:
            </span>

            {/* Filter Jenis */}
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-gold text-slate-700"
            >
              <option value="all">Semua Jenis Transaksi</option>
              <option value="masuk">Pemasukan (Masuk)</option>
              <option value="keluar">Pengeluaran (Keluar)</option>
            </select>

            {/* Filter Peruntukan */}
            <select
              value={filterPeruntukan}
              onChange={(e) => setFilterPeruntukan(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-gold text-slate-700"
            >
              <option value="all">Semua Peruntukan</option>
              <option value="santunan_duka">Santunan Duka Lelayu</option>
              <option value="iuran_warga">Iuran Warga</option>
              <option value="kegiatan_silaturahmi">Kegiatan Silaturahmi</option>
              <option value="kas_siaga">Kas Siaga / Umum</option>
            </select>
          </div>

          <div className="text-xs text-slate-500">
            Ditemukan <strong>{filteredKas.length}</strong> transaksi
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tanggal & Ref
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Peruntukan
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Penyetor / Penerima
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Keterangan
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">
                  Nominal (Rp)
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKas.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm text-slate-500"
                  >
                    Tidak ada catatan transaksi kas yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredKas.map((k) => (
                  <tr
                    key={k.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs">
                      <span className="font-semibold text-slate-900 block">
                        {formatTanggal(k.tanggalTransaksi)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {k.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg font-semibold text-[11px] ${
                          k.peruntukan === "santunan_duka"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : k.peruntukan === "iuran_warga"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {k.peruntukan.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-800">
                      {k.namaPenyetorPenerima || "-"}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">
                      {k.keterangan || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right">
                      <span
                        className={
                          k.jenisTransaksi === "masuk"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }
                      >
                        {k.jenisTransaksi === "masuk" ? "+" : "-"}
                        {formatRupiah(k.nominal)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-center">
                      <button
                        disabled={isPending}
                        onClick={() => handleDelete(k.id, k.keterangan)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition"
                        title="Hapus Catatan Kas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Catat Transaksi Kas */}
      {isCreateModalOpen && (
        <ModalCatatKas
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={(newKas) => {
            const updated = [newKas, ...kasList];
            setKasList(updated);
            updateLocalSummary(updated);
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// Subcomponent: Form Catat Transaksi Kas
function ModalCatatKas({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (kas: KasSosial) => void;
}) {
  const [jenisTransaksi, setJenisTransaksi] = useState<"masuk" | "keluar">("masuk");
  const [peruntukan, setPeruntukan] = useState<
    "santunan_duka" | "iuran_warga" | "kegiatan_silaturahmi" | "kas_siaga"
  >("iuran_warga");
  const [nominal, setNominal] = useState("");
  const [namaPenyetorPenerima, setNamaPenyetorPenerima] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tanggalTransaksi, setTanggalTransaksi] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNominal = nominal.replace(/[^0-9]/g, "");
    if (!cleanNominal || parseFloat(cleanNominal) <= 0) {
      setError("Nominal harus lebih dari 0.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: NewKasSosial = {
      jenisTransaksi,
      peruntukan,
      nominal: cleanNominal,
      namaPenyetorPenerima,
      keterangan,
      tanggalTransaksi,
    };

    const res = await createTransaksiKas(payload);
    setLoading(false);

    if (res.success && res.data) {
      onSuccess(res.data);
    } else {
      setError(res.error || "Gagal mencatat transaksi.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-elevated border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              Catat Mutasi Kas Sosial
            </h3>
            <p className="text-xs text-slate-500">
              Kerukunan Keluarga Soppeng Kab. Mimika
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Jenis Transaksi */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Jenis Transaksi *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setJenisTransaksi("masuk");
                  setPeruntukan("iuran_warga");
                }}
                className={`py-2 px-3 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition ${
                  jenisTransaksi === "masuk"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Kas Masuk (+)
              </button>
              <button
                type="button"
                onClick={() => {
                  setJenisTransaksi("keluar");
                  setPeruntukan("santunan_duka");
                }}
                className={`py-2 px-3 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition ${
                  jenisTransaksi === "keluar"
                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                Kas Keluar (-)
              </button>
            </div>
          </div>

          {/* Peruntukan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Peruntukan Transaksi *
            </label>
            <select
              value={peruntukan}
              onChange={(e) => setPeruntukan(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
            >
              {jenisTransaksi === "masuk" ? (
                <>
                  <option value="iuran_warga">Iuran Rutin Warga</option>
                  <option value="kas_siaga">Donasi / Saldo Kas Siaga</option>
                  <option value="kegiatan_silaturahmi">
                    Sumbangan Khusus Kegiatan
                  </option>
                </>
              ) : (
                <>
                  <option value="santunan_duka">Santunan Duka Lelayu</option>
                  <option value="kegiatan_silaturahmi">
                    Biaya Kegiatan Silaturahmi
                  </option>
                  <option value="kas_siaga">Operasional Kas Siaga</option>
                </>
              )}
            </select>
          </div>

          {/* Nominal */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nominal (Rupiah) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                Rp
              </span>
              <input
                required
                type="number"
                min={1000}
                step={1000}
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                placeholder="Misal: 5000000"
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden font-mono font-bold text-sm text-slate-900"
              />
            </div>
          </div>

          {/* Penyetor / Penerima */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {jenisTransaksi === "masuk" ? "Nama Penyetor / Donatur" : "Nama Penerima Santunan / Petugas"}
            </label>
            <input
              type="text"
              value={namaPenyetorPenerima}
              onChange={(e) => setNamaPenyetorPenerima(e.target.value)}
              placeholder="Contoh: Keluarga Duka Almarhum Ambo Dalle"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
            />
          </div>

          {/* Tanggal Transaksi */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tanggal Transaksi
            </label>
            <input
              type="date"
              value={tanggalTransaksi}
              onChange={(e) => setTanggalTransaksi(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
            />
          </div>

          {/* Keterangan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Keterangan Rinci
            </label>
            <textarea
              rows={2}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Penjelasan bukti atau peruntukan kas..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold shadow-md shadow-gold/20 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Catatan Kas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
