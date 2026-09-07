import type { Metadata } from 'next';
import { Store, MessageCircle, MapPin, Tag, PlusCircle, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Niaga Rantau — Direktori Usaha Warga',
  description:
    'Direktori direktori usaha, jasa, dan UMKM sesama perantau asal Kabupaten Soppeng di Timika, Papua Tengah. Saling menguatkan ekonomi keluarga perantau.',
};

const sampleBusinesses = [
  {
    id: 1,
    name: 'Warung Pangkep & Coto Latemmamala',
    category: 'Kuliner Tradisional',
    owner: 'H. Rusli Mappatunru (Warga Sektor Mimika Baru)',
    address: 'Jl. Yos Sudarso, Depan Pasar Lama Timika',
    phone: '6281234567890',
    desc: 'Menyajikan Coto Makassar, Sop Konro, dan aneka kue tradisional Bugis (Barongko, Katirisala) khas Soppeng.',
  },
  {
    id: 2,
    name: 'Bengkel Motor Berkah Latemmamala',
    category: 'Jasa Otomotif & Sparepart',
    owner: 'Pak Sukardi (Warga Sektor Kuala Kencana)',
    address: 'Jl. Cenderawasih SP2, Timika',
    phone: '6282198765432',
    desc: 'Servis injeksi, ganti oli berkala, perbaikan mesin, dan penyediaan suku cadang resmi roda dua.',
  },
  {
    id: 3,
    name: 'Toko Bangunan & Material Mario',
    category: 'Perdagangan Bahan Bangunan',
    owner: 'Hj. Sitti Maryam (Warga Sektor Wania)',
    address: 'Jl. Hasanuddin, Pasar Sentral Timika',
    phone: '6285211223344',
    desc: 'Melayani pasokan semen, besi beton, cat, kayu olahan, serta kebutuhan material proyek perumahan di Mimika.',
  },
  {
    id: 4,
    name: 'Jasa Las & Konstruksi Baja Latemmamala Steel',
    category: 'Bengkel Las & Konstruksi',
    owner: 'Baharuddin, S.T. (Warga Sektor SP4)',
    address: 'Jl. Poros SP4, Timika',
    phone: '6281355667788',
    desc: 'Pengerjaan pagar teralis, kanopi baja ringan, pintu harmonika, dan konstruksi rangka atap gedung.',
  },
];

export default function NiagaPage() {
  return (
    <main className="w-full pb-20">
      
      {/* Header Halaman */}
      <header className="bg-canvas-soft border-b border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Ekonomi Rantau</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
              Direktori Niaga & Jasa Warga KKS Timika
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Etalase usaha dan jasa sesama perantau Soppeng di Kabupaten Mimika. Mari berbelanja dan saling menguatkan perekonomian keluarga warga di tanah rantau.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="#daftar-usaha"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-dark text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Daftarkan Usaha Anda Gratis</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 flex flex-col gap-16">

        {/* 1. KATALOG USAHA */}
        <section>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Daftar Usaha Warga Terverifikasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Daftar usaha milik sesama warga perantau Soppeng yang beroperasi di wilayah Timika.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">4 Usaha Unggulan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {sampleBusinesses.map((biz) => (
              <article
                key={biz.id}
                className="p-6 sm:p-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-dark bg-sky/10 px-2.5 py-1 rounded-lg">
                      <Tag className="w-3 h-3" />
                      {biz.category}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Warga Terverifikasi
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                    {biz.name}
                  </h3>
                  <p className="text-xs text-gold font-semibold mb-3">{biz.owner}</p>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {biz.desc}
                  </p>

                  <div className="flex items-start gap-2 text-xs text-slate-500 mb-6">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{biz.address}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Hubungi Langsung Pemilik:</span>
                  <a
                    href={`https://wa.me/${biz.phone}?text=Halo%20Tabe%27,%20saya%20warga%20KKS%20Timika%20melihat%20usaha%20Anda%20di%20portal%20paguyuban.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat WhatsApp</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 2. FORM PENDAFTARAN USAHA (#daftar-usaha) */}
        <section id="daftar-usaha" className="scroll-mt-28 pt-8 border-t border-slate-100">
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Promosi Usaha Warga</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2">
                Daftarkan Usaha & Jasa Anda
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
                Khusus untuk warga perantau asal Kabupaten Soppeng di Kabupaten Mimika. Usaha Anda akan ditampilkan di direktori ini tanpa biaya retribusi.
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Nama Usaha / Merk Dagang
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Coto Latemmamala Timika"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Bidang / Kategori Usaha
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all bg-white text-slate-700">
                    <option>Kuliner & Makanan</option>
                    <option>Otomotif & Bengkel</option>
                    <option>Toko Sembako & Perdagangan</option>
                    <option>Jasa Konstruksi / Pertukangan</option>
                    <option>Kesehatan & Kecantikan</option>
                    <option>Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Nama Pemilik Usaha
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap sesuai KTP"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Nomor WhatsApp Bisnis
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Alamat / Lokasi Usaha di Timika
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama jalan, distrik/kelurahan di Mimika"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Deskripsi Singkat Produk / Jasa
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan menu, jasa, atau produk unggulan yang Anda tawarkan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="button"
                className="w-full py-3.5 bg-gold hover:bg-gold-dark text-white font-semibold rounded-xl text-sm transition-all shadow-sm active:scale-95"
              >
                Kirim Pengajuan Pendaftaran Usaha
              </button>
              <p className="text-center text-[11px] text-slate-500">
                Pengurus bidang niaga KKS Mimika akan memverifikasi data Anda sebelum ditampilkan di portal.
              </p>
            </form>
          </div>
        </section>

      </div>
    </main>
  );
}
