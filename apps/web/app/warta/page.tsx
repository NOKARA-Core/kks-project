import type { Metadata } from 'next';
import Link from 'next/link';
import { HeartHandshake, Calendar, Sparkles, MessageCircle, Clock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Warta Warga & Kabar Komunitas',
  description:
    'Pusat warta resmi paguyuban Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika. Kabar duka & lelayu warga, berita sukacita, dan agenda silaturahmi perantau di Timika.',
};

export default function WartaPage() {
  return (
    <main className="w-full pb-20">
      
      {/* Header Halaman */}
      <header className="bg-canvas-soft border-b border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Kabar Rantau Mimika</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
              Warta & Agenda Warga KKS Timika
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Kanal informasi resmi seputar kabar suka dan duka sesama warga perantau Soppeng, serta agenda kegiatan silaturahmi di Kabupaten Mimika.
            </p>
          </div>

          {/* Quick Jump Anchor Filter */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-8 pt-6 border-t border-slate-200">
            <a
              href="#duka"
              className="px-4 py-2 rounded-xl bg-white border border-siri/30 hover:border-siri text-siri font-semibold text-xs sm:text-sm transition-all hover:bg-siri/5 flex items-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Kabar Duka & Lelayu</span>
            </a>
            <a
              href="#sukacita"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-gold text-slate-700 font-semibold text-xs sm:text-sm transition-all hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Berita Sukacita & Syukuran</span>
            </a>
            <a
              href="#agenda"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-sky text-slate-700 font-semibold text-xs sm:text-sm transition-all hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-sky" />
              <span>Agenda Silaturahmi</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 flex flex-col gap-16 sm:gap-20">

        {/* 1. KABAR DUKA & LELAYU (#duka) */}
        <section id="duka" className="scroll-mt-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-siri"></span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Kabar Duka & Informasi Lelayu Warga
              </h2>
            </div>
            <span className="text-xs font-semibold text-siri hidden sm:inline">Salipuri Temmadinging</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Kartu Duka 1 */}
            <article className="p-6 sm:p-7 bg-white rounded-2xl border-l-4 border-l-siri border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-siri uppercase tracking-wider mb-2">
                  <span>Warta Duka Cita</span>
                  <time dateTime="2026-09-06" className="text-slate-500 font-normal">6 September 2026</time>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  Berpulang ke Rahmatullah: Bapak H. Andi Mappanyukki (68 Tahun)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Telah berpulang salah seorang tokoh sesepuh perantau Soppeng di Distrik Mimika Baru. Jenazah disemayamkan di rumah duka Jl. Budi Utomo, Timika sebelum dihantarkan ke peristirahatan terakhir.
                </p>
                <div className="p-3 bg-canvas-soft rounded-xl border border-slate-100 text-xs text-slate-600 flex flex-col gap-1">
                  <div><strong>Rumah Duka:</strong> Jl. Budi Utomo Ujung, Kel. Inauga, Timika</div>
                  <div><strong>Pemakaman:</strong> TPU KM 11 Timika, Ba&rsquo;da Ashar</div>
                  <div><strong>Santunan Kas Duka KKS:</strong> Diserahkan oleh Pengurus Sektor Mimika Baru</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Keluarga Besar KKS Berbela Sungkawa</span>
                <a
                  href="https://wa.me/?text=Innalillahi%20wa%20inna%20ilaihi%20rajiun.%20Turut%20berduka%20cita%20mendalam%20atas%20berpulangnya%20Almarhum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-siri hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Kirim Pesan Takziah
                </a>
              </div>
            </article>

            {/* Kartu Siaga Ambulans */}
            <article className="p-6 sm:p-7 bg-canvas-soft rounded-2xl border border-dashed border-slate-300 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Layanan Siaga 24/7</span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-2">
                  Pusat Informasi & Call Center Tanggap Duka Warga
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Bagi warga KKS Mimika yang membutuhkan bantuan armada ambulans paguyuban, koordinasi pengurusan jenazah, atau laporan warga yang tertimpa musibah, silakan hubungi kontak siaga sektor terdekat.
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <span>Koordinator Siaga Sektor Mimika Baru</span>
                    <strong className="text-slate-900 font-mono">0812-XXXX-XXXX</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <span>Koordinator Siaga Sektor Kuala Kencana</span>
                    <strong className="text-slate-900 font-mono">0821-XXXX-XXXX</strong>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <Link href="/sosial" className="text-xs font-bold text-gold hover:underline">
                  Pelajari Prosedur Penyaluran Santunan Kas Duka &rarr;
                </Link>
              </div>
            </article>

          </div>
        </section>

        {/* 2. BERITA SUKACITA & SYUKURAN (#sukacita) */}
        <section id="sukacita" className="scroll-mt-28 pt-8 border-t border-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold"></span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Berita Sukacita & Syukuran Warga
              </h2>
            </div>
            <span className="text-xs font-semibold text-gold hidden sm:inline">Kabar Gembira Rantau</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <article className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-wider">Syukuran Pernikahan</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 mb-2">
                  Akad & Resepsi Pernikahan Ananda Andi Fadil & Nurul Hasanah
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Mengundang segenap sanak keluarga besar perantau KKS Mimika untuk menghadiri resepsi pernikahan yang diselenggarakan di Gedung Tongkonan Timika.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Minggu, 20 September 2026</span>
                <span className="font-semibold text-slate-700">Timika</span>
              </div>
            </article>

            <article className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-wider">Prestasi Pemuda</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 mb-2">
                  Generasi Muda KKS Mimika Raih Juara Olimpiade Sains Provinsi
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Apresiasi membanggakan bagi ananda Rian Pratama (putra warga KKS Distrik Kuala Kencana) yang berhasil membawa nama harum Mimika di tingkat provinsi Papua Tengah.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Kamis, 3 September 2026</span>
                <span className="font-semibold text-gold">Prestasi Warga</span>
              </div>
            </article>

            <article className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-wider">Kelahiran Putra-Putri</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 mb-2">
                  Syukuran Aqiqah Keluarga Bapak Muh. Yusuf di SP2 Timika
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ucapan selamat dan doa bersama atas kelahiran putra kedua keluarga perantau asal Lilirilau Soppeng yang berdomisili di SP2 Timika Jaya.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Sabtu, 29 Agustus 2026</span>
                <span className="font-semibold text-slate-700">Syukuran</span>
              </div>
            </article>

          </div>
        </section>

        {/* 3. AGENDA SILATURAHMI (#agenda) */}
        <section id="agenda" className="scroll-mt-28 pt-8 border-t border-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky"></span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Agenda Silaturahmi & Pertemuan Paguyuban
              </h2>
            </div>
            <span className="text-xs font-semibold text-sky-dark hidden sm:inline">Jadwal Komunitas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-6 bg-white rounded-2xl border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky/10 text-sky-dark flex flex-col items-center justify-center flex-shrink-0 font-bold">
                <span className="text-xs">SEP</span>
                <span className="text-base leading-none">13</span>
              </div>
              <div>
                <span className="text-xs font-bold text-sky-dark uppercase tracking-wider">Silaturahmi Bulanan</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 mb-1">
                  Arisan & Pengajian Rutin Warga KKS Sektor Mimika Baru
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-3">
                  Wadah temu kangen dan pembaharuan buku data warga sekaligus pengumpulan iuran sosial sukarela.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 15:30 WIT</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Rumah Kediaman Bapak H. Usman, Timika</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex flex-col items-center justify-center flex-shrink-0 font-bold">
                <span className="text-xs">OKT</span>
                <span className="text-base leading-none">04</span>
              </div>
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-wider">Musyawarah Pengurus</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 mb-1">
                  Rapat Koordinasi Evaluasi Pendataan Digital KKS Mimika
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-3">
                  Penyelarasan laporan pendaftaran warga rantau baru dari 12 sektor sebelum penyerahan buku anggota.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 09:00 WIT</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Sekretariat KKS Mimika Baru</span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
