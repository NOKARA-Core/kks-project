import type { Metadata } from 'next';
import { HeartHandshake, ShieldCheck, CreditCard, ArrowUpRight, ArrowDownLeft, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kas Sosial & Transparansi Paguyuban',
  description:
    'Laporan keterbukaan kas sosial, kas siaga duka cita, dan santunan kemanusiaan paguyuban Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika.',
};

const recentTransactions = [
  {
    id: 1,
    date: '06 Sep 2026',
    desc: 'Penyaluran Santunan Duka Cita Alm. H. Andi Mappanyukki (Sektor Mimika Baru)',
    type: 'out',
    amount: 'Rp 5.000.000',
    category: 'Santunan Lelayu',
  },
  {
    id: 2,
    date: '04 Sep 2026',
    desc: 'Iuran Kas Sosial Warga Sektor Kuala Kencana (Kolektif 28 KK)',
    type: 'in',
    amount: 'Rp 2.800.000',
    category: 'Iuran Rutin',
  },
  {
    id: 3,
    date: '01 Sep 2026',
    desc: 'Biaya Perawatan Operasional Ambulans Paguyuban Timika',
    type: 'out',
    amount: 'Rp 1.250.000',
    category: 'Operasional Ambulans',
  },
  {
    id: 4,
    date: '28 Agu 2026',
    desc: 'Bantuan Biaya Rawat Inap Warga Sakit di RSUD Mimika (Sektor Wania)',
    type: 'out',
    amount: 'Rp 2.500.000',
    category: 'Bantuan Kesehatan',
  },
  {
    id: 5,
    date: '25 Agu 2026',
    desc: 'Donasi Sukarela Tokoh & Pengusaha Warga KKS Timika',
    type: 'in',
    amount: 'Rp 10.000.000',
    category: 'Infaq / Sumbangan',
  },
];

export default function SosialPage() {
  return (
    <main className="w-full pb-20">
      
      {/* Header Halaman */}
      <header className="bg-canvas-soft border-b border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-siri uppercase tracking-wider">Amanah & Keterbukaan</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
              Transparansi Kas Sosial & Dana Duka KKS Mimika
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Pengelolaan dana tolong-menolong warga secara amanah, terbuka, dan bertanggung jawab. Menerapkan falsafah{' '}
              <strong className="text-slate-900 font-semibold">Salipuri Temmadinging</strong> (saling menopang dan menyelimuti di kala duka).
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 flex flex-col gap-14 sm:gap-16">

        {/* 1. KARTU SALDO & METRIK DANA SOSIAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Kas Siaga Aktif</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                Rp 84.650.000
              </h3>
              <p className="text-xs text-slate-500">Saldo kas sosial & duka per September 2026</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Diaudit Bersama Pengurus</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-siri uppercase tracking-wider">Santunan Lelayu Tersalur</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                Rp 45.000.000
              </h3>
              <p className="text-xs text-slate-500">Total santunan duka cita tahun berjalan</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
              Disalurkan ke 9 keluarga duka
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-sky-dark uppercase tracking-wider">Bantuan Warga Sakit</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                Rp 18.500.000
              </h3>
              <p className="text-xs text-slate-500">Bantuan rawat inap & obat darurat</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
              Disalurkan ke 7 warga perantau
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Armada Ambulans</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-1">
                1 Unit Siaga
              </h3>
              <p className="text-xs text-slate-500">Operasional 24 jam di Timika</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-gold">
              Siaga antar jemput pasien/jenazah
            </div>
          </div>

        </div>

        {/* 2. REKENING RESMI & CARA SALUR IURAN */}
        <section className="bg-canvas-soft rounded-2xl border border-slate-200/90 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider mb-2">
                <CreditCard className="w-4 h-4" />
                <span>Rekening Resmi Paguyuban</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                Salurkan Iuran & Donasi Kas Kemanusiaan
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Untuk menjaga akuntabilitas, seluruh transaksi iuran kas sosial bulanan (Rp 20.000 / KK) maupun sumbangan sukarela warga disalurkan melalui satu pintu rekening resmi KKS Kabupaten Mimika.
              </p>
              
              <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Bank Rakyat Indonesia (BRI)</span>
                  <div className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900 tracking-wider">
                    0321-01-001234-53-9
                  </div>
                  <span className="text-xs text-slate-600">Atas Nama: <strong>KKS KABUPATEN MIMIKA</strong></span>
                </div>
                <div className="px-3 py-1.5 bg-canvas-soft border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                  Rekening Resmi
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-3">Ketentuan Penyaluran Santunan</h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-siri mt-1.5 flex-shrink-0"></span>
                  <span><strong>Santunan Duka Cita:</strong> Rp 5.000.000 diberikan langsung kepada ahli waris warga yang terdaftar di buku anggota KKS Mimika.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-siri mt-1.5 flex-shrink-0"></span>
                  <span><strong>Armada Ambulans:</strong> Bebas biaya operasional bagi keluarga duka warga terdaftar untuk pengantaran jenazah di area Timika.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-siri mt-1.5 flex-shrink-0"></span>
                  <span><strong>Pelaporan:</strong> Cukup laporkan ke koordinator sektor setempat dengan menunjukkan nomor kartu anggota KKS.</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* 3. CATATAN MUTASI TERBARU */}
        <section>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Catatan Mutasi Kas Terbuka
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Pencatatan mutasi penerimaan dan pengeluaran dana paguyuban terkini.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Diperbarui Berkala</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((t) => (
                <div key={t.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-canvas-soft transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl mt-0.5 ${t.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {t.type === 'in' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {t.desc}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>{t.date}</span>
                        <span>&bull;</span>
                        <span className="font-semibold text-slate-700">{t.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`text-sm sm:text-base font-extrabold font-mono sm:text-right ${t.type === 'in' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {t.type === 'in' ? `+ ${t.amount}` : `- ${t.amount}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
