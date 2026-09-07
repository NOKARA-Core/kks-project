import Link from 'next/link';
import { HeroSection } from '../components/sections/HeroSection';
import { WartaSection } from '../components/sections/WartaSection';
import { HeartHandshake, ShieldCheck, Users, ArrowRight, Store, Calendar, FileText, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="w-full">
      {/* 1. Hero Section Berita Informatif */}
      <HeroSection />

      {/* 2. Warta & Agenda Komunitas */}
      <WartaSection />


      {/* 2. Tiga Pilar Luhur Komunitas di Rantau */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Falsafah Hidup di Rantau</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-3">
              Tiga Pilar Luhur Bugis-Soppeng di Bumi Amungsa
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Menjadi pedoman teguh para sesepuh, pengurus, dan seluruh perantau Soppeng dalam menjaga keluhuran budi, saling menopang, serta hidup berdampingan secara damai di Kabupaten Mimika.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Pilar 1: Dongiri Temmatipa */}
            <div className="p-6 sm:p-7 rounded-2xl bg-canvas-soft border border-slate-200/80 hover:border-gold/50 transition-all hover:shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-5 font-bold text-lg">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Dongiri Temmatipa</h3>
                <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-3">Pengayoman & Bimbingan</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Para sesepuh dan pengurus aktif memberikan pengayoman moril, bimbingan usaha, serta arahan hidup bagi warga baru maupun yang telah lama bermukim di rantau.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-slate-500">
                Pilar Pengayoman Paguyuban
              </div>
            </div>

            {/* Pilar 2: Salipuri Temmadinging */}
            <div className="p-6 sm:p-7 rounded-2xl bg-canvas-soft border border-slate-200/80 hover:border-siri/40 transition-all hover:shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-siri/10 text-siri flex items-center justify-center mb-5 font-bold text-lg">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Salipuri Temmadinging</h3>
                <p className="text-xs text-siri font-semibold uppercase tracking-wider mb-3">Kepedulian Sosial & Duka</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Saling menyelimuti di kala dingin. Gerak cepat tanggap lelayu/duka, santunan warga sakit, dan gotong royong meringankan beban musibah sesama keluarga perantau.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-slate-500">
                Pilar Solidaritas & Kas Duka
              </div>
            </div>

            {/* Pilar 3: Wesse Temmakapa */}
            <div className="p-6 sm:p-7 rounded-2xl bg-canvas-soft border border-slate-200/80 hover:border-sky/50 transition-all hover:shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky/10 text-sky-dark flex items-center justify-center mb-5 font-bold text-lg">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Wesse Temmakapa</h3>
                <p className="text-xs text-sky-dark font-semibold uppercase tracking-wider mb-3">Persatuan & Keharmonisan</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Menjaga kerukunan internal paguyuban serta menjunjung tinggi adat istiadat tanah tempat berpijak dengan menghormati masyarakat adat Papua di Mimika.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-slate-500">
                Pilar Kerukunan Antarwarga
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Sorotan Kas Sosial & Warta Duka Siaga */}
      <section className="py-14 sm:py-16 bg-canvas-soft border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-siri uppercase tracking-wider mb-2">
                <HeartHandshake className="w-4 h-4" />
                <span>Transparansi Kas Siaga Duka KKS Mimika</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                Gotong Royong Kas Kemanusiaan & Lelayu Warga
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Setiap rupiah iuran sukarela warga tercatat transparan untuk santunan duka cita, bantuan rawat inap darurat, dan armada pendampingan jenazah di Timika.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink-0">
              <Link
                href="/sosial"
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-center text-sm transition-all"
              >
                Lihat Laporan Kas Terbuka
              </Link>
              <Link
                href="/warta#duka"
                className="px-6 py-3.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold rounded-xl text-center text-sm transition-all"
              >
                Kontak Siaga Lelayu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ajakan Pendataan Warga Rantau */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Silaturahmi Warga</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-4">
              Belum Terdaftar di Buku Warga KKS Mimika?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              Mari daftarkan diri dan keluarga Anda agar terhubung dengan sesama perantau Soppeng di sektor domisili Anda di Timika. Proses mudah, hangat, dan tanpa birokrasi kaku.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/pendataan"
                className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-dark text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95 text-center"
              >
                Formulir Pendaftaran Warga Rantau
              </Link>
              <Link
                href="/profil"
                className="w-full sm:w-auto px-8 py-4 bg-canvas-soft border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold rounded-xl transition-all text-center"
              >
                Pelajari Struktur Paguyuban
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
