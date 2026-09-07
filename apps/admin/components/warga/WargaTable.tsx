"use client";

import { useState, useTransition, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Search,
  Filter,
  Phone,
  Check,
  X,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Clock,
  Ban,
  UserPlus,
  MapPin,
  Building,
} from "lucide-react";
import { formatTanggal, formatWhatsAppUrl } from "@/lib/utils";
import { updateWargaStatus, createWarga, deleteWarga } from "@/app/actions/warga";
import {
  KECAMATAN_SOPPENG,
  SEKTOR_TIMIKA,
  type WargaRantau,
  type NewWargaRantau,
} from "@repo/database/schema";

type Props = {
  initialWarga: WargaRantau[];
};

export function WargaTable({ initialWarga }: Props) {
  const [data, setData] = useState<WargaRantau[]>(initialWarga);
  const [search, setSearch] = useState("");
  const [kecamatanFilter, setKecamatanFilter] = useState("all");
  const [domisiliFilter, setDomisiliFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedWarga, setSelectedWarga] = useState<WargaRantau | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [adminNoteModal, setAdminNoteModal] = useState<{
    warga: WargaRantau;
    targetStatus: "verified" | "rejected";
  } | null>(null);
  const [noteText, setNoteText] = useState("");

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        item.namaLengkap.toLowerCase().includes(q) ||
        item.nik.toLowerCase().includes(q) ||
        item.noWa.toLowerCase().includes(q) ||
        item.domisiliTimika.toLowerCase().includes(q);

      // Kecamatan asal
      const matchKecamatan =
        kecamatanFilter === "all" || item.kecamatanAsal === kecamatanFilter;

      // Domisili
      const matchDomisili =
        domisiliFilter === "all" ||
        item.domisiliTimika.toLowerCase().includes(domisiliFilter.toLowerCase());

      // Status
      const matchStatus =
        statusFilter === "all" || item.statusVerifikasi === statusFilter;

      return matchSearch && matchKecamatan && matchDomisili && matchStatus;
    });
  }, [data, search, kecamatanFilter, domisiliFilter, statusFilter]);

  // Handle status update
  const handleUpdateStatus = (
    id: string,
    status: "verified" | "rejected",
    catatan?: string
  ) => {
    startTransition(async () => {
      const res = await updateWargaStatus(id, status, catatan);
      if (res.success) {
        setData((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  statusVerifikasi: status,
                  ...(catatan !== undefined ? { catatanAdmin: catatan } : {}),
                }
              : item
          )
        );
        setAdminNoteModal(null);
        setNoteText("");
      } else {
        alert(res.error || "Gagal mengubah status warga");
      }
    });
  };

  // TanStack columns definition
  const columns = useMemo<ColumnDef<WargaRantau>[]>(
    () => [
      {
        accessorKey: "namaLengkap",
        header: "Nama Lengkap & NIK",
        cell: ({ row }) => {
          const w = row.original;
          return (
            <div className="py-1">
              <div className="font-semibold text-slate-900 text-sm">
                {w.namaLengkap}
              </div>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                <span>NIK: {w.nik}</span>
                {w.noKk && <span>• KK: {w.noKk}</span>}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "kecamatanAsal",
        header: "Asal di Soppeng",
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/60">
            Kec. {row.original.kecamatanAsal}
          </span>
        ),
      },
      {
        accessorKey: "domisiliTimika",
        header: "Domisili di Timika",
        cell: ({ row }) => (
          <div className="text-xs text-slate-700 max-w-[220px]">
            <div className="font-medium truncate flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{row.original.domisiliTimika}</span>
            </div>
            <div className="text-slate-400 mt-0.5">
              {row.original.jumlahKeluarga} Anggota Keluarga
            </div>
          </div>
        ),
      },
      {
        accessorKey: "statusVerifikasi",
        header: "Status Verifikasi",
        cell: ({ row }) => {
          const status = row.original.statusVerifikasi;
          if (status === "verified") {
            return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <UserCheck className="w-3.5 h-3.5" />
                Terverifikasi
              </span>
            );
          }
          if (status === "rejected") {
            return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <Ban className="w-3.5 h-3.5" />
                Ditolak
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              Menunggu
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Tgl Daftar",
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">
            {formatTanggal(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const w = row.original;
          return (
            <div className="flex items-center gap-1.5">
              {/* WA Button */}
              <a
                href={formatWhatsAppUrl(
                  w.noWa,
                  `Tabe' Bapak/Ibu ${w.namaLengkap}, kami dari Pengurus KKS Kab. Mimika perihal pendaftaran warga paguyuban...`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition"
                title="Hubungi via WhatsApp Web"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>

              {/* View Detail Modal */}
              <button
                onClick={() => setSelectedWarga(w)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                title="Lihat Rincian Data"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              {/* Quick Approve / Reject if pending */}
              {w.statusVerifikasi !== "verified" && (
                <button
                  disabled={isPending}
                  onClick={() =>
                    setAdminNoteModal({ warga: w, targetStatus: "verified" })
                  }
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
                  title="Setujui Data Warga"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}

              {w.statusVerifikasi !== "rejected" && (
                <button
                  disabled={isPending}
                  onClick={() =>
                    setAdminNoteModal({ warga: w, targetStatus: "rejected" })
                  }
                  className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                  title="Tolak Pendaftaran"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [isPending]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header & New Warga Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Buku Induk Warga Rantau
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Data terpadu kependudukan kerukunan perantau asal Soppeng di Kabupaten
            Mimika.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold text-sm transition shadow-md shadow-gold/25 flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Warga Baru
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Instant Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama, NIK, No WA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition"
            />
          </div>

          {/* Filter 7 Kecamatan Asal Soppeng */}
          <div>
            <select
              value={kecamatanFilter}
              onChange={(e) => setKecamatanFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition text-slate-700"
            >
              <option value="all">Semua Kecamatan Asal</option>
              {KECAMATAN_SOPPENG.map((kec) => (
                <option key={kec} value={kec}>
                  Kec. {kec}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Wilayah Domisili Timika */}
          <div>
            <select
              value={domisiliFilter}
              onChange={(e) => setDomisiliFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition text-slate-700"
            >
              <option value="all">Semua Domisili di Timika</option>
              {SEKTOR_TIMIKA.map((sek) => (
                <option key={sek} value={sek}>
                  {sek}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status Verifikasi */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition text-slate-700"
            >
              <option value="all">Semua Status Verifikasi</option>
              <option value="verified">Terverifikasi</option>
              <option value="pending">Menunggu Verifikasi</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Tags */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Menampilkan{" "}
            <span className="font-semibold text-slate-800">
              {filteredData.length}
            </span>{" "}
            dari total {data.length} warga terdaftar.
          </div>
          {(search ||
            kecamatanFilter !== "all" ||
            domisiliFilter !== "all" ||
            statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setKecamatanFilter("all");
                setDomisiliFilter("all");
                setStatusFilter("all");
              }}
              className="text-gold hover:underline font-semibold"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* TanStack Interactive Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-slate-50/80 border-b border-slate-200/80"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-12 text-center text-sm text-slate-500"
                  >
                    Tidak ada data warga yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
          <div className="text-xs text-slate-500">
            Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
            {Math.max(1, table.getPageCount())}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Sebelumnya
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Selanjutnya
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Detail Warga */}
      {selectedWarga && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-elevated border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Rincian Data Warga Paguyuban
                </h3>
                <p className="text-xs text-slate-500">
                  Kerukunan Keluarga Soppeng Kab. Mimika
                </p>
              </div>
              <button
                onClick={() => setSelectedWarga(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-xs text-slate-400 block">Nama Lengkap</span>
                  <span className="font-semibold text-slate-900">
                    {selectedWarga.namaLengkap}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-xs text-slate-400 block">Kecamatan Asal</span>
                  <span className="font-semibold text-slate-900">
                    Kec. {selectedWarga.kecamatanAsal}, Soppeng
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-xs text-slate-400 block">Nomor Induk (NIK)</span>
                  <span className="font-mono text-slate-900">
                    {selectedWarga.nik}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-xs text-slate-400 block">Nomor Kartu Keluarga</span>
                  <span className="font-mono text-slate-900">
                    {selectedWarga.noKk || "-"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                <span className="text-xs text-slate-400 block">
                  Alamat / Domisili di Timika
                </span>
                <span className="font-medium text-slate-800">
                  {selectedWarga.domisiliTimika}
                </span>
                <div className="text-xs text-slate-500">
                  Tanggungan Keluarga: {selectedWarga.jumlahKeluarga} Jiwa
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Nomor WhatsApp</span>
                  <span className="font-mono font-medium text-slate-900">
                    {selectedWarga.noWa}
                  </span>
                </div>
                <a
                  href={formatWhatsAppUrl(selectedWarga.noWa)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Chat WA
                </a>
              </div>

              {selectedWarga.catatanAdmin && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">Catatan Verifikator:</span>
                  {selectedWarga.catatanAdmin}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedWarga(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Ubah Status dengan Catatan */}
      {adminNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-elevated border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-slate-900 text-base">
              Konfirmasi {adminNoteModal.targetStatus === "verified" ? "Persetujuan" : "Penolakan"}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anda akan mengubah status data warga{" "}
              <strong>{adminNoteModal.warga.namaLengkap}</strong> menjadi{" "}
              <span
                className={`font-semibold ${
                  adminNoteModal.targetStatus === "verified"
                    ? "text-emerald-700"
                    : "text-rose-700"
                }`}
              >
                {adminNoteModal.targetStatus === "verified"
                  ? "Terverifikasi"
                  : "Ditolak"}
              </span>
              .
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Pengurus / Alasan (Opsional):
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Misal: Sudah dikonfirmasi oleh ketua sektor Timika Kota..."
                rows={3}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAdminNoteModal(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                disabled={isPending}
                onClick={() =>
                  handleUpdateStatus(
                    adminNoteModal.warga.id,
                    adminNoteModal.targetStatus,
                    noteText
                  )
                }
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition shadow-xs ${
                  adminNoteModal.targetStatus === "verified"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {isPending ? "Memproses..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Warga Baru */}
      {isAddModalOpen && (
        <ModalTambahWarga
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={(newWarga) => {
            setData((prev) => [newWarga, ...prev]);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// Subcomponent: Form Tambah Warga
function ModalTambahWarga({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (warga: WargaRantau) => void;
}) {
  const [formData, setFormData] = useState<Partial<NewWargaRantau>>({
    namaLengkap: "",
    nik: "",
    noKk: "",
    noWa: "",
    kecamatanAsal: "Lalabata",
    domisiliTimika: "",
    jumlahKeluarga: 1,
    statusVerifikasi: "verified",
    catatanAdmin: "Pendaftaran manual oleh pengurus paguyuban",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap || !formData.nik || !formData.noWa || !formData.domisiliTimika) {
      setError("Mohon lengkapi seluruh isian wajib (Nama, NIK, No WA, dan Domisili).");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await createWarga(formData as NewWargaRantau);
    setLoading(false);

    if (res.success && res.data) {
      onSuccess(res.data);
    } else {
      setError(res.error || "Gagal menyimpan data warga baru.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-elevated border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              Tambah Warga Rantau Baru
            </h3>
            <p className="text-xs text-slate-500">
              Entri langsung buku data paguyuban KKS Timika
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap *
              </label>
              <input
                required
                type="text"
                value={formData.namaLengkap}
                onChange={(e) =>
                  setFormData({ ...formData, namaLengkap: e.target.value })
                }
                placeholder="Contoh: Andi Muh. Yusuf"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kecamatan Asal di Soppeng *
              </label>
              <select
                value={formData.kecamatanAsal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    kecamatanAsal: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
              >
                {KECAMATAN_SOPPENG.map((kec) => (
                  <option key={kec} value={kec}>
                    Kec. {kec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIK (16 Digit) *
              </label>
              <input
                required
                maxLength={16}
                type="text"
                value={formData.nik}
                onChange={(e) =>
                  setFormData({ ...formData, nik: e.target.value })
                }
                placeholder="7312xxxxxxxxxxxx"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. Kartu Keluarga (Opsional)
              </label>
              <input
                maxLength={16}
                type="text"
                value={formData.noKk || ""}
                onChange={(e) =>
                  setFormData({ ...formData, noKk: e.target.value })
                }
                placeholder="7312xxxxxxxxxxxx"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor WhatsApp Aktif *
              </label>
              <input
                required
                type="text"
                value={formData.noWa}
                onChange={(e) =>
                  setFormData({ ...formData, noWa: e.target.value })
                }
                placeholder="62812xxxxxxx"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jumlah Anggota Keluarga (Jiwa)
              </label>
              <input
                type="number"
                min={1}
                value={formData.jumlahKeluarga}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jumlahKeluarga: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Domisili Tempat Tinggal di Timika *
            </label>
            <input
              required
              type="text"
              value={formData.domisiliTimika}
              onChange={(e) =>
                setFormData({ ...formData, domisiliTimika: e.target.value })
              }
              placeholder="Contoh: Kuala Kencana Blok C / SP 2 Wanagon Jl. Rajawali"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Status Verifikasi Awal
            </label>
            <select
              value={formData.statusVerifikasi}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  statusVerifikasi: e.target.value as any,
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
            >
              <option value="verified">Langsung Terverifikasi</option>
              <option value="pending">Menunggu Verifikasi Pengurus</option>
            </select>
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
              {loading ? "Menyimpan..." : "Simpan Data Warga"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
