import type { Metadata } from 'next';
import { UserCheck, ShieldCheck, Heart, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pendataan Warga Rantau — KKS Mimika',
  description:
    'Formulir pendaftaran dan pendataan warga perantau asal Kabupaten Soppeng di Kabupaten Mimika, Papua Tengah. Menjalin silaturahmi dan hak perlindungan sosial paguyuban.',
};

export default function PendataanPage() {
  return (
    <main className="w-full pb-20">
      
      {/* Header Halaman */}
      <header className="bg-canvas-soft border-b border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Silaturahmi Komunitas</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
              Pendataan Warga Rantau Soppeng di Mimika
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Bukan sekadar formulir administratif, melainkan jembatan persaudaraan agar setiap warga perantau tercatat, terayomi dalam suka dan duka, serta saling mengenal sesama sanak sekampung di tanah rantau.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#formulir"
              className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
            >
              Isi Formulir Warga Baru
            </a>
            <a
              href="#cek-status"
              className="px-5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-sm rounded-xl transition-all hover:bg-slate-50"
            >
              Cek Status Pendaftaran
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 flex flex-col gap-16">

        {/* 1. MANFAAT BERGABUNG */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Pengayoman Paguyuban</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mendapatkan bimbingan dan perlindungan moril dari sesepuh serta pengurus jika menghadapi persoalan sosial di lingkungan perantauan.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-siri/10 text-siri flex items-center justify-center mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Jaminan Siaga Kas Duka</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hak santunan lelayu dan fasilitas ambulans gratis bagi anggota keluarga inti yang terdata sah di buku warga KKS Kabupaten Mimika.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-sky/10 text-sky-dark flex items-center justify-center mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Jejaring Silaturahmi Sektor</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Terhubung ke dalam paguyuban sektor distrik tempat tinggal Anda di Timika untuk kegiatan pengajian, arisan, dan peluang usaha bersama.
            </p>
          </div>
        </section>

        {/* 2. FORMULIR PENDAFTARAN (#formulir) */}
        <section id="formulir" className="scroll-mt-28">
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Formulir Mandiri</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2">
                Pendaftaran Warga Rantau KKS Mimika
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-lg mx-auto">
                Silakan isi data keluarga Anda di bawah ini dengan benar. Data Anda dijaga kerahasiaannya dan hanya digunakan untuk urusan silaturahmi paguyuban.
              </p>
            </div>

            <form className="space-y-5">
              
              {/* Data Pribadi */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  1. Data Kepala Keluarga
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Nama Lengkap Kepala Keluarga *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Andi Muhammad Basri"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Asal Kecamatan di Soppeng *
                    </label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all bg-white text-slate-700">
                      <option value="">-- Pilih Kecamatan Asal --</option>
                      <option>Lalabata</option>
                      <option>Lilirilau</option>
                      <option>Liliriaja</option>
                      <option>Marioriawa</option>
                      <option>Marioriwawo</option>
                      <option>Donri-Donri</option>
                      <option>Citta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Desa / Kelurahan Asal di Soppeng
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kel. Botto / Desa Cabenge"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Domisili di Timika */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  2. Domisili Tempat Tinggal di Mimika
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Sektor Wilayah / Distrik Domisili *
                    </label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all bg-white text-slate-700">
                      <option value="">-- Pilih Distrik Domisili --</option>
                      <option>Distrik Mimika Baru (Kota Timika)</option>
                      <option>Distrik Kuala Kencana</option>
                      <option>Distrik Wania (SP1 / SP4 / Nawaripi)</option>
                      <option>Distrik Iwaka (SP5 / Limau Asri)</option>
                      <option>Distrik Kwamki Narama</option>
                      <option>Distrik Mimika Timur (Pomako / Mapurujaya)</option>
                      <option>Distrik Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Tahun Mulai Merantau di Mimika
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 2012"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Alamat Lengkap di Timika *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama jalan, gang/nomor rumah, RT/RW di Timika"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Kontak & Keluarga */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  3. Kontak & Pekerjaan
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Pekerjaan / Bidang Usaha
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Wiraswasta / Karyawan / PNS"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Jumlah Tanggungan Anggota Keluarga di Timika
                  </label>
                  <input
                    type="number"
                    min={1}
                    defaultValue={1}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  className="w-full py-4 bg-gold hover:bg-gold-dark text-white font-semibold rounded-xl text-base transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Kirim Data Pendaftaran Warga</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2">
                  Pengurus sektor KKS Mimika akan memverifikasi dan menghubungi Anda untuk penyerahan nomor kartu anggota paguyuban.
                </p>
              </div>

            </form>
          </div>
        </section>

        {/* 3. CEK STATUS WARGA (#cek-status) */}
        <section id="cek-status" className="scroll-mt-28 pt-8 border-t border-slate-100">
          <div className="max-w-2xl mx-auto bg-canvas-soft p-6 sm:p-8 rounded-2xl border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pemeriksaan Mandiri</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2">
              Cek Status Pendaftaran Warga
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Masukkan nomor WhatsApp atau Nomor Anggota KKS yang didaftarkan untuk memeriksa status verifikasi data Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Masukkan Nomor WhatsApp..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-gold outline-none"
              />
              <button
                type="button"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all"
              >
                Cari Data
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
