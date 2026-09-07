"use client";

import { useState, useTransition } from "react";
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
} from "lucide-react";
import { formatTanggal, formatWhatsAppUrl } from "@/lib/utils";
import {
  createWarta,
  updateWartaStatus,
  deleteWarta,
} from "@/app/actions/warta";
import { WartaBroadcastButton } from "@/components/modules/WartaBroadcastButton";
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
    if (w.kategori === "duka_cita") {
      return `*INNALILLAHI WA INNA ILAIHI RAJI'UN*\n*WARTA LELAYU KKS KABUPATEN MIMIKA*\n\n${w.judul}\n\n${w.ringkasan || ""}\n\n📍 *Lokasi/Rumah Duka:* ${w.lokasiAcara || "Timika"}\n🗓️ *Waktu/Tanggal:* ${formatTanggal(w.tanggalPeristiwa)}\n📞 *Kontak Keluarga/Takziah:* ${w.kontakDaruratWa || "-"}\n\nKeterangan Lengkap:\n${w.konten || ""}\n\n_Semoga almarhum/ah diampuni segala dosanya dan keluarga diberikan ketabahan. Salipuri Temmadinging._\n*Pengurus Kerukunan Keluarga Soppeng (KKS) Kab. Mimika*`;
    }
    return `*WARTA PAGUYUBAN KKS KABUPATEN MIMIKA*\n\n*${w.judul}*\n\n${w.ringkasan || ""}\n\n📍 *Lokasi:* ${w.lokasiAcara || "Timika"}\n🗓️ *Tanggal:* ${formatTanggal(w.tanggalPeristiwa)}\n📞 *Narahubung:* ${w.kontakDaruratWa || "-"}\n\n${w.konten || ""}\n\n*Pengurus KKS Kabupaten Mimika*`;
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
            Pusat publikasi berita lelayu duka cita, kabar suka cita, dan agenda
            silaturahmi warga Soppeng di Timika.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold text-sm transition shadow-md shadow-gold/25 flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Buat Warta Baru
        </button>
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
                ? "bg-sky-dark text-white shadow-xs"
                : "text-sky-dark hover:bg-sky-light"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Suka Cita ({wartaList.filter((w) => w.kategori === "suka_cita").length})
          </button>
          <button
            onClick={() => setActiveTab("agenda_kegiatan")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "agenda_kegiatan"
                ? "bg-amber-700 text-white shadow-xs"
                : "text-amber-800 hover:bg-amber-50"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Agenda Paguyuban (
            {wartaList.filter((w) => w.kategori === "agenda_kegiatan").length})
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-gold"
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
              Gunakan tombol "Buat Warta Baru" untuk mempublikasikan kabar kerukunan.
            </p>
          </div>
        ) : (
          filteredList.map((w) => {
            const isDuka = w.kategori === "duka_cita";
            const isSuka = w.kategori === "suka_cita";

            return (
              <div
                key={w.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs hover:shadow-card transition-all duration-200 relative overflow-hidden ${
                  isDuka
                    ? "border-l-4 border-l-siri border-slate-200/80"
                    : isSuka
                    ? "border-l-4 border-l-sky border-slate-200/80"
                    : "border-l-4 border-l-gold border-slate-200/80"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Content info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Category Badge */}
                      {isDuka && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-siri-light text-siri">
                          <AlertTriangle className="w-3 h-3" />
                          LELAYU / DUKA CITA
                        </span>
                      )}
                      {isSuka && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-light text-sky-dark">
                          <Heart className="w-3 h-3" />
                          SUKA CITA & AQIQAH
                        </span>
                      )}
                      {w.kategori === "agenda_kegiatan" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                          <Calendar className="w-3 h-3" />
                          AGENDA SILATURAHMI
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

                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {w.judul}
                    </h3>

                    {w.ringkasan && (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {w.ringkasan}
                      </p>
                    )}

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{w.lokasiAcara || "Timika"}</span>
                      </div>
                      {w.tanggalPeristiwa && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Peristiwa: {formatTanggal(w.tanggalPeristiwa)}</span>
                        </div>
                      )}
                      {w.kontakDaruratWa && (
                        <div className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>WA: {w.kontakDaruratWa}</span>
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
                      detailLokasi={w.lokasiAcara}
                      kontakPic={w.kontakDaruratWa}
                      slugOrId={w.id}
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
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-elevated border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
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

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Judul Warta</span>
                <span className="font-bold text-slate-900 text-base">
                  {selectedWarta.judul}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block">Kategori</span>
                  <span className="font-semibold text-slate-800 uppercase">
                    {selectedWarta.kategori.replace("_", " ")}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block">Tanggal Peristiwa</span>
                  <span className="font-semibold text-slate-800">
                    {formatTanggal(selectedWarta.tanggalPeristiwa)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-xs">
                <span className="text-slate-400 block">Lokasi / Alamat</span>
                <span className="font-medium text-slate-800">
                  {selectedWarta.lokasiAcara || "Timika"}
                </span>
              </div>

              {selectedWarta.kontakDaruratWa && (
                <div className="p-3 rounded-xl bg-slate-50 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block">Kontak Perwakilan</span>
                    <span className="font-mono text-slate-800">
                      {selectedWarta.kontakDaruratWa}
                    </span>
                  </div>
                  <a
                    href={formatWhatsAppUrl(selectedWarta.kontakDaruratWa)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    Hubungi
                  </a>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-700 block">
                  Konten / Isi Lengkap:
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedWarta.konten || selectedWarta.ringkasan || "Tidak ada konten rincian."}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <WartaBroadcastButton
                  judul={selectedWarta.judul}
                  kategori={selectedWarta.kategori}
                  ringkasan={selectedWarta.ringkasan}
                  detailLokasi={selectedWarta.lokasiAcara}
                  kontakPic={selectedWarta.kontakDaruratWa}
                  slugOrId={selectedWarta.id}
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

      {/* Modal Buat Warta Baru */}
      {isCreateModalOpen && (
        <ModalBuatWarta
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={(newWarta) => {
            setWartaList((prev) => [newWarta, ...prev]);
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// Subcomponent: Form Modal Buat Warta
function ModalBuatWarta({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (warta: WartaPaguyuban) => void;
}) {
  const [kategori, setKategori] = useState<
    "duka_cita" | "suka_cita" | "agenda_kegiatan"
  >("duka_cita");
  const [judul, setJudul] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [konten, setKonten] = useState("");
  const [lokasiAcara, setLokasiAcara] = useState("Timika");
  const [tanggalPeristiwa, setTanggalPeristiwa] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [kontakDaruratWa, setKontakDaruratWa] = useState("");
  const [statusTayang, setStatusTayang] = useState<
    "draft" | "published" | "archived"
  >("published");

  // Spesifik Kabar Duka
  const [namaAlmarhum, setNamaAlmarhum] = useState("");
  const [usiaAlmarhum, setUsiaAlmarhum] = useState("");
  const [rumahDukaTimika, setRumahDukaTimika] = useState("");
  const [pemakamanInfo, setPemakamanInfo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<WartaPaguyuban | null>(null);

  // Auto-fill template duka cita
  const handleAutoFormatDuka = () => {
    if (!namaAlmarhum) {
      alert("Silakan isi nama almarhum/ah terlebih dahulu.");
      return;
    }
    const autoJudul = `Berita Duka: Berpulangnya Almarhum/ah ${namaAlmarhum} ${
      usiaAlmarhum ? `(${usiaAlmarhum} Thn)` : ""
    }`;
    const autoRingkasan = `Innalillahi wa inna ilaihi raji'un. Telah berpulang ke Rahmatullah saudara kita ${namaAlmarhum} di Timika.`;
    const autoKonten = `Innalillahi wa inna ilaihi raji'un. Telah berpulang ke Rahmatullah saudara/keluarga kerukunan kita:
Nama: ${namaAlmarhum}
${usiaAlmarhum ? `Usia: ${usiaAlmarhum} Tahun\n` : ""}Rumah Duka: ${
      rumahDukaTimika || "Timika"
    }
Fardhu Kifayah / Pemakaman: ${pemakamanInfo || "TPU Timika"}
Kontak Takziah: ${kontakDaruratWa || "-"}

Semoga Allah SWT mengampuni segala dosa beliau, melipatgandakan amal ibadahnya, dan menempatkan beliau di tempat terbaik di sisi-Nya. Kepada segenap keluarga yang ditinggalkan senantiasa diberi ketabahan dan keikhlasan.`;

    setJudul(autoJudul);
    setRingkasan(autoRingkasan);
    setKonten(autoKonten);
    if (rumahDukaTimika) setLokasiAcara(`Rumah Duka: ${rumahDukaTimika}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) {
      setError("Judul warta wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: NewWartaPaguyuban = {
      judul,
      kategori,
      ringkasan,
      konten,
      lokasiAcara,
      tanggalPeristiwa,
      kontakDaruratWa,
      statusTayang,
    };

    const res = await createWarta(payload);
    setLoading(false);

    if (res.success && res.data) {
      setCreatedResult(res.data);
    } else {
      setError(res.error || "Gagal menyimpan warta.");
    }
  };

  // If created successfully, show broadcast prompt modal
  if (createdResult) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-elevated border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                Warta Berhasil Diterbitkan!
              </h3>
            </div>
            <button
              onClick={() => {
                onSuccess(createdResult);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
              {createdResult.kategori.replace("_", " ")}
            </span>
            <h4 className="font-bold text-slate-900 text-sm leading-snug">
              {createdResult.judul}
            </h4>
            {createdResult.ringkasan && (
              <p className="text-xs text-slate-600 line-clamp-2">
                {createdResult.ringkasan}
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
            <p className="font-semibold text-emerald-950 flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-emerald-600 shrink-0" />
              Siarkan langsung ke Saluran / Grup WhatsApp Paguyuban
            </p>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Format pesan warta resmi dengan tautan portal telah disiapkan. Klik tombol di bawah untuk membuka WhatsApp Web atau WhatsApp Mobile secara instan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => onSuccess(createdResult)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              Selesai & Tutup
            </button>
            <WartaBroadcastButton
              judul={createdResult.judul}
              kategori={createdResult.kategori}
              ringkasan={createdResult.ringkasan}
              detailLokasi={createdResult.lokasiAcara}
              kontakPic={createdResult.kontakDaruratWa}
              slugOrId={createdResult.id}
              variant="primary"
              label="Siarkan Sekarang ke WhatsApp"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-elevated border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              Buat Warta & Kabar Paguyuban
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
                    ? "bg-sky-dark text-white border-sky-dark shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                Suka Cita
              </button>
              <button
                type="button"
                onClick={() => setKategori("agenda_kegiatan")}
                className={`py-2 px-3 rounded-xl font-semibold border flex items-center justify-center gap-1.5 transition ${
                  kategori === "agenda_kegiatan"
                    ? "bg-amber-700 text-white border-amber-700 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Agenda Pertemuan
              </button>
            </div>
          </div>

          {/* Form Khusus Warta Duka */}
          {kategori === "duka_cita" && (
            <div className="p-4 rounded-xl bg-red-50/70 border border-red-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-siri" />
                  Format Cepat Berita Duka Lelayu
                </span>
                <button
                  type="button"
                  onClick={handleAutoFormatDuka}
                  className="px-2.5 py-1 rounded-lg bg-siri hover:bg-siri-dark text-white font-semibold text-[11px] shadow-xs"
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
                    placeholder="Misal: Bapak Ambo Dalle bin Pettasiri"
                    value={namaAlmarhum}
                    onChange={(e) => setNamaAlmarhum(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-red-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Usia (Tahun):
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: 62"
                    value={usiaAlmarhum}
                    onChange={(e) => setUsiaAlmarhum(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-red-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Alamat Rumah Duka di Timika:
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Jl. Hasanuddin Jalur 2, Timika"
                    value={rumahDukaTimika}
                    onChange={(e) => setRumahDukaTimika(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-red-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-0.5 font-medium">
                    Rencana Pemakaman:
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: TPU SP 1 Timika bakda Ashar"
                    value={pemakamanInfo}
                    onChange={(e) => setPemakamanInfo(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-red-200 rounded-lg focus:outline-hidden"
                  />
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
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden text-sm font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ringkasan Singkat (Muncul di kartu berita)
            </label>
            <input
              type="text"
              value={ringkasan}
              onChange={(e) => setRingkasan(e.target.value)}
              placeholder="Ikhtisar singkat berita untuk notifikasi..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lokasi Acara / Wilayah
              </label>
              <input
                type="text"
                value={lokasiAcara}
                onChange={(e) => setLokasiAcara(e.target.value)}
                placeholder="Misal: Aula KKS Timika / SP 2"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Peristiwa
              </label>
              <input
                type="date"
                value={tanggalPeristiwa}
                onChange={(e) => setTanggalPeristiwa(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kontak Darurat / Narahubung WA
              </label>
              <input
                type="text"
                value={kontakDaruratWa}
                onChange={(e) => setKontakDaruratWa(e.target.value)}
                placeholder="62812xxxxxxx"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Konten / Penjelasan Lengkap Warta
            </label>
            <textarea
              rows={5}
              value={konten}
              onChange={(e) => setKonten(e.target.value)}
              placeholder="Rincian informasi acara, tata tertib, fardhu kifayah, atau pesan takziah..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Status Penayangan Awal
            </label>
            <select
              value={statusTayang}
              onChange={(e) => setStatusTayang(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-hidden"
            >
              <option value="published">Langsung Tayangkan (Published)</option>
              <option value="draft">Simpan sebagai Draf (Draft)</option>
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
              {loading ? "Menyimpan..." : "Publikasikan Warta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
