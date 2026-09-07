"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Heart,
  Calendar,
  Upload,
  CheckCircle2,
  Trash2,
  ImageIcon,
  FileText,
  HelpCircle,
  Clock,
  MapPin,
  Phone,
  Trophy,
  Loader2,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { createWarta, updateWarta, createWartaAsset } from "@/app/actions/warta";
import { uploadFileClient } from "@/lib/upload-client";
import type { WartaPaguyuban, NewWartaPaguyuban } from "@repo/database/schema";

interface Props {
  initialData?: WartaPaguyuban | null;
  onSuccessRedirect?: string;
  isModal?: boolean;
  onCloseModal?: () => void;
  onSuccessCallback?: (w: WartaPaguyuban) => void;
}

export function FormWartaAccessible({
  initialData,
  onSuccessRedirect = "/warta",
  isModal = false,
  onCloseModal,
  onSuccessCallback,
}: Props) {
  const router = useRouter();

  // 1. Langkah 1: Kategori Utama
  const [kategori, setKategori] = useState<
    "duka_cita" | "suka_cita" | "agenda_kegiatan"
  >(initialData?.kategori || "agenda_kegiatan");

  // Sub Jenis Agenda jika agenda_kegiatan
  const [subJenisAgenda, setSubJenisAgenda] = useState<
    "turnamen_olahraga" | "pertemuan_biasa"
  >(
    (initialData?.subJenisAgenda as "turnamen_olahraga" | "pertemuan_biasa") ||
      "turnamen_olahraga"
  );

  // Status Pendaftaran Switch
  const [isPendaftaranBuka, setIsPendaftaranBuka] = useState(
    initialData?.statusPendaftaran !== "tutup"
  );

  // Kolom Umum
  const [judul, setJudul] = useState(initialData?.judul || "");
  const [ringkasan, setRingkasan] = useState(initialData?.ringkasan || "");
  const [kontenUtama, setKontenUtama] = useState(initialData?.kontenUtama || "");
  const [fotoUtamaUrl, setFotoUtamaUrl] = useState(initialData?.fotoUtamaUrl || "");

  // Kolom Duka Cita (Lelayu)
  const [namaAlmarhum, setNamaAlmarhum] = useState(initialData?.namaAlmarhum || "");
  const [waktuWafat, setWaktuWafat] = useState(
    initialData?.waktuWafat
      ? new Date(initialData.waktuWafat).toISOString().slice(0, 16)
      : ""
  );
  const [alamatDukaTimika, setAlamatDukaTimika] = useState(
    initialData?.alamatDukaTimika || ""
  );
  const [kontakKeluargaWa, setKontakKeluargaWa] = useState(
    initialData?.kontakKeluargaWa || ""
  );

  // Kolom Sukacita
  const [namaKeluargaSuka, setNamaKeluargaSuka] = useState(
    initialData?.namaAlmarhum || "" // Reuse nama pemangku hajat
  );
  const [jenisAcaraSuka, setJenisAcaraSuka] = useState("Pernikahan Warga");
  const [tanggalAcaraSuka, setTanggalAcaraSuka] = useState(
    initialData?.tanggalMulai
      ? new Date(initialData.tanggalMulai).toISOString().slice(0, 10)
      : ""
  );
  const [lokasiAcaraSuka, setLokasiAcaraSuka] = useState(
    initialData?.lokasiNamaTempat || ""
  );

  // Kolom Agenda / Turnamen Olahraga
  const [tanggalMulai, setTanggalMulai] = useState(
    initialData?.tanggalMulai
      ? new Date(initialData.tanggalMulai).toISOString().slice(0, 16)
      : ""
  );
  const [tanggalSelesai, setTanggalSelesai] = useState(
    editingDate(initialData?.tanggalSelesai)
  );
  const [lokasiGedung, setLokasiGedung] = useState(
    initialData?.lokasiGedung || initialData?.lokasiNamaTempat || ""
  );
  const [linkLokasiMaps, setLinkLokasiMaps] = useState(
    initialData?.linkLokasiMaps || initialData?.lokasiMapsUrl || ""
  );
  const [penanggungJawabNama, setPenanggungJawabNama] = useState(
    initialData?.penanggungJawabNama || initialData?.penyelenggaraSektor || ""
  );
  const [penanggungJawabWa, setPenanggungJawabWa] = useState(
    initialData?.penanggungJawabWa || initialData?.kontakPanitiaWa || ""
  );
  const [isGratis, setIsGratis] = useState(
    initialData ? Number(initialData.biayaPendaftaran) === 0 : true
  );
  const [biayaPendaftaran, setBiayaPendaftaran] = useState(
    initialData?.biayaPendaftaran
      ? Number(initialData.biayaPendaftaran).toString()
      : "0"
  );
  const [totalHadiahPembinaan, setTotalHadiahPembinaan] = useState(
    initialData?.totalHadiahPembinaan || ""
  );
  const [lampiranDokumenUrl, setLampiranDokumenUrl] = useState(
    initialData?.lampiranDokumenUrl || ""
  );
  const [bracketImageUrl, setBracketImageUrl] = useState("");

  // UI state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingBracket, setUploadingBracket] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const bracketInputRef = useRef<HTMLInputElement>(null);

  function editingDate(d?: Date | null) {
    return d ? new Date(d).toISOString().slice(0, 16) : "";
  }

  // Upload Foto Utama
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage(null);

    const res = await uploadFileClient(file, "warta", false);
    setUploadingImage(false);

    if (res.success && res.url) {
      setFotoUtamaUrl(res.url);
    } else {
      alert(res.error || "Gagal mengunggah foto.");
    }
  };

  // Upload Lampiran PDF
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    setErrorMessage(null);

    const res = await uploadFileClient(file, "documents", true);
    setUploadingDoc(false);

    if (res.success && res.url) {
      setLampiranDokumenUrl(res.url);
    } else {
      alert(res.error || "Gagal mengunggah berkas PDF.");
    }
  };

  // Upload Bagan / Brosur Turnamen (record to warta_assets)
  const handleBracketUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBracket(true);
    setErrorMessage(null);

    const res = await uploadFileClient(file, "turnamen-bracket", false);
    setUploadingBracket(false);

    if (res.success && res.url) {
      setBracketImageUrl(res.url);
    } else {
      alert(res.error || "Gagal mengunggah gambar bagan turnamen.");
    }
  };

  // Form Submission
  const handleFinalSubmit = async () => {
    if (!judul.trim()) {
      setErrorMessage("Silakan isi Judul Kabar terlebih dahulu.");
      setShowConfirmModal(false);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Susun ringkasan & konten otomatis jika belum diisi
      let finalRingkasan = ringkasan.trim();
      let finalKonten = kontenUtama.trim();

      if (kategori === "duka_cita") {
        if (!finalRingkasan) {
          finalRingkasan = `Innalillahi wa inna ilaihi raji'un. Telah berpulang ke Rahmatullah saudara kita ${namaAlmarhum || ""} di Timika.`;
        }
        if (!finalKonten) {
          finalKonten = `Innalillahi wa inna ilaihi raji'un. Telah berpulang ke Rahmatullah saudara/keluarga kerukunan kita:
Nama: ${namaAlmarhum || "-"}
Waktu Berpulang: ${waktuWafat ? new Date(waktuWafat).toLocaleString("id-ID") : "Hari ini di Timika"}
Alamat Rumah Duka: ${alamatDukaTimika || "Timika"}
Kontak Takziah Keluarga: ${kontakKeluargaWa || "-"}

Semoga amal ibadah almarhum/ah dilipatgandakan dan keluarga yang ditinggalkan senantiasa diberi ketabahan.
Salipuri Temmadinging.`;
        }
      } else if (kategori === "suka_cita") {
        if (!finalRingkasan) {
          finalRingkasan = `Kabar gembira dan syukuran keluarga ${namaKeluargaSuka || ""} dalam rangka ${jenisAcaraSuka} di Timika.`;
        }
        if (!finalKonten) {
          finalKonten = `Keluarga besar Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika turut berbahagia atas terselenggaranya ${jenisAcaraSuka} keluarga ${namaKeluargaSuka || ""}.\n\nLokasi Acara: ${lokasiAcaraSuka || "Timika"}\nTanggal: ${tanggalAcaraSuka || "-"}\n\nSemoga senantiasa dilimpahi keberkahan dan kebahagiaan.`;
        }
      } else {
        if (!finalRingkasan) {
          finalRingkasan = `Pengumuman resmi agenda kegiatan paguyuban KKS Kabupaten Mimika: ${judul}.`;
        }
        if (!finalKonten) {
          finalKonten = `Pemberitahuan kepada seluruh bapak/ibu warga Kerukunan Keluarga Soppeng di Kabupaten Mimika terkait pelaksanaan kegiatan:\n\nNama Kegiatan: ${judul}\nTempat: ${lokasiGedung || "Timika"}\nWaktu: ${tanggalMulai ? new Date(tanggalMulai).toLocaleString("id-ID") : "-"}\nNarahubung: ${penanggungJawabWa || "-"}`;
        }
      }

      const parsedBiaya = isGratis
        ? "0"
        : biayaPendaftaran.trim() !== ""
        ? biayaPendaftaran.trim()
        : "0";

      const payload: Partial<NewWartaPaguyuban> = {
        judul: judul.trim(),
        kategori,
        ringkasan: finalRingkasan,
        kontenUtama: finalKonten,
        fotoUtamaUrl: fotoUtamaUrl.trim() || null,
        statusTayang: "published",

        // Kolom Duka
        namaAlmarhum: kategori === "duka_cita" ? namaAlmarhum.trim() || null : null,
        waktuWafat:
          kategori === "duka_cita" && waktuWafat ? new Date(waktuWafat) : null,
        alamatDukaTimika:
          kategori === "duka_cita" ? alamatDukaTimika.trim() || null : null,
        kontakKeluargaWa:
          kategori === "duka_cita" ? kontakKeluargaWa.trim() || null : null,

        // Kolom Agenda / Turnamen
        subJenisAgenda: kategori === "agenda_kegiatan" ? subJenisAgenda : null,
        namaKegiatan: kategori === "agenda_kegiatan" ? judul.trim() : null,
        tanggalMulai:
          kategori === "agenda_kegiatan" && tanggalMulai
            ? new Date(tanggalMulai)
            : kategori === "suka_cita" && tanggalAcaraSuka
            ? new Date(tanggalAcaraSuka)
            : null,
        tanggalSelesai:
          kategori === "agenda_kegiatan" && tanggalSelesai
            ? new Date(tanggalSelesai)
            : null,
        lokasiNamaTempat:
          kategori === "agenda_kegiatan"
            ? lokasiGedung.trim() || null
            : kategori === "suka_cita"
            ? lokasiAcaraSuka.trim() || null
            : null,
        lokasiGedung:
          kategori === "agenda_kegiatan" ? lokasiGedung.trim() || null : null,
        lokasiMapsUrl:
          kategori === "agenda_kegiatan" ? linkLokasiMaps.trim() || null : null,
        linkLokasiMaps:
          kategori === "agenda_kegiatan" ? linkLokasiMaps.trim() || null : null,
        penyelenggaraSektor:
          kategori === "agenda_kegiatan"
            ? penanggungJawabNama.trim() || null
            : null,
        penanggungJawabNama:
          kategori === "agenda_kegiatan"
            ? penanggungJawabNama.trim() || null
            : null,
        penanggungJawabWa:
          kategori === "agenda_kegiatan" ? penanggungJawabWa.trim() || null : null,
        kontakPanitiaWa:
          kategori === "agenda_kegiatan" ? penanggungJawabWa.trim() || null : null,
        biayaPendaftaran: kategori === "agenda_kegiatan" ? parsedBiaya : "0",
        totalHadiahPembinaan:
          kategori === "agenda_kegiatan" && subJenisAgenda === "turnamen_olahraga"
            ? totalHadiahPembinaan.trim() || null
            : null,
        statusPendaftaran: isPendaftaranBuka ? "buka" : "tutup",
        lampiranDokumenUrl: lampiranDokumenUrl.trim() || null,
      };

      let res;
      if (initialData?.id) {
        res = await updateWarta(initialData.id, payload);
      } else {
        res = await createWarta(payload as NewWartaPaguyuban);
      }

      if (res.success && res.data) {
        // Jika ada bagan pertandingan, rekam ke warta_assets
        if (bracketImageUrl) {
          await createWartaAsset({
            wartaId: res.data.id,
            fileUrl: bracketImageUrl,
            fileName: "Bagan Pertandingan Turnamen",
            fileType: "bracket_image",
            keterangan: `Bagan resmi untuk ${res.data.judul}`,
          });
        }

        if (onSuccessCallback) {
          onSuccessCallback(res.data);
        } else {
          router.push(onSuccessRedirect);
          router.refresh();
        }
      } else {
        setErrorMessage(res.error || "Gagal menyimpan warta.");
        setShowConfirmModal(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan sistem.");
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-base font-medium flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* LANGKAH 1: PILIH JENIS KABAR (3 KARTU BESAR & MUDAH DITEKAN) */}
      {/* ============================================================ */}
      <section className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
            1
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Langkah 1: Pilih Jenis Kabar yang Ingin Diumumkan
            </h2>
            <p className="text-sm text-slate-500">
              Sentuh atau klik salah satu kartu besar di bawah ini.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Kartu 1: Kabar Duka */}
          <button
            type="button"
            onClick={() => setKategori("duka_cita")}
            className={`min-h-[96px] p-5 rounded-2xl border-3 text-left transition-all flex items-start gap-4 ${
              kategori === "duka_cita"
                ? "border-rose-600 bg-rose-50/80 ring-4 ring-rose-600/15 shadow-md"
                : "border-slate-200 hover:border-rose-300 bg-white"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                kategori === "duka_cita"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-lg font-bold text-slate-900">
                Kabar Duka (Lelayu)
              </span>
              <span className="text-xs text-slate-600 leading-snug block mt-0.5">
                Kabar berpulangnya warga, rumah duka di Timika, & kontak takziah.
              </span>
            </div>
          </button>

          {/* Kartu 2: Kabar Sukacita */}
          <button
            type="button"
            onClick={() => setKategori("suka_cita")}
            className={`min-h-[96px] p-5 rounded-2xl border-3 text-left transition-all flex items-start gap-4 ${
              kategori === "suka_cita"
                ? "border-emerald-600 bg-emerald-50/80 ring-4 ring-emerald-600/15 shadow-md"
                : "border-slate-200 hover:border-emerald-300 bg-white"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                kategori === "suka_cita"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-lg font-bold text-slate-900">
                Kabar Sukacita / Syukuran
              </span>
              <span className="text-xs text-slate-600 leading-snug block mt-0.5">
                Pernikahan, kelahiran bayi (tasmiyah), dan prestasi pemuda.
              </span>
            </div>
          </button>

          {/* Kartu 3: Agenda Kegiatan / Turnamen */}
          <button
            type="button"
            onClick={() => setKategori("agenda_kegiatan")}
            className={`min-h-[96px] p-5 rounded-2xl border-3 text-left transition-all flex items-start gap-4 ${
              kategori === "agenda_kegiatan"
                ? "border-blue-600 bg-blue-50/80 ring-4 ring-blue-600/15 shadow-md"
                : "border-slate-200 hover:border-blue-300 bg-white"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                kategori === "agenda_kegiatan"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-lg font-bold text-slate-900">
                Agenda / Kegiatan / Berita
              </span>
              <span className="text-xs text-slate-600 leading-snug block mt-0.5">
                Turnamen domino, musyawarah, pertemuan bulanan, atau berita warga.
              </span>
            </div>
          </button>
        </div>

        {/* Input Judul Utama (Lega & Jelas) */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <label className="block text-base sm:text-lg font-bold text-slate-900">
            Judul Kabar / Nama Pengumuman *
          </label>
          <input
            type="text"
            required
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder={
              kategori === "duka_cita"
                ? "Contoh: Telah Berpulang ke Rahmatullah Bapak H. Ambo Dalle"
                : kategori === "suka_cita"
                ? "Contoh: Syukuran Tasmiyah & Aqiqah Ananda Latemmamala di SP3"
                : "Contoh: Turnamen Domino Semi-Open KKS Cup 2026 Se-Mimika"
            }
            className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-300 focus:border-amber-500 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium transition"
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* LANGKAH 2: FORMULIR DINAMIS SESUAI KATEGORI (HANYA KOLOM WAJIB) */}
      {/* ============================================================ */}
      <section className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
            2
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Langkah 2: Lengkapi Rincian Informasi
            </h2>
            <p className="text-sm text-slate-500">
              Kolom di bawah telah disesuaikan secara otomatis agar mudah diisi.
            </p>
          </div>
        </div>

        {/* KONDISI 1: KABAR DUKA CITA (4 Kolom Saja) */}
        {kategori === "duka_cita" && (
          <div className="p-6 rounded-2xl bg-rose-50/70 border-2 border-rose-200 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Kolom Wajib Berita Duka (Lelayu)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-base font-bold text-slate-900">
                  Nama Almarhum / Almarhumah *
                </label>
                <input
                  type="text"
                  value={namaAlmarhum}
                  onChange={(e) => setNamaAlmarhum(e.target.value)}
                  placeholder="Contoh: Bapak Ambo Dalle"
                  className="w-full h-14 px-4 bg-white border-2 border-rose-300 focus:border-rose-600 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-slate-900">
                  Waktu Berpulang (Tanggal & Jam)
                </label>
                <input
                  type="datetime-local"
                  value={waktuWafat}
                  onChange={(e) => setWaktuWafat(e.target.value)}
                  className="w-full h-14 px-4 bg-white border-2 border-rose-300 focus:border-rose-600 rounded-xl text-base text-slate-900 focus:outline-hidden font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-slate-900">
                  Alamat Rumah Duka di Timika *
                </label>
                <input
                  type="text"
                  value={alamatDukaTimika}
                  onChange={(e) => setAlamatDukaTimika(e.target.value)}
                  placeholder="Contoh: Jl. Hasanuddin Jalur 2 (Dekat Masjid Al-Hidayah)"
                  className="w-full h-14 px-4 bg-white border-2 border-rose-300 focus:border-rose-600 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-slate-900">
                  Nomor WhatsApp Keluarga untuk Takziah *
                </label>
                <input
                  type="text"
                  value={kontakKeluargaWa}
                  onChange={(e) => setKontakKeluargaWa(e.target.value)}
                  placeholder="Contoh: 081248011234"
                  className="w-full h-14 px-4 bg-white border-2 border-rose-300 focus:border-rose-600 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-mono font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* KONDISI 2: KABAR SUKACITA / SYUKURAN */}
        {kategori === "suka_cita" && (
          <div className="p-6 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
              <Heart className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Rincian Kabar Syukuran / Prestasi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-base font-bold text-slate-900">
                  Nama Warga / Keluarga Pemangku Hajat *
                </label>
                <input
                  type="text"
                  value={namaKeluargaSuka}
                  onChange={(e) => setNamaKeluargaSuka(e.target.value)}
                  placeholder="Contoh: Keluarga Bapak Baharuddin Latif"
                  className="w-full h-14 px-4 bg-white border-2 border-emerald-300 focus:border-emerald-600 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-slate-900">
                  Jenis Acara
                </label>
                <select
                  value={jenisAcaraSuka}
                  onChange={(e) => setJenisAcaraSuka(e.target.value)}
                  className="w-full h-14 px-4 bg-white border-2 border-emerald-300 focus:border-emerald-600 rounded-xl text-base text-slate-900 focus:outline-hidden font-medium"
                >
                  <option value="Pernikahan Warga">Pernikahan / Ijab Kabul</option>
                  <option value="Aqiqah & Tasmiyah">Kelahiran / Aqiqah (Tasmiyah)</option>
                  <option value="Prestasi & Penghargaan">Prestasi Belajar / Olahraga</option>
                  <option value="Syukuran Rumah / Toko">Syukuran Rumah Baru / Gerai Usaha</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-slate-900">
                  Tanggal Acara
                </label>
                <input
                  type="date"
                  value={tanggalAcaraSuka}
                  onChange={(e) => setTanggalAcaraSuka(e.target.value)}
                  className="w-full h-14 px-4 bg-white border-2 border-emerald-300 focus:border-emerald-600 rounded-xl text-base text-slate-900 focus:outline-hidden font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-slate-900">
                  Lokasi / Alamat Acara di Timika
                </label>
                <input
                  type="text"
                  value={lokasiAcaraSuka}
                  onChange={(e) => setLokasiAcaraSuka(e.target.value)}
                  placeholder="Contoh: Gedung Tongkonan / Kediaman SP3 Jalur Rajawali"
                  className="w-full h-14 px-4 bg-white border-2 border-emerald-300 focus:border-emerald-600 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* KONDISI 3: AGENDA / KEGIATAN KOMPLEKS & TURNAMEN OLAHRAGA */}
        {kategori === "agenda_kegiatan" && (
          <div className="space-y-6">
            {/* Sub-Pilihan Agenda */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-base font-bold text-slate-800">
                Pilih Format Kegiatan:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSubJenisAgenda("turnamen_olahraga")}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                    subJenisAgenda === "turnamen_olahraga"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  🏆 Turnamen Olahraga (Domino/Futsal/Voli)
                </button>
                <button
                  type="button"
                  onClick={() => setSubJenisAgenda("pertemuan_biasa")}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                    subJenisAgenda === "pertemuan_biasa"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  📅 Pertemuan / Rapat / Berita Biasa
                </button>
              </div>
            </div>

            {/* Rincian Tempat & Jadwal */}
            <div className="p-6 rounded-2xl bg-blue-50/70 border-2 border-blue-200 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-base">
                <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Waktu Pelaksanaan & Tempat Acara</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-base font-bold text-slate-900">
                    Tanggal & Jam Mulai *
                  </label>
                  <input
                    type="datetime-local"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full h-14 px-4 bg-white border-2 border-blue-300 focus:border-blue-600 rounded-xl text-base text-slate-900 focus:outline-hidden font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-base font-bold text-slate-900">
                    Tanggal Selesai (Opsional)
                  </label>
                  <input
                    type="datetime-local"
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="w-full h-14 px-4 bg-white border-2 border-blue-300 focus:border-blue-600 rounded-xl text-base text-slate-900 focus:outline-hidden font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-base font-bold text-slate-900">
                    Nama Lokasi / Gedung di Timika *
                  </label>
                  <input
                    type="text"
                    value={lokasiGedung}
                    onChange={(e) => setLokasiGedung(e.target.value)}
                    placeholder="Contoh: Gedung Tongkonan / Balai KKS SP2"
                    className="w-full h-14 px-4 bg-white border-2 border-blue-300 focus:border-blue-600 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-base font-bold text-slate-900">
                    Tautan Google Maps Lokasi (Opsional)
                  </label>
                  <input
                    type="url"
                    value={linkLokasiMaps}
                    onChange={(e) => setLinkLokasiMaps(e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full h-14 px-4 bg-white border-2 border-blue-300 focus:border-blue-600 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-base font-bold text-slate-900">
                    Panitia / Penyelenggara Sektor
                  </label>
                  <input
                    type="text"
                    value={penanggungJawabNama}
                    onChange={(e) => setPenanggungJawabNama(e.target.value)}
                    placeholder="Contoh: BPH KKS Mimika / Sektor Mimika Baru"
                    className="w-full h-14 px-4 bg-white border-2 border-blue-300 focus:border-blue-600 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-base font-bold text-slate-900">
                    Nomor WhatsApp Narahubung Panitia *
                  </label>
                  <input
                    type="text"
                    value={penanggungJawabWa}
                    onChange={(e) => setPenanggungJawabWa(e.target.value)}
                    placeholder="Contoh: 081248011234"
                    className="w-full h-14 px-4 bg-white border-2 border-blue-300 focus:border-blue-600 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-mono font-medium"
                  />
                </div>
              </div>

              {/* Rincian Khusus Turnamen Olahraga */}
              {subJenisAgenda === "turnamen_olahraga" && (
                <div className="pt-4 border-t-2 border-blue-200 space-y-4">
                  <div className="flex items-center gap-2 text-blue-950 font-bold text-base">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    <span>Rincian Turnamen & Hadiah</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-base font-bold text-slate-900">
                          Biaya Pendaftaran / Tiket Masuk
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isGratis}
                            onChange={(e) => {
                              setIsGratis(e.target.checked);
                              if (e.target.checked) setBiayaPendaftaran("0");
                            }}
                            className="w-4 h-4 rounded text-blue-600"
                          />
                          <span className="text-sm font-bold text-blue-900">
                            Gratis / Free
                          </span>
                        </label>
                      </div>
                      {!isGratis && (
                        <input
                          type="number"
                          value={biayaPendaftaran}
                          onChange={(e) => setBiayaPendaftaran(e.target.value)}
                          placeholder="Rp 100.000"
                          className="w-full h-14 px-4 bg-white border-2 border-blue-300 focus:border-blue-600 rounded-xl text-base text-slate-900 focus:outline-hidden font-medium"
                        />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-base font-bold text-slate-900">
                        Total Hadiah Piala & Uang Pembinaan
                      </label>
                      <input
                        type="text"
                        value={totalHadiahPembinaan}
                        onChange={(e) => setTotalHadiahPembinaan(e.target.value)}
                        placeholder="Contoh: Total Hadiah Rp 15.000.000 + Piala Bergilir KKS"
                        className="w-full h-14 px-4 bg-white border-2 border-blue-300 focus:border-blue-600 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
                      />
                    </div>
                  </div>

                  {/* Switch Status Pendaftaran */}
                  <div className="p-4 rounded-xl bg-white border-2 border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="block text-base font-bold text-slate-900">
                        Status Pendaftaran Peserta Warga
                      </span>
                      <span className="text-xs text-slate-500">
                        {isPendaftaranBuka
                          ? "Pendaftaran saat ini sedang DIBUKA untuk warga."
                          : "Pendaftaran telah DITUTUP (kuota penuh / batas waktu lewat)."}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPendaftaranBuka(!isPendaftaranBuka)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                        isPendaftaranBuka
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-300 text-slate-700"
                      }`}
                    >
                      {isPendaftaranBuka ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Pendaftaran Buka</span>
                        </>
                      ) : (
                        <span>Pendaftaran Tutup</span>
                      )}
                    </button>
                  </div>

                  {/* Upload Bagan Pertandingan (Record Asset) */}
                  <div className="p-4 rounded-xl bg-white border-2 border-dashed border-blue-300 space-y-2">
                    <label className="block text-base font-bold text-slate-900">
                      Unggah Bagan Pertandingan / Jadwal Pool (Opsional)
                    </label>
                    <input
                      ref={bracketInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBracketUpload}
                      className="hidden"
                    />
                    {bracketImageUrl ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200">
                        <span className="text-sm font-semibold text-blue-900 truncate">
                          ✓ Bagan pertandingan berhasil diunggah
                        </span>
                        <button
                          type="button"
                          onClick={() => setBracketImageUrl("")}
                          className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={uploadingBracket}
                        onClick={() => bracketInputRef.current?.click()}
                        className="w-full py-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-sm border border-blue-200 flex items-center justify-center gap-2 transition"
                      >
                        {uploadingBracket ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                        <span>Sentuh di Sini untuk Memilih Gambar Bagan Pertandingan</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AREA UPLOAD FOTO UTAMA (BESAR & JELAS RAMAH LANSIA) */}
        <div className="space-y-3 pt-2">
          <label className="block text-base sm:text-lg font-bold text-slate-900">
            Foto Sampul / Brosur Utama
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />

          {fotoUtamaUrl ? (
            <div className="rounded-2xl border-2 border-slate-300 overflow-hidden bg-slate-100 relative group">
              <div className="h-64 sm:h-80 w-full overflow-hidden">
                <img
                  src={fotoUtamaUrl}
                  alt="Foto Utama"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  Foto sampul aktif telah dipilih
                </span>
                <button
                  type="button"
                  onClick={() => setFotoUtamaUrl("")}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl flex items-center gap-1.5 transition shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus / Ganti Foto</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={uploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[140px] rounded-2xl border-3 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 flex flex-col items-center justify-center p-6 text-center transition group active:scale-[0.99]"
            >
              <div className="w-14 h-14 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                {uploadingImage ? (
                  <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
                ) : (
                  <Upload className="w-7 h-7 text-slate-600" />
                )}
              </div>
              <span className="text-base sm:text-lg font-bold text-slate-900">
                {uploadingImage
                  ? "Sedang Mengunggah Foto..."
                  : "Sentuh di Sini untuk Memilih Foto dari HP atau Laptop"}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Format foto biasa (JPG, PNG, atau WebP) maksimal 3 MB.
              </span>
            </button>
          )}
        </div>

        {/* Keterangan Tambahan / Penjelasan Lengkap */}
        <div className="space-y-2 pt-2">
          <label className="block text-base font-bold text-slate-900">
            Keterangan / Catatan Tambahan (Opsional)
          </label>
          <textarea
            rows={4}
            value={kontenUtama}
            onChange={(e) => setKontenUtama(e.target.value)}
            placeholder="Tuliskan keterangan tambahan jika ada hal penting yang ingin disampaikan kepada warga..."
            className="w-full p-4 bg-slate-50 border-2 border-slate-300 focus:border-amber-500 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden leading-relaxed font-normal"
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* TOMBOL AKSI UTAMA (BESAR & JELAS DENGAN DIALOG KONFIRMASI)   */}
      {/* ============================================================ */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="w-full h-16 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-lg sm:text-xl flex items-center justify-center gap-3 shadow-lg shadow-amber-600/25 transition active:scale-[0.99]"
        >
          <CheckCircle2 className="w-7 h-7" />
          <span>SIMPAN DAN TERBITKAN KABAR SEKARANG</span>
        </button>
      </div>

      {/* DIALOG KONFIRMASI RAMAH LANSIA */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Konfirmasi Penayangan
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Apakah kabar ini sudah benar untuk dibaca oleh seluruh warga perantau di Timika?
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-1">
              <span className="text-xs font-semibold text-slate-400 block uppercase">
                Judul Kabar:
              </span>
              <strong className="text-slate-900 font-bold text-base block">
                {judul || "(Judul belum diisi)"}
              </strong>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full sm:w-1/2 h-14 rounded-xl border-2 border-slate-300 text-slate-700 font-bold text-base hover:bg-slate-100 transition"
              >
                Cek Lagi
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="w-full sm:w-1/2 h-14 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                <span>{isSubmitting ? "Menerbitkan..." : "Ya, Terbitkan"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
