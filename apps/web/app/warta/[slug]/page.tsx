import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Download,
  Share2,
  Phone,
  ArrowLeft,
  ExternalLink,
  HeartHandshake,
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { db, wartaPaguyuban } from "@repo/database";
import { eq } from "drizzle-orm";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [warta] = await db
    .select()
    .from(wartaPaguyuban)
    .where(eq(wartaPaguyuban.slug, slug))
    .limit(1);

  if (!warta) {
    return {
      title: "Warta Tidak Ditemukan — KKS Mimika",
    };
  }

  return {
    title: `${warta.judul} — Warta KKS Mimika`,
    description: warta.ringkasan || "Warta Resmi Kerukunan Keluarga Soppeng Kabupaten Mimika",
    openGraph: {
      title: warta.judul,
      description: warta.ringkasan || undefined,
      images: warta.fotoUtamaUrl ? [warta.fotoUtamaUrl] : undefined,
    },
  };
}

export default async function WartaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [warta] = await db
    .select()
    .from(wartaPaguyuban)
    .where(eq(wartaPaguyuban.slug, slug))
    .limit(1);

  if (!warta || warta.statusTayang !== "published") {
    notFound();
  }

  const isAgenda = warta.kategori === "agenda_kegiatan";
  const isDuka = warta.kategori === "duka_cita";
  const isSuka = warta.kategori === "suka_cita";

  const biayaDisplay =
    warta.biayaPendaftaran && Number(warta.biayaPendaftaran) > 0
      ? `Rp ${Number(warta.biayaPendaftaran).toLocaleString("id-ID")}`
      : "Gratis / Terbuka";

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://kks-mimika.com";

  const shareText = encodeURIComponent(
    `*${warta.judul}*\n\n${warta.ringkasan || ""}\n\nBaca selengkapnya di Portal Resmi KKS Mimika:\n${baseUrl}/warta/${warta.slug}`
  );
  const waShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <main className="w-full pb-20 bg-canvas-soft min-h-screen">
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/warta"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Warta & Agenda</span>
          </Link>

          <a
            href={waShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan ke WhatsApp</span>
          </a>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Main Photo Banner */}
          {warta.fotoUtamaUrl && (
            <div className="w-full h-64 sm:h-80 md:h-96 bg-slate-900 overflow-hidden relative border-b border-slate-200">
              <img
                src={warta.fotoUtamaUrl}
                alt={warta.judul}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-6">
            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center gap-2.5">
              {isAgenda && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/60">
                  <Calendar className="w-3.5 h-3.5" />
                  AGENDA PAGUYUBAN
                </span>
              )}
              {isDuka && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  LELAYU / DUKA CITA
                </span>
              )}
              {isSuka && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200/60">
                  <Sparkles className="w-3.5 h-3.5" />
                  SUKA CITA & AQIQAH
                </span>
              )}

              <span className="text-xs text-slate-400">
                Dipublikasikan pada{" "}
                {new Date(warta.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Title & Summary */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {warta.judul}
              </h1>
              {warta.ringkasan && (
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                  {warta.ringkasan}
                </p>
              )}
            </div>

            {/* Event Operational Details Box (if agenda) */}
            {isAgenda && (
              <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-4">
                <h3 className="font-bold text-amber-950 text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-700" />
                  Informasi Pelaksanaan Kegiatan
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-800">
                  <div className="space-y-1">
                    <span className="text-xs text-amber-800 font-semibold block">
                      Waktu & Tanggal Mulai:
                    </span>
                    <span className="font-bold text-slate-900">
                      {warta.tanggalMulai
                        ? new Date(warta.tanggalMulai).toLocaleString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Sesuai Jadwal Panitia"}
                    </span>
                  </div>

                  {warta.tanggalSelesai && (
                    <div className="space-y-1">
                      <span className="text-xs text-amber-800 font-semibold block">
                        Waktu Selesai:
                      </span>
                      <span className="font-bold text-slate-900">
                        {new Date(warta.tanggalSelesai).toLocaleString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-xs text-amber-800 font-semibold block">
                      Lokasi / Venue Acara:
                    </span>
                    <span className="font-bold text-slate-900">
                      {warta.lokasiNamaTempat || "Timika, Papua Tengah"}
                    </span>
                    {warta.lokasiMapsUrl && (
                      <a
                        href={warta.lokasiMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-800 font-semibold mt-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Buka Petunjuk Arah (Google Maps)
                      </a>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-amber-800 font-semibold block">
                      Penyelenggara / Panitia:
                    </span>
                    <span className="font-bold text-slate-900">
                      {warta.penyelenggaraSektor || "Pengurus Pusat KKS Kabupaten Mimika"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-amber-800 font-semibold block">
                      Biaya / Infaq Pendaftaran:
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md inline-block">
                      {biayaDisplay}
                    </span>
                  </div>

                  {warta.kuotaPeserta && (
                    <div className="space-y-1">
                      <span className="text-xs text-amber-800 font-semibold block">
                        Kuota Peserta:
                      </span>
                      <span className="font-bold text-slate-900">
                        {warta.kuotaPeserta} Peserta
                      </span>
                    </div>
                  )}
                </div>

                {/* CTAs: Form Register & PDF Attachment */}
                <div className="pt-4 border-t border-amber-200/80 flex flex-wrap items-center gap-3">
                  {warta.linkPendaftaranExternal && (
                    <a
                      href={warta.linkPendaftaranExternal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Formulir Pendaftaran Online</span>
                    </a>
                  )}

                  {warta.lampiranDokumenUrl && (
                    <a
                      href={warta.lampiranDokumenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
                    >
                      <Download className="w-4 h-4 text-amber-700" />
                      <span>Unduh Juknis / Surat Resmi (PDF)</span>
                    </a>
                  )}

                  {warta.kontakPanitiaWa && (
                    <a
                      href={`https://wa.me/${warta.kontakPanitiaWa.replace(/\D/g, "")}?text=${encodeURIComponent(`Halo Panitia KKS, saya ingin bertanya seputar agenda: "${warta.judul}"`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition shadow-xs"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Hubungi Panitia ({warta.kontakPanitiaWa})</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Duka Details Box */}
            {isDuka && (
              <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200/70 space-y-3 text-sm">
                <h3 className="font-bold text-rose-950 text-base flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-rose-600" />
                  Rincian Takziah & Keluarga Duka
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800">
                  {warta.namaAlmarhum && (
                    <div>
                      <span className="text-xs text-rose-800 block">Nama Almarhum/ah:</span>
                      <strong className="text-base text-slate-900">{warta.namaAlmarhum}</strong>
                    </div>
                  )}
                  {warta.waktuWafat && (
                    <div>
                      <span className="text-xs text-rose-800 block">Waktu Berpulang:</span>
                      <strong className="text-slate-900">
                        {new Date(warta.waktuWafat).toLocaleString("id-ID")}
                      </strong>
                    </div>
                  )}
                  {warta.alamatDukaTimika && (
                    <div className="sm:col-span-2">
                      <span className="text-xs text-rose-800 block">Alamat Rumah Duka:</span>
                      <strong className="text-slate-900">{warta.alamatDukaTimika}</strong>
                    </div>
                  )}
                </div>

                {warta.kontakKeluargaWa && (
                  <div className="pt-3 border-t border-rose-200/80 flex items-center gap-3">
                    <a
                      href={`https://wa.me/${warta.kontakKeluargaWa.replace(/\D/g, "")}?text=${encodeURIComponent("Innalillahi wa inna ilaihi rajiun. Turut berduka cita mendalam atas berpulangnya almarhum/ah.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Kirim Pesan Takziah ke Keluarga</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Main Content Body */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Keterangan & Rincian Pengumuman
              </h4>
              <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {warta.kontenUtama || warta.ringkasan}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/warta"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Lihat Warta Lainnya</span>
              </Link>

              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
              >
                <Share2 className="w-4 h-4" />
                <span>Sebarkan Informasi Ini</span>
              </a>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
