"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Store,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Check,
  X,
  Search,
  ExternalLink,
  Briefcase,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { formatTanggal, formatWhatsAppUrl } from "@/lib/utils";
import {
  createNiaga,
  toggleNiagaStatus,
  deleteNiaga,
} from "@/app/actions/niaga";
import type { DirektoriNiaga, NewDirektoriNiaga } from "@repo/database/schema";

type Props = {
  initialNiaga: DirektoriNiaga[];
};

export function NiagaManager({ initialNiaga }: Props) {
  const [niagaList, setNiagaList] = useState<DirektoriNiaga[]>(initialNiaga);
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    niagaList.forEach((n) => set.add(n.kategoriUsaha));
    return Array.from(set);
  }, [niagaList]);

  // Filtered
  const filteredList = useMemo(() => {
    return niagaList.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        item.namaUsaha.toLowerCase().includes(q) ||
        item.namaPemilik.toLowerCase().includes(q) ||
        (item.alamatUsahaTimika &&
          item.alamatUsahaTimika.toLowerCase().includes(q));

      const matchCategory =
        kategoriFilter === "all" || item.kategoriUsaha === kategoriFilter;

      return matchSearch && matchCategory;
    });
  }, [niagaList, search, kategoriFilter]);

  const handleToggleActive = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleNiagaStatus(id, !current);
      if (res.success) {
        setNiagaList((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isActive: !current } : n))
        );
      } else {
        alert(res.error || "Gagal mengubah status usaha");
      }
    });
  };

  const handleDelete = (id: string, nama: string) => {
    if (!confirm(`Hapus direktori usaha "${nama}"?`)) return;
    startTransition(async () => {
      const res = await deleteNiaga(id);
      if (res.success) {
        setNiagaList((prev) => prev.filter((n) => n.id !== id));
      } else {
        alert(res.error || "Gagal menghapus usaha");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Direktori Usaha & Jasa Warga Rantau
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Mendukung kemandirian ekonomi sesama perantau Soppeng di Kabupaten
            Mimika melalui promosi dan jejaring niaga.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold text-sm transition shadow-md shadow-gold/25 flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Usaha Warga
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari usaha, pemilik, alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold"
            />
          </div>

          <select
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold text-slate-700"
          >
            <option value="all">Semua Kategori ({niagaList.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Menampilkan <strong>{filteredList.length}</strong> usaha aktif
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl bg-white border border-slate-200 p-6">
            <Store className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              Tidak Ada Usaha yang Cocok
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Tambahkan data usaha warga baru untuk ditampilkan di portal publik.
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs hover:shadow-card transition-all duration-200 flex flex-col justify-between space-y-4 ${
                item.isActive ? "border-slate-200/80" : "border-slate-200 opacity-60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-gold-dark border border-amber-200/60">
                    {item.kategoriUsaha}
                  </span>

                  <button
                    disabled={isPending}
                    onClick={() => handleToggleActive(item.id, item.isActive)}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full transition ${
                      item.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                    title="Klik untuk ubah status tampil"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.isActive ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {item.namaUsaha}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pemilik:{" "}
                    <span className="font-medium text-slate-800">
                      {item.namaPemilik}
                    </span>
                  </p>
                </div>

                <div className="text-xs text-slate-600 flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {item.alamatUsahaTimika || "Timika, Papua Tengah"}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={formatWhatsAppUrl(
                    item.waBisnis,
                    `Tabe' ${item.namaPemilik}, kami menghubungi dari pengurus KKS Kab. Mimika perihal usaha ${item.namaUsaha}...`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs flex items-center gap-1.5 transition border border-emerald-200"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Hubungi Bisnis
                </a>

                <button
                  disabled={isPending}
                  onClick={() => handleDelete(item.id, item.namaUsaha)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Hapus Usaha"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah Usaha */}
      {isAddModalOpen && (
        <ModalTambahNiaga
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={(newItem) => {
            setNiagaList((prev) => [newItem, ...prev]);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// Subcomponent: Form Tambah Niaga
function ModalTambahNiaga({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (niaga: DirektoriNiaga) => void;
}) {
  const [namaUsaha, setNamaUsaha] = useState("");
  const [namaPemilik, setNamaPemilik] = useState("");
  const [kategoriUsaha, setKategoriUsaha] = useState("Kuliner");
  const [alamatUsahaTimika, setAlamatUsahaTimika] = useState("");
  const [waBisnis, setWaBisnis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaUsaha.trim() || !namaPemilik.trim() || !waBisnis.trim()) {
      setError("Nama Usaha, Pemilik, dan WhatsApp Bisnis wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: NewDirektoriNiaga = {
      namaUsaha,
      namaPemilik,
      kategoriUsaha,
      alamatUsahaTimika,
      waBisnis,
      isActive: true,
    };

    const res = await createNiaga(payload);
    setLoading(false);

    if (res.success && res.data) {
      onSuccess(res.data);
    } else {
      setError(res.error || "Gagal menambahkan usaha.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-elevated border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              Tambah Direktori Usaha Warga
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
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Usaha / Brand *
            </label>
            <input
              required
              type="text"
              value={namaUsaha}
              onChange={(e) => setNamaUsaha(e.target.value)}
              placeholder="Misal: Coto & Konro Latemmamala"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Pemilik Warga Soppeng *
            </label>
            <input
              required
              type="text"
              value={namaPemilik}
              onChange={(e) => setNamaPemilik(e.target.value)}
              placeholder="Misal: Andi Baso Mappatunru"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Kategori Usaha *
            </label>
            <select
              value={kategoriUsaha}
              onChange={(e) => setKategoriUsaha(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
            >
              <option value="Kuliner">Kuliner & Rumah Makan</option>
              <option value="Jasa Teknik & Konstruksi">
                Jasa Teknik & Konstruksi
              </option>
              <option value="Toko Sembako & Retail">
                Toko Sembako & Retail
              </option>
              <option value="Transportasi & Ekspedisi">
                Transportasi & Ekspedisi
              </option>
              <option value="Jasa Jahit & Busana">Jasa Jahit & Busana</option>
              <option value="Lainnya">Bidang Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nomor WhatsApp Bisnis *
            </label>
            <input
              required
              type="text"
              value={waBisnis}
              onChange={(e) => setWaBisnis(e.target.value)}
              placeholder="62812xxxxxxx"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Lokasi Usaha di Timika
            </label>
            <input
              type="text"
              value={alamatUsahaTimika}
              onChange={(e) => setAlamatUsahaTimika(e.target.value)}
              placeholder="Misal: Jl. Yos Sudarso No. 88, Timika Kota"
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
              {loading ? "Menyimpan..." : "Simpan Usaha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
