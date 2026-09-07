"use client";

import { useState, useTransition, useRef } from "react";
import {
  Megaphone,
  AlertTriangle,
  Heart,
  Calendar,
  Plus,
  Copy,
  Check,
  Trash2,
  Share2,
  MapPin,
  Phone,
  Eye,
  CheckCircle2,
  Archive,
  FileEdit,
  X,
  Upload,
  FileText,
  DollarSign,
  Users,
  ExternalLink,
  ImageIcon,
  Loader2,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { formatTanggal, formatWhatsAppUrl } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

import {
  createWarta,
  updateWarta,
  updateWartaStatus,
  deleteWarta,
} from "@/app/actions/warta";
import { uploadImageAction, uploadDocumentAction } from "@/app/actions/upload";
import { WartaBroadcastButton } from "@/components/modules/WartaBroadcastButton";
import { FormWartaAccessible } from "@/components/warta/FormWartaAccessible";
import type { WartaPaguyuban, NewWartaPaguyuban } from "@repo/database/schema";

type Props = {
  initialWarta: WartaPaguyuban[];
};

export function WartaManager({ initialWarta }: Props) {
  const [wartaList, setWartaList] = useState<WartaPaguyuban[]>(initialWarta);
  const [activeTab, setActiveTab] = useState<
    "all" | "duka_cita" | "suka_cita" | "agenda_kegiatan"
  >("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingWarta, setEditingWarta] = useState<WartaPaguyuban | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedWarta, setSelectedWarta] = useState<WartaPaguyuban | null>(null);

  // Filtered list
  const filteredList = wartaList.filter((w) => {
    const matchCategory = activeTab === "all" || w.kategori === activeTab;
    const matchStatus = statusFilter === "all" || w.statusTayang === statusFilter;
    return matchCategory && matchStatus;
  });

  const handleUpdateStatus = (
    id: string,
    statusTayang: "draft" | "published" | "archived"
  ) => {
    startTransition(async () => {
      const res = await updateWartaStatus(id, statusTayang);
      if (res.success) {
        setWartaList((prev) =>
          prev.map((w) => (w.id === id ? { ...w, statusTayang } : w))
        );
      } else {
        alert(res.error || "Gagal mengubah status warta");
      }
    });
  };

  const handleDelete = (id: string, judul: string) => {
    if (!confirm(`Hapus warta "${judul}"?`)) return;
    startTransition(async () => {
      const res = await deleteWarta(id);
      if (res.success) {
        setWartaList((prev) => prev.filter((w) => w.id !== id));
      } else {
        alert(res.error || "Gagal menghapus warta");
      }
    });
  };

  const generateWhatsAppMessage = (w: WartaPaguyuban) => {
    const baseUrl = siteConfig.appUrl;
    const portalUrl = `${baseUrl}/warta/${w.slug || w.id}`;

    if (w.kategori === "duka_cita") {
      return `*INNALILLAHI WA INNA ILAIHI RAJI'UN*\n*WARTA LELAYU ${siteConfig.orgName.toUpperCase()}*\n\n${w.judul}\n\n${w.ringkasan || ""}\n\n📍 *Rumah Duka/Lokasi:* ${w.alamatDukaTimika || "Timika"}\n🗓️ *Waktu Wafat:* ${w.waktuWafat ? formatTanggal(w.waktuWafat) : "-"}\n📞 *Kontak Keluarga/Takziah:* ${w.kontakKeluargaWa || "-"}\n\nKeterangan Lengkap:\n${w.kontenUtama || ""}\n\n🔗 *Baca di Portal:* ${portalUrl}\n\n_Semoga almarhum/ah diampuni segala dosanya dan keluarga diberikan ketabahan. Salipuri Temmadinging._\n*Pengurus ${siteConfig.orgName}*`;
    }

    if (w.kategori === "agenda_kegiatan") {
      const biayaText =
        w.biayaPendaftaran && Number(w.biayaPendaftaran) > 0
          ? `Rp ${Number(w.biayaPendaftaran).toLocaleString("id-ID")}`
          : "Gratis / Terbuka";

      return `*📢 WARTA & AGENDA RESMI ${siteConfig.orgName.toUpperCase()}*\n\n*${w.judul}*\n\n${w.ringkasan || ""}\n\n🗓️ *Tanggal Pelaksanaan:* ${w.tanggalMulai ? new Date(w.tanggalMulai).toLocaleString("id-ID") : "-"}${w.tanggalSelesai ? ` s/d ${new Date(w.tanggalSelesai).toLocaleString("id-ID")}` : ""}\n📍 *Lokasi Kegiatan:* ${w.lokasiNamaTempat || "Timika"}\n🏢 *Penyelenggara:* ${w.penyelenggaraSektor || `Pengurus Pusat ${siteConfig.shortOrgName}`}\n💰 *Biaya/Infaq:* ${biayaText}\n👥 *Kuota Peserta:* ${w.kuotaPeserta ? `${w.kuotaPeserta} Peserta` : "Terbuka untuk Umum"}\n📞 *Narahubung / PIC:* ${w.kontakPanitiaWa || "-"}\n${w.linkPendaftaranExternal ? `📝 *Form Pendaftaran:* ${w.linkPendaftaranExternal}\n` : ""}🔗 *Detail Lengkap Agenda:* ${portalUrl}\n\n*Pengurus ${siteConfig.orgName} — Yassisoppengi*`;
    }

    return `*WARTA PAGUYUBAN ${siteConfig.orgName.toUpperCase()}*\n\n*${w.judul}*\n\n${w.ringkasan || ""}\n\n📍 *Lokasi:* ${w.lokasiNamaTempat || "Timika"}\n📞 *Narahubung:* ${w.kontakPanitiaWa || "-"}\n\n${w.kontenUtama || ""}\n\n🔗 *Baca Selengkapnya:* ${portalUrl}\n\n*Pengurus ${siteConfig.orgName}*`;
  };


  const copyToClipboard = (w: WartaPaguyuban) => {
    const text = generateWhatsAppMessage(w);
    navigator.clipboard.writeText(text);
    setCopiedId(w.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Warta Paguyuban & Lelayu
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pusat publikasi agenda kegiatan resmi, berita lelayu duka cita, dan kabar suka cita paguyuban warga di Timika.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <Link
            href="/warta/new"
            className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base transition shadow-md shadow-amber-600/25 flex items-center gap-2.5 active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Tulis Kabar Baru</span>
          </Link>
        </div>
      </div>

      {/* Category Tabs & Status Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semua ({wartaList.length})
          </button>
          <button
            onClick={() => setActiveTab("agenda_kegiatan")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "agenda_kegiatan"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-amber-800 hover:bg-amber-50"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Agenda Paguyuban (
            {wartaList.filter((w) => w.kategori === "agenda_kegiatan").length})
          </button>
          <button
            onClick={() => setActiveTab("duka_cita")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "duka_cita"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-rose-700 hover:bg-rose-50"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Kabar Duka ({wartaList.filter((w) => w.kategori === "duka_cita").length})
          </button>
          <button
            onClick={() => setActiveTab("suka_cita")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "suka_cita"
                ? "bg-sky-600 text-white shadow-xs"
                : "text-sky-700 hover:bg-sky-50"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Suka Cita ({wartaList.filter((w) => w.kategori === "suka_cita").length})
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-500"
          >
            <option value="all">Semua Status</option>
            <option value="published">Tayang (Published)</option>
            <option value="draft">Draf (Draft)</option>
            <option value="archived">Diarsipkan (Archived)</option>
          </select>
        </div>
      </div>

      {/* Warta Cards List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 p-6">
            <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              Tidak Ada Warta Ditemukan
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Gunakan tombol "Buat Warta Baru" untuk mempublikasikan kegiatan atau kabar kerukunan.
            </p>
          </div>
        ) : (
          filteredList.map((w) => {
            const isDuka = w.kategori === "duka_cita";
            const isSuka = w.kategori === "suka_cita";
            const isAgenda = w.kategori === "agenda_kegiatan";

            return (
              <div
                key={w.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 hover:shadow-card transition-all duration-200 relative overflow-hidden flex flex-col md:flex-row gap-6"
              >
                {/* Photo Thumbnail if available */}
                {w.fotoUtamaUrl && (
                  <div className="w-full md:w-52 h-36 md:h-auto rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/70">
                    <img
                      src={w.fotoUtamaUrl}
                      alt={w.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 flex-1">
                  {/* Content info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Category Badge */}
                      {isDuka && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                          <AlertTriangle className="w-3 h-3" />
                          LELAYU / DUKA CITA
                        </span>
                      )}
                      {isSuka && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                          <Heart className="w-3 h-3" />
                          SUKA CITA & AQIQAH
                        </span>
                      )}
                      {isAgenda && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                          <Calendar className="w-3 h-3" />
                          AGENDA PAGUYUBAN
                        </span>
                      )}

                      {/* Status pill */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          w.statusTayang === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : w.statusTayang === "draft"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {w.statusTayang}
                      </span>

                      <span className="text-xs text-slate-400">
                        {formatTanggal(w.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                      {w.judul}
                    </h3>

                    {w.ringkasan && (
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {w.ringkasan}
                      </p>
                    )}

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      {/* Location */}
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{w.lokasiNamaTempat || w.alamatDukaTimika || "Timika"}</span>
                      </div>

                      {/* Agenda specific metadata */}
                      {isAgenda && w.tanggalMulai && (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>
                            {new Date(w.tanggalMulai).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}

                      {isAgenda && w.biayaPendaftaran !== null && (
                        <div className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                          {Number(w.biayaPendaftaran) === 0 ? "Gratis" : `Rp ${Number(w.biayaPendaftaran).toLocaleString("id-ID")}`}
                        </div>
                      )}

                      {isAgenda && w.kuotaPeserta && (
                        <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Users className="w-3 h-3 text-slate-500" />
                          <span>Kuota: {w.kuotaPeserta}</span>
                        </div>
                      )}

                      {/* Duka specific */}
                      {isDuka && w.namaAlmarhum && (
                        <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/50">
                          Alm. {w.namaAlmarhum}
                        </span>
                      )}

                      {(w.kontakPanitiaWa || w.kontakKeluargaWa) && (
                        <div className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{w.kontakPanitiaWa || w.kontakKeluargaWa}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    {/* Broadcast 1-Klik ke WhatsApp */}
                    <WartaBroadcastButton
                      judul={w.judul}
                      kategori={w.kategori}
                      ringkasan={w.ringkasan}
                      detailLokasi={w.lokasiNamaTempat || w.alamatDukaTimika}
                      kontakPic={w.kontakPanitiaWa || w.kontakKeluargaWa}
                      slugOrId={w.slug || w.id}
                      variant="compact"
                      label="Siarkan"
                    />

                    {/* Auto format WA Message button */}
                    <button
                      onClick={() => copyToClipboard(w)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs ${
                        copiedId === w.id
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                      title="Salin template warta format WhatsApp"
                    >
                      {copiedId === w.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Tersalin ke WA!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          Salin Format WA
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* View detail */}
                      <button
                        onClick={() => setSelectedWarta(w)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                        title="Baca Rincian Warta"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditingWarta(w);
                          setIsCreateModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                        title="Edit Warta"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle status */}
                      {w.statusTayang === "published" ? (
                        <button
                          disabled={isPending}
                          onClick={() => handleUpdateStatus(w.id, "archived")}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition"
                          title="Arsipkan Warta"
                        >
                          Arsipkan
                        </button>
                      ) : (
                        <button
                          disabled={isPending}
                          onClick={() => handleUpdateStatus(w.id, "published")}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold hover:bg-emerald-100 transition"
                          title="Tayangkan Warta"
                        >
                          Tayangkan
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        disabled={isPending}
                        onClick={() => handleDelete(w.id, w.judul)}
                        className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                        title="Hapus Warta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Detail Warta */}
      {selectedWarta && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-elevated border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                Rincian Warta Paguyuban
              </h3>
              <button
                onClick={() => setSelectedWarta(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner preview if any */}
            {selectedWarta.fotoUtamaUrl && (
              <div className="h-48 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={selectedWarta.fotoUtamaUrl}
                  alt={selectedWarta.judul}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Judul Warta</span>
                <span className="font-bold text-slate-900 text-base">
                  {selectedWarta.judul}
                </span>
                {selectedWarta.slug && (
                  <span className="text-xs text-slate-400 font-mono block mt-0.5">
                    Slug: /warta/{selectedWarta.slug}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block">Kategori</span>
                  <span className="font-semibold text-slate-800 uppercase">
                    {selectedWarta.kategori.replace("_", " ")}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block">Status Tayang</span>
                  <span className="font-semibold text-slate-800 uppercase">
                    {selectedWarta.statusTayang}
                  </span>
                </div>
              </div>

              {/* Agenda specifics in detail */}
              {selectedWarta.kategori === "agenda_kegiatan" && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-2 text-xs">
                  <span className="font-bold text-amber-900 block">
                    Informasi Teknis Agenda & Registrasi:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-amber-950">
                    <div>
                      <strong>Waktu Mulai:</strong>{" "}
                      {selectedWarta.tanggalMulai
                        ? new Date(selectedWarta.tanggalMulai).toLocaleString("id-ID")
                        : "-"}
                    </div>
                    <div>
                      <strong>Waktu Selesai:</strong>{" "}
                      {selectedWarta.tanggalSelesai
                        ? new Date(selectedWarta.tanggalSelesai).toLocaleString("id-ID")
                        : "-"}
                    </div>
                    <div>
                      <strong>Penyelenggara:</strong>{" "}
                      {selectedWarta.penyelenggaraSektor || "-"}
                    </div>
                    <div>
                      <strong>Biaya Pendaftaran:</strong>{" "}
                      {selectedWarta.biayaPendaftaran !== null
                        ? Number(selectedWarta.biayaPendaftaran) === 0
                          ? "Gratis"
                          : `Rp ${Number(selectedWarta.biayaPendaftaran).toLocaleString("id-ID")}`
                        : "-"}
                    </div>
                    <div>
                      <strong>Kuota Peserta:</strong>{" "}
                      {selectedWarta.kuotaPeserta
                        ? `${selectedWarta.kuotaPeserta} Orang`
                        : "Tidak dibatasi"}
                    </div>
                    {selectedWarta.linkPendaftaranExternal && (
                      <div className="truncate">
                        <strong>Link Eksternal:</strong>{" "}
                        <a
                          href={selectedWarta.linkPendaftaranExternal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-700 underline font-medium"
                        >
                          Buka Formulir
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Duka specifics in detail */}
              {selectedWarta.kategori === "duka_cita" && (
                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/60 space-y-2 text-xs">
                  <span className="font-bold text-rose-900 block">
                    Informasi Takziah & Keluarga:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-rose-950">
                    <div>
                      <strong>Nama Almarhum/ah:</strong> {selectedWarta.namaAlmarhum || "-"}
                    </div>
                    <div>
                      <strong>Waktu Wafat:</strong>{" "}
                      {selectedWarta.waktuWafat ? formatTanggal(selectedWarta.waktuWafat) : "-"}
                    </div>
                    <div className="sm:col-span-2">
                      <strong>Alamat Rumah Duka:</strong>{" "}
                      {selectedWarta.alamatDukaTimika || "-"}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-50 text-xs">
                <span className="text-slate-400 block">Lokasi / Tempat</span>
                <span className="font-medium text-slate-800">
                  {selectedWarta.lokasiNamaTempat || selectedWarta.alamatDukaTimika || "Timika"}
                </span>
                {selectedWarta.lokasiMapsUrl && (
                  <a
                    href={selectedWarta.lokasiMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Buka Google Maps
                  </a>
                )}
              </div>

              {(selectedWarta.kontakPanitiaWa || selectedWarta.kontakKeluargaWa) && (
                <div className="p-3 rounded-xl bg-slate-50 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block">Kontak WA Narahubung</span>
                    <span className="font-mono text-slate-800">
                      {selectedWarta.kontakPanitiaWa || selectedWarta.kontakKeluargaWa}
                    </span>
                  </div>
                  <a
                    href={formatWhatsAppUrl(
                      (selectedWarta.kontakPanitiaWa || selectedWarta.kontakKeluargaWa)!
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    Hubungi
                  </a>
                </div>
              )}

              {/* Attachment link if present */}
              {selectedWarta.lampiranDokumenUrl && (
                <div className="p-3 rounded-xl bg-slate-50 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-800">
                      Lampiran Dokumen / Juknis (PDF)
                    </span>
                  </div>
                  <a
                    href={selectedWarta.lampiranDokumenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-slate-800 text-white rounded-lg text-xs font-semibold"
                  >
                    Unduh
                  </a>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-700 block">
                  Konten / Isi Lengkap:
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedWarta.kontenUtama || selectedWarta.ringkasan || "Tidak ada konten rincian."}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <WartaBroadcastButton
                  judul={selectedWarta.judul}
                  kategori={selectedWarta.kategori}
                  ringkasan={selectedWarta.ringkasan}
                  detailLokasi={selectedWarta.lokasiNamaTempat || selectedWarta.alamatDukaTimika}
                  kontakPic={selectedWarta.kontakPanitiaWa || selectedWarta.kontakKeluargaWa}
                  slugOrId={selectedWarta.slug || selectedWarta.id}
                  variant="primary"
                  label="Siarkan ke WhatsApp"
                />
                <button
                  onClick={() => copyToClipboard(selectedWarta)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Salin Format Teks
                </button>
              </div>
              <button
                onClick={() => setSelectedWarta(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Buat / Edit Warta (Accessible Senior-Friendly) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-4 sm:p-7 shadow-2xl border border-slate-200 my-auto max-h-[94vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 sm:pb-4 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
                {editingWarta ? "Perbarui Warta Paguyuban" : "Tulis Kabar Paguyuban Baru"}
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingWarta(null);
                }}
                className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <FormWartaAccessible
              initialData={editingWarta}
              isModal={true}
              onCloseModal={() => {
                setIsCreateModalOpen(false);
                setEditingWarta(null);
              }}
              onSuccessCallback={(savedWarta) => {
                if (editingWarta) {
                  setWartaList((prev) =>
                    prev.map((w) => (w.id === savedWarta.id ? savedWarta : w))
                  );
                } else {
                  setWartaList((prev) => [savedWarta, ...prev]);
                }
                setIsCreateModalOpen(false);
                setEditingWarta(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Form Modal Buat & Edit Warta
function ModalFormWarta({
  editingWarta,
  onClose,
  onSuccess,
}: {
  editingWarta?: WartaPaguyuban | null;
  onClose: () => void;
  onSuccess: (warta: WartaPaguyuban) => void;
}) {
  const [kategori, setKategori] = useState<
    "duka_cita" | "suka_cita" | "agenda_kegiatan"
  >(editingWarta?.kategori || "agenda_kegiatan");

  const [judul, setJudul] = useState(editingWarta?.judul || "");
  const [slug, setSlug] = useState(editingWarta?.slug || "");
  const [ringkasan, setRingkasan] = useState(editingWarta?.ringkasan || "");
  const [kontenUtama, setKontenUtama] = useState(editingWarta?.kontenUtama || "");
  const [fotoUtamaUrl, setFotoUtamaUrl] = useState(editingWarta?.fotoUtamaUrl || "");
  const [statusTayang, setStatusTayang] = useState<
    "draft" | "published" | "archived"
  >(editingWarta?.statusTayang || "published");

  // Spesifik Kabar Duka
  const [namaAlmarhum, setNamaAlmarhum] = useState(editingWarta?.namaAlmarhum || "");
  const [waktuWafat, setWaktuWafat] = useState(
    editingWarta?.waktuWafat
      ? new Date(editingWarta.waktuWafat).toISOString().slice(0, 16)
      : ""
  );
  const [alamatDukaTimika, setAlamatDukaTimika] = useState(editingWarta?.alamatDukaTimika || "");
  const [kontakKeluargaWa, setKontakKeluargaWa] = useState(editingWarta?.kontakKeluargaWa || "");

  // Spesifik Agenda Kegiatan
  const [tanggalMulai, setTanggalMulai] = useState(
    editingWarta?.tanggalMulai
      ? new Date(editingWarta.tanggalMulai).toISOString().slice(0, 16)
      : ""
  );
  const [tanggalSelesai, setTanggalSelesai] = useState(
    editingWarta?.tanggalSelesai
      ? new Date(editingWarta.tanggalSelesai).toISOString().slice(0, 16)
      : ""
  );
  const [lokasiNamaTempat, setLokasiNamaTempat] = useState(editingWarta?.lokasiNamaTempat || "");
  const [lokasiMapsUrl, setLokasiMapsUrl] = useState(editingWarta?.lokasiMapsUrl || "");
  const [penyelenggaraSektor, setPenyelenggaraSektor] = useState(
    editingWarta?.penyelenggaraSektor || "Pengurus Pusat KKS Mimika"
  );
  const [isGratis, setIsGratis] = useState(
    editingWarta ? Number(editingWarta.biayaPendaftaran) === 0 : true
  );
  const [biayaPendaftaran, setBiayaPendaftaran] = useState(
    editingWarta?.biayaPendaftaran ? Number(editingWarta.biayaPendaftaran).toString() : "0"
  );
  const [kuotaPeserta, setKuotaPeserta] = useState(
    editingWarta?.kuotaPeserta ? editingWarta.kuotaPeserta.toString() : ""
  );
  const [linkPendaftaranExternal, setLinkPendaftaranExternal] = useState(
    editingWarta?.linkPendaftaranExternal || ""
  );
  const [kontakPanitiaWa, setKontakPanitiaWa] = useState(editingWarta?.kontakPanitiaWa || "");
  const [lampiranDokumenUrl, setLampiranDokumenUrl] = useState(
    editingWarta?.lampiranDokumenUrl || ""
  );

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill template duka cita
  const handleAutoFormatDuka = () => {
    if (!namaAlmarhum) {
      alert("Silakan isi nama almarhum/ah terlebih dahulu.");
      return;
    }
    const autoJudul = `Berita Duka: Berpulangnya Almarhum/ah ${namaAlmarhum}`;
    const autoRingkasan = `Innalillahi wa inna ilaihi raji'un. Telah berpulang ke Rahmatullah saudara kita ${namaAlmarhum} di Timika.`;
    const autoKonten = `Innalillahi wa inna ilaihi raji'un. Telah berpulang ke Rahmatullah saudara/keluarga kerukunan kita:

Nama: ${namaAlmarhum}
Waktu Berpulang: ${waktuWafat ? formatTanggal(waktuWafat) : "Hari ini di Timika"}
Rumah Duka: ${alamatDukaTimika || "Timika"}
Kontak Takziah Keluarga: ${kontakKeluargaWa || "-"}

Semoga Allah SWT mengampuni segala dosa almarhum/ah, melipatgandakan amal ibadahnya, dan menempatkan beliau di tempat terbaik di sisi-Nya. Kepada segenap keluarga yang ditinggalkan senantiasa diberi ketabahan dan keikhlasan.

Salipuri Temmadinging.`;

    setJudul(autoJudul);
    setRingkasan(autoRingkasan);
    setKontenUtama(autoKonten);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadImageAction(formData);
    setUploadingImage(false);

    if (res.success && res.url) {
      setFotoUtamaUrl(res.url);
    } else {
      alert(res.error || "Gagal mengunggah foto.");
    }
  };

  const handleDocFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadDocumentAction(formData);
    setUploadingDoc(false);

    if (res.success && res.url) {
      setLampiranDokumenUrl(res.url);
    } else {
      alert(res.error || "Gagal mengunggah dokumen PDF.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) {
      setError("Judul warta wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    const parsedBiaya = isGratis
      ? "0"
      : biayaPendaftaran.trim() !== ""
      ? biayaPendaftaran.trim()
      : "0";

    const parsedKuota = kuotaPeserta.trim() !== "" ? parseInt(kuotaPeserta, 10) : null;

    const payload: Partial<NewWartaPaguyuban> = {
      judul,
      slug: slug.trim() || undefined,
      kategori,
      ringkasan: ringkasan.trim() || "Warta resmi Kerukunan Keluarga Soppeng Mimika",
      kontenUtama: kontenUtama.trim() || "Informasi lengkap warta paguyuban.",
      fotoUtamaUrl: fotoUtamaUrl.trim() || null,
      statusTayang,
      namaAlmarhum: kategori === "duka_cita" ? namaAlmarhum.trim() || null : null,
      waktuWafat: kategori === "duka_cita" && waktuWafat ? new Date(waktuWafat) : null,
      alamatDukaTimika: kategori === "duka_cita" ? alamatDukaTimika.trim() || null : null,
      kontakKeluargaWa: kategori === "duka_cita" ? kontakKeluargaWa.trim() || null : null,
      tanggalMulai:
        kategori === "agenda_kegiatan" && tanggalMulai ? new Date(tanggalMulai) : null,
      tanggalSelesai:
        kategori === "agenda_kegiatan" && tanggalSelesai ? new Date(tanggalSelesai) : null,
      lokasiNamaTempat:
        kategori === "agenda_kegiatan" ? lokasiNamaTempat.trim() || null : null,
      lokasiMapsUrl:
        kategori === "agenda_kegiatan" ? lokasiMapsUrl.trim() || null : null,
      penyelenggaraSektor:
        kategori === "agenda_kegiatan" ? penyelenggaraSektor.trim() || null : null,
      biayaPendaftaran: kategori === "agenda_kegiatan" ? parsedBiaya : "0",
      kuotaPeserta: kategori === "agenda_kegiatan" ? parsedKuota : null,
      linkPendaftaranExternal:
        kategori === "agenda_kegiatan" ? linkPendaftaranExternal.trim() || null : null,
      kontakPanitiaWa:
        kategori === "agenda_kegiatan" || kategori === "suka_cita"
          ? kontakPanitiaWa.trim() || null
          : null,
      lampiranDokumenUrl: lampiranDokumenUrl.trim() || null,
    };

    let res;
    if (editingWarta) {
      res = await updateWarta(editingWarta.id, payload);
    } else {
      res = await createWarta(payload as NewWartaPaguyuban);
    }

    setLoading(false);

    if (res.success && res.data) {
      onSuccess(res.data);
    } else {
      setError(res.error || "Gagal menyimpan warta.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-elevated border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {editingWarta ? "Perbarui Warta Paguyuban" : "Buat Warta & Kabar Paguyuban"}
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
          {/* Kategori Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Kategori Warta *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setKategori("agenda_kegiatan")}
                className={`py-2 px-3 rounded-xl font-semibold border flex items-center justify-center gap-1.5 transition ${
                  kategori === "agenda_kegiatan"
                    ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Agenda Kegiatan
              </button>
              <button
                type="button"
                onClick={() => setKategori("duka_cita")}
                className={`py-2 px-3 rounded-xl font-semibold border flex items-center justify-center gap-1.5 transition ${
                  kategori === "duka_cita"
                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Duka Cita (Lelayu)
              </button>
              <button
                type="button"
                onClick={() => setKategori("suka_cita")}
                className={`py-2 px-3 rounded-xl font-semibold border flex items-center justify-center gap-1.5 transition ${
                  kategori === "suka_cita"
                    ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                Suka Cita
              </button>
            </div>
          </div>

          {/* Banner Photo Upload */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block font-semibold text-slate-700">
              Foto Sampul / Banner Kegiatan (Opsional)
            </label>
            <div className="flex items-center gap-3">
              {fotoUtamaUrl ? (
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 relative group shrink-0">
                  <img
                    src={fotoUtamaUrl}
                    alt="Sampul"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFotoUtamaUrl("")}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-16 rounded-lg border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px]">16:9</span>
                </div>
              )}

              <div className="flex-1 space-y-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5 text-xs transition"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploadingImage ? "Mengunggah..." : "Unggah Foto Banner"}</span>
                </button>
                <p className="text-[11px] text-slate-400">
                  Format JPG, PNG, atau WebP. Maks 3MB.
                </p>
              </div>
            </div>
          </div>

          {/* Form Khusus Warta Duka */}
          {kategori === "duka_cita" && (
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Format Cepat Berita Duka Lelayu
                </span>
                <button
                  type="button"
                  onClick={handleAutoFormatDuka}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] shadow-xs"
                >
                  ⚡ Auto-Format Teks Duka
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Nama Almarhum/Almarhumah:
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Bapak Ambo Dalle"
                    value={namaAlmarhum}
                    onChange={(e) => setNamaAlmarhum(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Waktu Berpulang:
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Senin subuh, 04:30 WIT di RSMM"
                    value={waktuWafat}
                    onChange={(e) => setWaktuWafat(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Alamat Rumah Duka di Timika:
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Jl. Hasanuddin Jalur 2, Timika"
                    value={alamatDukaTimika}
                    onChange={(e) => setAlamatDukaTimika(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Kontak WA Keluarga / Takziah:
                  </label>
                  <input
                    type="text"
                    placeholder="0812xxxxxxxx"
                    value={kontakKeluargaWa}
                    onChange={(e) => setKontakKeluargaWa(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-lg focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Khusus Agenda Kegiatan */}
          {kategori === "agenda_kegiatan" && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Rincian Operasional Kegiatan & Pendaftaran
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Waktu Mulai:
                  </label>
                  <input
                    type="datetime-local"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Waktu Selesai (Opsional):
                  </label>
                  <input
                    type="datetime-local"
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Nama Lokasi / Gedung:
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Gedung Tongkonan / Aula KKS SP2"
                    value={lokasiNamaTempat}
                    onChange={(e) => setLokasiNamaTempat(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Link Google Maps:
                  </label>
                  <input
                    type="url"
                    placeholder="https://maps.app.goo.gl/..."
                    value={lokasiMapsUrl}
                    onChange={(e) => setLokasiMapsUrl(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Penyelenggara / Sektor:
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Divisi Olahraga KKS Mimika"
                    value={penyelenggaraSektor}
                    onChange={(e) => setPenyelenggaraSektor(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Narahubung Panitia (WA):
                  </label>
                  <input
                    type="text"
                    placeholder="0812xxxxxxxx"
                    value={kontakPanitiaWa}
                    onChange={(e) => setKontakPanitiaWa(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Biaya & Kuota */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60">
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-slate-700 font-medium">Biaya Registrasi:</label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isGratis}
                        onChange={(e) => {
                          setIsGratis(e.target.checked);
                          if (e.target.checked) setBiayaPendaftaran("0");
                        }}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-[11px] font-semibold text-amber-900">
                        Gratis / Free
                      </span>
                    </label>
                  </div>
                  {!isGratis && (
                    <input
                      type="number"
                      placeholder="Rp (misal: 50000)"
                      value={biayaPendaftaran}
                      onChange={(e) => setBiayaPendaftaran(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg focus:outline-hidden"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Batas Kuota Peserta (Opsional):
                  </label>
                  <input
                    type="number"
                    placeholder="Misal: 64 (kosongkan jika tanpa batas)"
                    value={kuotaPeserta}
                    onChange={(e) => setKuotaPeserta(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              {/* External Link & PDF Attachment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60">
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Link Pendaftaran External (Google Form):
                  </label>
                  <input
                    type="url"
                    placeholder="https://forms.gle/..."
                    value={linkPendaftaranExternal}
                    onChange={(e) => setLinkPendaftaranExternal(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Lampiran Panduan / Juknis (PDF):
                  </label>
                  <input
                    ref={docInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleDocFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={uploadingDoc}
                      onClick={() => docInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold rounded-lg flex items-center gap-1 text-[11px] transition"
                    >
                      {uploadingDoc ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Upload className="w-3 h-3" />
                      )}
                      <span>{lampiranDokumenUrl ? "Ganti PDF" : "Unggah PDF"}</span>
                    </button>
                    {lampiranDokumenUrl && (
                      <span className="text-[11px] text-emerald-700 font-medium truncate flex-1">
                        ✓ File terlampir
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Judul & Ringkasan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Judul Warta *
            </label>
            <input
              required
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Judul pengumuman warta paguyuban..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-hidden text-sm font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Custom Slug URL (Opsional)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="turnamen-domino-kks-cup-2026 (kosongkan untuk auto-generate)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-hidden font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ringkasan Singkat (Muncul di kartu berita & preview WA)
            </label>
            <input
              type="text"
              value={ringkasan}
              onChange={(e) => setRingkasan(e.target.value)}
              placeholder="Ikhtisar singkat berita untuk notifikasi..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Konten / Penjelasan Lengkap Warta
            </label>
            <textarea
              rows={5}
              value={kontenUtama}
              onChange={(e) => setKontenUtama(e.target.value)}
              placeholder="Rincian informasi acara, peraturan lomba, susunan acara, fardhu kifayah, atau pesan takziah..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Status Penayangan
            </label>
            <select
              value={statusTayang}
              onChange={(e) => setStatusTayang(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-hidden"
            >
              <option value="published">Langsung Tayangkan (Published)</option>
              <option value="draft">Simpan sebagai Draf (Draft)</option>
              <option value="archived">Diarsipkan (Archived)</option>
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
              disabled={loading || uploadingImage || uploadingDoc}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm disabled:opacity-50"
            >
              {loading
                ? "Menyimpan..."
                : editingWarta
                ? "Simpan Perubahan"
                : "Publikasikan Warta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
