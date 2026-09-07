"use client";

import { useState, useTransition, useMemo, useRef } from "react";
import {
  Store,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  UploadCloud,
  ImageIcon,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  X,
  FileEdit,
} from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/utils";
import {
  createNiaga,
  updateNiaga,
  toggleNiagaStatus,
  toggleNiagaVerification,
  deleteNiaga,
} from "@/app/actions/niaga";
import { uploadFileClient } from "@/lib/upload-client";
import type { DirektoriNiaga, NewDirektoriNiaga } from "@repo/database/schema";

type Props = {
  initialNiaga: DirektoriNiaga[];
};

export function NiagaManager({ initialNiaga }: Props) {
  const [niagaList, setNiagaList] = useState<DirektoriNiaga[]>(initialNiaga);
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DirektoriNiaga | null>(null);
  const [isPending, startTransition] = useTransition();

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    niagaList.forEach((n) => set.add(n.kategoriUsaha));
    return Array.from(set);
  }, [niagaList]);

  // Filtered list
  const filteredList = useMemo(() => {
    return niagaList.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        item.namaUsaha.toLowerCase().includes(q) ||
        item.namaPemilik.toLowerCase().includes(q) ||
        (item.alamatUsaha && item.alamatUsaha.toLowerCase().includes(q));

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

  const handleToggleVerification = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleNiagaVerification(id, !current);
      if (res.success) {
        setNiagaList((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isVerified: !current } : n))
        );
      } else {
        alert(res.error || "Gagal mengubah status verifikasi usaha");
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Direktori Usaha & Jasa Warga</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              {niagaList.length} Terdaftar
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Katalog UMKM dan jasa profesional sesama warga perantau Soppeng di Kabupaten Mimika dengan foto gerai/produk resmi.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm transition shadow-sm flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Usaha Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari usaha, nama pemilik, lokasi jalan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500/10 focus:border-rose-400 text-slate-800"
            />
          </div>

          <select
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-400 text-slate-700"
          >
            <option value="all">Semua Kategori ({niagaList.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan <strong className="text-slate-800">{filteredList.length}</strong> usaha warga
        </div>
      </div>

      {/* Grid Cards (Enterprise Clean, No left colored borders) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredList.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-xl bg-white border border-slate-200/80 p-6">
            <Store className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              Tidak Ada Usaha yang Cocok
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Silakan tambahkan data usaha baru atau ubah kata kunci pencarian.
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-4 ${
                item.isActive ? "border-slate-200/80" : "border-slate-200 opacity-65 bg-slate-50/50"
              }`}
            >
              <div className="space-y-3.5">
                {/* Image Aspect Ratio 16:9 */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60">
                  {item.fotoUsahaUrl ? (
                    <img
                      src={item.fotoUsahaUrl}
                      alt={item.namaUsaha}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                      <ImageIcon className="w-8 h-8 stroke-1" />
                      <span className="text-[10px] mt-1 font-medium">Belum ada foto usaha</span>
                    </div>
                  )}

                  {/* Category Pill Over Image */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-sky-500/90 text-white backdrop-blur-xs shadow-xs">
                      {item.kategoriUsaha}
                    </span>
                  </div>

                  {/* Verification status pill */}
                  <div className="absolute top-2.5 right-2.5">
                    {item.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600/90 text-white shadow-xs backdrop-blur-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/90 text-white shadow-xs backdrop-blur-xs">
                        Menunggu Cek
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {item.namaUsaha}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pemilik:{" "}
                    <span className="font-semibold text-slate-800">
                      {item.namaPemilik}
                    </span>
                  </p>
                  {item.deskripsi && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  )}
                </div>

                <div className="text-xs text-slate-600 flex items-start gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-relaxed">
                    {item.alamatUsaha}
                  </span>
                </div>
              </div>

              {/* Status Toggles & Action Row */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleToggleVerification(item.id, item.isVerified)}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold transition cursor-pointer ${
                      item.isVerified ? "text-emerald-700 hover:text-emerald-800" : "text-amber-700 hover:text-amber-800"
                    }`}
                    title="Klik untuk ubah verifikasi"
                  >
                    {item.isVerified ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Terverifikasi KKS</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        <span>Verifikasi Sekarang</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleToggleActive(item.id, item.isActive)}
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full transition cursor-pointer ${
                      item.isActive
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.isActive ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    <span>{item.isActive ? "Aktif Tayang" : "Disembunyikan"}</span>
                  </button>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <a
                    href={formatWhatsAppUrl(
                      item.waBisnis,
                      `Tabe' ${item.namaPemilik}, kami dari pengurus KKS Mimika perihal direktori usaha ${item.namaUsaha}...`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs flex items-center gap-1.5 transition border border-emerald-200/80"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item);
                        setIsAddModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                      title="Edit Data Usaha"
                    >
                      <FileEdit className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(item.id, item.namaUsaha)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Hapus Usaha"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah / Edit Usaha */}
      {isAddModalOpen && (
        <ModalNiagaForm
          initialData={editingItem}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
          onSuccess={(savedItem, isEdit) => {
            if (isEdit) {
              setNiagaList((prev) =>
                prev.map((n) => (n.id === savedItem.id ? savedItem : n))
              );
            } else {
              setNiagaList((prev) => [savedItem, ...prev]);
            }
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

// Subcomponent: Form Tambah / Edit Niaga dengan Upload Foto
function ModalNiagaForm({
  initialData,
  onClose,
  onSuccess,
}: {
  initialData: DirektoriNiaga | null;
  onClose: () => void;
  onSuccess: (niaga: DirektoriNiaga, isEdit: boolean) => void;
}) {
  const [namaUsaha, setNamaUsaha] = useState(initialData?.namaUsaha || "");
  const [namaPemilik, setNamaPemilik] = useState(initialData?.namaPemilik || "");
  const [kategoriUsaha, setKategoriUsaha] = useState(
    initialData?.kategoriUsaha || "Kuliner Khas"
  );
  const [customKategori, setCustomKategori] = useState("");
  const [alamatUsaha, setAlamatUsaha] = useState(initialData?.alamatUsaha || "");
  const [waBisnis, setWaBisnis] = useState(initialData?.waBisnis || "");
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "");
  const [fotoUsahaUrl, setFotoUsahaUrl] = useState(initialData?.fotoUsahaUrl || "");
  const [isVerified, setIsVerified] = useState(initialData?.isVerified ?? true);

  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const res = await uploadFileClient(file, "niaga", false);
    setIsUploading(false);

    if (res.success && res.url) {
      setFotoUsahaUrl(res.url);
    } else {
      setError(res.error || "Gagal mengunggah foto usaha.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaUsaha.trim() || !namaPemilik.trim() || !waBisnis.trim() || !alamatUsaha.trim()) {
      setError("Nama Usaha, Pemilik, Alamat, dan WhatsApp Bisnis wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    const resolvedCategory =
      kategoriUsaha === "Lainnya" && customKategori.trim()
        ? customKategori.trim()
        : kategoriUsaha;

    const payload = {
      namaUsaha: namaUsaha.trim(),
      namaPemilik: namaPemilik.trim(),
      kategoriUsaha: resolvedCategory,
      alamatUsaha: alamatUsaha.trim(),
      waBisnis: waBisnis.trim(),
      fotoUsahaUrl: fotoUsahaUrl || null,
      deskripsi: deskripsi.trim() || null,
      isVerified,
      isActive: initialData?.isActive ?? true,
    };

    if (initialData) {
      const res = await updateNiaga(initialData.id, payload);
      setLoading(false);
      if (res.success && res.data) {
        onSuccess(res.data, true);
      } else {
        setError(res.error || "Gagal memperbarui usaha.");
      }
    } else {
      const res = await createNiaga(payload as NewDirektoriNiaga);
      setLoading(false);
      if (res.success && res.data) {
        onSuccess(res.data, false);
      } else {
        setError(res.error || "Gagal menambahkan usaha.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200/80 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {initialData ? "Edit Direktori Usaha Warga" : "Tambah Direktori Usaha Warga"}
            </h3>
            <p className="text-xs text-slate-500">
              Kerukunan Keluarga Soppeng (KKS) Kab. Mimika
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Upload Foto Usaha dengan Preview */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700">
              Foto Tempat / Logo Usaha
            </label>
            <div className="flex items-start gap-3">
              <div className="w-28 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {fotoUsahaUrl ? (
                  <img
                    src={fotoUsahaUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>{isUploading ? "Mengunggah..." : "Pilih Berkas Gambar"}</span>
                </button>
                <p className="text-[11px] text-slate-400">
                  Format JPG, PNG, atau WebP. Maks 3MB.
                </p>
                {fotoUsahaUrl && (
                  <button
                    type="button"
                    onClick={() => setFotoUsahaUrl("")}
                    className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                  >
                    Hapus Foto
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/10 focus:border-rose-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Pemilik Warga *
              </label>
              <input
                required
                type="text"
                value={namaPemilik}
                onChange={(e) => setNamaPemilik(e.target.value)}
                placeholder="Misal: H. Andi Baso Mappatunru"
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/10 focus:border-rose-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kategori Usaha *
              </label>
              <select
                value={kategoriUsaha}
                onChange={(e) => setKategoriUsaha(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg focus:border-rose-400 focus:outline-hidden text-slate-800"
              >
                <option value="Kuliner Khas">Kuliner Khas Bugis / Makanan</option>
                <option value="Jasa & Bengkel">Jasa, Servis & Bengkel</option>
                <option value="Toko Bangunan">Toko Bangunan & Konstruksi</option>
                <option value="Jahit Sutra/Pakaian">Jahit Sutra, Adat & Busana</option>
                <option value="Hasil Bumi & Logistik">Hasil Bumi, Sembako & Ekspedisi</option>
                <option value="Toko Retail">Toko Retail & Kelontong</option>
                <option value="Lainnya">Kategori Lainnya (Tulis Sendiri)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp Bisnis (Nomor Aktif) *
              </label>
              <input
                required
                type="text"
                value={waBisnis}
                onChange={(e) => setWaBisnis(e.target.value)}
                placeholder="Misal: 6281248011234"
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/10 focus:border-rose-400 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {kategoriUsaha === "Lainnya" && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Kategori Khusus:
              </label>
              <input
                type="text"
                value={customKategori}
                onChange={(e) => setCustomKategori(e.target.value)}
                placeholder="Misal: Pengrajin Mebel Kayu Besi"
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg focus:border-rose-400 focus:outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Lengkap Usaha di Timika *
            </label>
            <input
              required
              type="text"
              value={alamatUsaha}
              onChange={(e) => setAlamatUsaha(e.target.value)}
              placeholder="Misal: Jl. Cenderawasih SP 2, Timika (Samping Polsek)"
              className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/10 focus:border-rose-400 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Singkat Usaha / Produk Utama
            </label>
            <textarea
              rows={2}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan menu andalan, layanan jasa, atau produk unggulan..."
              className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/10 focus:border-rose-400 focus:outline-hidden"
            />
          </div>

          {/* Verification Switch */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Status Verifikasi Admin
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Beri badge verified resmi pengurus KKS pada kartu profil UMKM ini.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || isUploading}
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Menyimpan..." : initialData ? "Perbarui Usaha" : "Simpan Usaha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
