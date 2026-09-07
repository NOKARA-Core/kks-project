import type { Metadata } from "next";
import Link from "next/link";
import {
  HeartHandshake,
  Calendar,
  Sparkles,
  MessageCircle,
  Clock,
  MapPin,
  FileText,
  Users,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { WartaChannelCta } from "../../components/WartaChannelCta";
import { db, wartaPaguyuban } from "@repo/database";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Warta Warga & Kabar Komunitas",
  description:
    "Pusat warta resmi paguyuban Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika. Agenda kegiatan, turnamen, kabar duka lelayu warga, dan berita sukacita di Timika.",
};

export default async function WartaPage() {
  const allWarta = await db
    .select()
    .from(wartaPaguyuban)
    .where(eq(wartaPaguyuban.statusTayang, "published"))
    .orderBy(desc(wartaPaguyuban.createdAt));

  const dukaList = allWarta.filter((w) => w.kategori === "duka_cita");
  const agendaList = allWarta.filter((w) => w.kategori === "agenda_kegiatan");
  const sukaList = allWarta.filter((w) => w.kategori === "suka_cita");

  return (
    <main className="w-full pb-20">
      {/* Header Halaman */}
      <header className="bg-canvas-soft border-b border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Kabar Rantau Mimika
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
              Warta & Agenda Warga KKS Timika
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Kanal informasi resmi seputar agenda kegiatan paguyuban, turnamen, kabar duka
              lelayu, dan syukuran sesama perantau Soppeng di Kabupaten Mimika.
            </p>
          </div>

          {/* Banner Saluran WhatsApp Resmi */}
          <div className="mt-8">
            <WartaChannelCta />
          </div>

          {/* Quick Jump Anchor Filter */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-8 pt-6 border-t border-slate-200">
            <a
              href="#agenda"
              className="px-4 py-2 rounded-xl bg-white border border-amber-300 hover:border-amber-600 text-amber-900 font-semibold text-xs sm:text-sm transition-all hover:bg-amber-50 flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Agenda Paguyuban ({agendaList.length})</span>
            </a>
            <a
              href="#duka"
              className="px-4 py-2 rounded-xl bg-white border border-rose-300 hover:border-rose-600 text-rose-800 font-semibold text-xs sm:text-sm transition-all hover:bg-rose-50 flex items-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              <span>Kabar Duka & Lelayu ({dukaList.length})</span>
            </a>
            <a
              href="#sukacita"
              className="px-4 py-2 rounded-xl bg-white border border-sky-300 hover:border-sky-600 text-sky-800 font-semibold text-xs sm:text-sm transition-all hover:bg-sky-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Berita Sukacita & Syukuran ({sukaList.length})</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 flex flex-col gap-16 sm:gap-20">
        {/* 1. AGENDA KEGIATAN (#agenda) */}
        <section id="agenda" className="scroll-mt-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Agenda Kegiatan & Pertemuan Paguyuban
              </h2>
            </div>
            <span className="text-xs font-semibold text-amber-800 hidden sm:inline">
              Yassisoppengi — Silaturahmi Rantau
            </span>
          </div>

          {agendaList.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                Belum Ada Agenda Terjadwal
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Agenda pertemuan, turnamen, atau syukuran akan diumumkan di sini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {agendaList.map((item) => {
                const biayaDisplay =
                  item.biayaPendaftaran && Number(item.biayaPendaftaran) > 0
                    ? `Rp ${Number(item.biayaPendaftaran).toLocaleString("id-ID")}`
                    : "Gratis / Terbuka";

                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 hover:shadow-card transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    {item.fotoUtamaUrl && (
                      <div className="w-full h-48 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                        <img
                          src={item.fotoUtamaUrl}
                          alt={item.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-amber-900 shadow-xs border border-amber-200/60">
                          {item.penyelenggaraSektor || "KKS Mimika"}
                        </div>
                      </div>
                    )}

                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                            Agenda Resmi
                          </span>
                          {item.tanggalMulai && (
                            <time className="text-xs font-medium text-slate-500">
                              {new Date(item.tanggalMulai).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </time>
                          )}
                        </div>

                        <Link href={`/warta/${item.slug}`}>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-red-700 transition">
                            {item.judul}
                          </h3>
                        </Link>

                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {item.ringkasan}
                        </p>

                        {/* Operasional specs */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-2 text-slate-700">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                            <span className="font-medium">
                              {item.lokasiNamaTempat || "Timika"}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 pt-1">
                            <div>
                              <strong>Infaq/Biaya:</strong>{" "}
                              <span className="text-emerald-700 font-semibold">
                                {biayaDisplay}
                              </span>
                            </div>
                            {item.kuotaPeserta && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                <span>Kuota: {item.kuotaPeserta} Peserta</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          href={`/warta/${item.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                        >
                          <span>Rincian & Pendaftaran</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>

                        {item.kontakPanitiaWa && (
                          <a
                            href={`https://wa.me/${item.kontakPanitiaWa.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-700"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Panitia: {item.kontakPanitiaWa}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* 2. KABAR DUKA & LELAYU (#duka) */}
        <section id="duka" className="scroll-mt-28 pt-8 border-t border-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Kabar Duka & Informasi Lelayu Warga
              </h2>
            </div>
            <span className="text-xs font-semibold text-rose-700 hidden sm:inline">
              Salipuri Temmadinging
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {dukaList.map((item) => (
              <article
                key={item.id}
                className="p-6 sm:p-7 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
                    <span>Warta Duka Cita</span>
                    <time className="text-slate-500 font-normal">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </div>

                  <Link href={`/warta/${item.slug}`}>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug hover:text-rose-700 transition">
                      {item.judul}
                    </h3>
                  </Link>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {item.ringkasan}
                  </p>

                  <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-xs text-slate-700 flex flex-col gap-1.5">
                    {item.namaAlmarhum && (
                      <div>
                        <strong>Almarhum/ah:</strong> {item.namaAlmarhum}
                      </div>
                    )}
                    {item.alamatDukaTimika && (
                      <div>
                        <strong>Rumah Duka:</strong> {item.alamatDukaTimika}
                      </div>
                    )}
                    {item.waktuWafat && (
                      <div>
                        <strong>Waktu Wafat:</strong>{" "}
                        {new Date(item.waktuWafat).toLocaleString("id-ID")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/warta/${item.slug}`}
                    className="text-xs font-bold text-rose-700 hover:underline"
                  >
                    Baca Lengkap &rarr;
                  </Link>
                  {item.kontakKeluargaWa && (
                    <a
                      href={`https://wa.me/${item.kontakKeluargaWa.replace(/\D/g, "")}?text=${encodeURIComponent("Innalillahi wa inna ilaihi rajiun. Turut berduka cita mendalam.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Kirim Takziah
                    </a>
                  )}
                </div>
              </article>
            ))}

            {/* Kartu Siaga Ambulans */}
            <article className="p-6 sm:p-7 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Layanan Siaga 24/7
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-2">
                  Pusat Informasi & Tanggap Duka Warga
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Bagi warga KKS Mimika yang membutuhkan armada ambulans paguyuban, koordinasi
                  fardhu kifayah jenazah, atau laporan musibah, hubungi tim siaga KKS.
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <span>Koordinator Siaga Mimika Baru</span>
                    <strong className="text-slate-900 font-mono">0812-4822-9901</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <span>Koordinator Siaga Kuala Kencana</span>
                    <strong className="text-slate-900 font-mono">0821-9877-3321</strong>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <Link href="/sosial" className="text-xs font-bold text-red-600 hover:underline">
                  Pelajari Prosedur Penyaluran Santunan Kas Duka &rarr;
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* 3. BERITA SUKACITA & SYUKURAN (#sukacita) */}
        {sukaList.length > 0 && (
          <section id="sukacita" className="scroll-mt-28 pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-8">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Berita Sukacita & Syukuran Warga
                </h2>
              </div>
              <span className="text-xs font-semibold text-sky-700 hidden sm:inline">
                Kabar Gembira Rantau
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sukaList.map((item) => (
                <article
                  key={item.id}
                  className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                      Syukuran
                    </span>
                    <Link href={`/warta/${item.slug}`}>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 mb-2 hover:text-sky-700 transition">
                        {item.judul}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.ringkasan}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                    <span>
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Link
                      href={`/warta/${item.slug}`}
                      className="font-semibold text-sky-700 hover:underline"
                    >
                      Rincian &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
