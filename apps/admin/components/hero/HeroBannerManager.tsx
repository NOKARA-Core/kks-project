"use client";

import { useState, useTransition, useRef } from "react";
import {
  Images,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Upload,
  Loader2,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  MoveUp,
  MoveDown,
} from "lucide-react";
import type { HeroSlide, NewHeroSlide } from "@repo/database/schema";
import {
  createHeroSlide,
  updateHeroSlide,
  toggleHeroSlideActive,
  updateHeroSlideOrder,
  deleteHeroSlide,
} from "@/app/actions/hero-slides";
import { uploadFileClient } from "@/lib/upload-client";

interface Props {
  initialSlides: HeroSlide[];
}

export function HeroBannerManager({ initialSlides }: Props) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badgeTag, setBadgeTag] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openCreateModal = () => {
    setEditingSlide(null);
    setTitle("");
    setSubtitle("");
    setBadgeTag("Dokumentasi Resmi");
    setTargetUrl("/warta");
    setOrderIndex(slides.length);
    setImageUrl("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setTitle(slide.title || "");
    setSubtitle(slide.subtitle || "");
    setBadgeTag(slide.badgeTag || "");
    setTargetUrl(slide.targetUrl || "");
    setOrderIndex(slide.orderIndex);
    setImageUrl(slide.imageUrl);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg("Ukuran berkas melebihi batas maksimal 3MB.");
      return;
    }

    // Validate type (JPG, PNG, WebP)
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Format berkas harus berupa JPG, PNG, atau WebP.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");

    try {
      const res = await uploadFileClient(file, "hero");
      if (res.success && res.url) {
        setImageUrl(res.url);
      } else {
        setErrorMsg(res.error || "Gagal mengunggah gambar hero.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Terjadi kesalahan saat mengunggah.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setErrorMsg("Silakan unggah gambar banner terlebih dahulu.");
      return;
    }

    startTransition(async () => {
      if (editingSlide) {
        const res = await updateHeroSlide(editingSlide.id, {
          title: title.trim() || null,
          subtitle: subtitle.trim() || null,
          badgeTag: badgeTag.trim() || null,
          targetUrl: targetUrl.trim() || null,
          orderIndex: Number(orderIndex) || 0,
          imageUrl,
        });

        if (res.success && res.data) {
          setSlides((prev) =>
            prev.map((s) => (s.id === editingSlide.id ? res.data! : s))
          );
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || "Gagal memperbarui slide.");
        }
      } else {
        const payload: NewHeroSlide = {
          title: title.trim() || null,
          subtitle: subtitle.trim() || null,
          badgeTag: badgeTag.trim() || null,
          targetUrl: targetUrl.trim() || null,
          orderIndex: Number(orderIndex) || 0,
          imageUrl,
          isActive: true,
        };

        const res = await createHeroSlide(payload);
        if (res.success && res.data) {
          setSlides((prev) => [...prev, res.data!]);
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || "Gagal membuat slide baru.");
        }
      }
    });
  };

  const handleToggleActive = (slide: HeroSlide) => {
    startTransition(async () => {
      const res = await toggleHeroSlideActive(slide.id, slide.isActive);
      if (res.success && res.data) {
        setSlides((prev) =>
          prev.map((s) => (s.id === slide.id ? res.data! : s))
        );
      }
    });
  };

  const handleOrderChange = (slide: HeroSlide, delta: number) => {
    const newOrder = Math.max(0, slide.orderIndex + delta);
    startTransition(async () => {
      const res = await updateHeroSlideOrder(slide.id, newOrder);
      if (res.success && res.data) {
        setSlides((prev) =>
          prev
            .map((s) => (s.id === slide.id ? res.data! : s))
            .sort((a, b) => a.orderIndex - b.orderIndex)
        );
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus slide banner ini?")) return;

    startTransition(async () => {
      const res = await deleteHeroSlide(id);
      if (res.success) {
        setSlides((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(res.error || "Gagal menghapus slide.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider">
            <Images className="w-4 h-4" />
            <span>Manajemen Beranda</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Banner Hero Media Beranda
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Atur dan kurasi slide foto dokumentasi, liputan kegiatan paguyuban, serta pengumuman resmi yang tampil pada carousel utama portal publik.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Slide Baru</span>
        </button>
      </div>

      {/* Slide List / Grid */}
      {slides.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
          <Images className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">Belum ada slide banner</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Klik tombol &quot;Tambah Slide Baru&quot; di atas untuk mengunggah foto dokumentasi kegiatan atau warta utama paguyuban.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`flex flex-col justify-between bg-white rounded-2xl border transition shadow-xs overflow-hidden ${
                slide.isActive
                  ? "border-slate-200"
                  : "border-slate-200 opacity-60 bg-slate-50/70"
              }`}
            >
              {/* Thumbnail Container (16:9) */}
              <div className="relative aspect-16/9 bg-slate-100 overflow-hidden group">
                <img
                  src={slide.imageUrl}
                  alt={slide.title || "Hero Banner"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                    {slide.badgeTag || "Banner"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      slide.isActive
                        ? "bg-emerald-500/90 text-white"
                        : "bg-rose-500/90 text-white"
                    }`}
                  >
                    {slide.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                {/* Order Index Pill */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-white/90 text-slate-800 shadow-2xs">
                  Urutan: #{slide.orderIndex}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 space-y-2 grow">
                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                  {slide.title || "Tanpa Judul"}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {slide.subtitle || "Tidak ada keterangan tambahan."}
                </p>
                {slide.targetUrl && (
                  <div className="pt-1 flex items-center gap-1 text-[11px] text-blue-600 font-medium truncate">
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{slide.targetUrl}</span>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                {/* Order Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Naikkan Urutan"
                    disabled={isPending || slide.orderIndex <= 0}
                    onClick={() => handleOrderChange(slide, -1)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 disabled:opacity-30 transition cursor-pointer"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Turunkan Urutan"
                    disabled={isPending}
                    onClick={() => handleOrderChange(slide, 1)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 disabled:opacity-30 transition cursor-pointer"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status & Edit Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title={slide.isActive ? "Nonaktifkan Slide" : "Aktifkan Slide"}
                    disabled={isPending}
                    onClick={() => handleToggleActive(slide)}
                    className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                      slide.isActive
                        ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        : "border-slate-300 text-slate-600 hover:bg-white"
                    }`}
                  >
                    {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    title="Edit Slide"
                    disabled={isPending}
                    onClick={() => openEditModal(slide)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-700 transition cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    title="Hapus Slide"
                    disabled={isPending}
                    onClick={() => handleDelete(slide.id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Drawer Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-slate-900">
                <Images className="w-4 h-4 text-gold" />
                <span>{editingSlide ? "Perbarui Slide Banner" : "Tambah Slide Banner Baru"}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Upload Dropzone / Preview */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  Foto Banner (Rasio Rekomendasi 16:9) <span className="text-rose-500">*</span>
                </label>

                {imageUrl ? (
                  <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                    <img
                      src={imageUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition cursor-pointer"
                      >
                        Ganti Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-rose-700 transition cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full aspect-16/9 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col items-center justify-center gap-2 p-4 text-center cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-6 h-6 text-gold animate-spin" />
                        <span className="text-xs font-semibold text-slate-600">Mengunggah gambar...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-slate-400" />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-700">Pilih atau Seret Foto Banner</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Format WebP, PNG, atau JPG (Maks. 3MB)</p>
                        </div>
                      </>
                    )}
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Judul Banner / Warta (Opsional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Musyawarah & Temu Warga KKS Timika"
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:border-slate-800 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Badge Tag (Opsional)
                  </label>
                  <input
                    type="text"
                    value={badgeTag}
                    onChange={(e) => setBadgeTag(e.target.value)}
                    placeholder="Warta Utama"
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:border-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Keterangan Singkat / Caption (Opsional)
                </label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Keterangan singkat dokumentasi atau ajakan kegiatan..."
                  rows={2}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:border-slate-800 focus:outline-hidden resize-none"
                />
              </div>

              {/* Target URL & Order Index */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Tautan Tujuan saat Diklik (Opsional)
                  </label>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="/warta atau https://..."
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:border-slate-800 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Urutan Tampil (#)
                  </label>
                  <input
                    type="number"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(parseInt(e.target.value, 10) || 0)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:border-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending || isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingSlide ? "Simpan Perubahan" : "Terbitkan Banner"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
