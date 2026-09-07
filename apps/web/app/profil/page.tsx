import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, Users, Award, MapPin, CheckCircle2, History } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Profil & Falsafah Paguyuban',
  description:
    'Profil resmi Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika. Menelusuri sejarah perantau, visi misi, 3 pilar luhur, 5 asas adat Karawi, dan struktur kepengurusan di Tanah Amungsa.',
};

export default function ProfilPage() {
  return (
    <main className="w-full pb-20">
      
      {/* Header Halaman */}
      <header className="bg-canvas-soft border-b border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Tentang Paguyuban</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
              Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Wadah kekeluargaan dan persaudaraan masyarakat perantau asal Kabupaten Soppeng (Bumi Latemmamala), Sulawesi Selatan yang mengabdi, berwirausaha, dan membina kerukunan di Tanah Papua.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 flex flex-col gap-16 sm:gap-20">

        {/* 1. SEJARAH PERANTAU (#sejarah) */}
        <section id="sejarah" className="scroll-mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Napak Tilas</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-3">
                Jejak Perantau di Tanah Amungsa
              </h2>
              <div className="p-4 bg-canvas-soft rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 block mb-1">Motto Leluhur:</strong>
                <em>&ldquo;Sompe&rsquo; tennasala, tennapettuseng esso, tennatampu&rsquo; bosi.&rdquo;</em><br />
                Merantau dengan niat luhur, pantang berputus asa di kala badai, serta teguh menjaga kehormatan budi.
              </div>
            </div>
            <div className="lg:col-span-8 flex flex-col gap-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Sejarah kehadiran perantau asal Kabupaten Soppeng di Kabupaten Mimika telah berlangsung lebih dari tiga dekade. Diawali oleh gelombang awal para pedagang, wirausahawan, tenaga profesional, dan pekerja terampil yang turut serta membangun denyut ekonomi Kota Timika sejak era awal pemekaran wilayah.
              </p>
              <p>
                Didorong oleh kesadaran perlunya simpul silaturahmi agar tidak tercerai-berai di perantauan, para sesepuh dan tokoh masyarakat bersepakat mendirikan wadah <strong>Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika</strong>. Paguyuban ini lahir bukan untuk mengkotak-kotakkan diri, melainkan sebagai jembatan persaudaraan yang harmonis dengan seluruh suku bangsa, khususnya masyarakat adat Amungme dan Kamoro di Mimika.
              </p>
            </div>
          </div>
        </section>

        {/* 2. VISI & MISI (#visi-misi) */}
        <section id="visi-misi" className="scroll-mt-28 pt-8 border-t border-slate-100">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Arah & Komitmen</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-3">
              Visi & Misi Paguyuban
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Menjadi payung teduh yang menaungi seluruh warga perantau Soppeng di Tanah Mimika.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Visi Paguyuban</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Terwujudnya paguyuban warga Soppeng yang solid, religius, berdaya saing ekonomi, dan menjunjung tinggi nilai-nilai luhur adat serta mampu hidup berdampingan secara damai dan bermartabat di Kabupaten Mimika.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-sky/10 text-sky-dark flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Misi Utama</h3>
              <ul className="flex flex-col gap-3 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0"></span>
                  <span>Membangun basis data warga perantau yang akurat dan terbuka di seluruh distrik Mimika.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0"></span>
                  <span>Mengoptimalkan kas sosial dan ambulans kemanusiaan untuk santunan duka cita serta warga sakit.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0"></span>
                  <span>Mendorong kemandirian ekonomi warga melalui etalase niaga dan jejaring UMKM sesama perantau.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0"></span>
                  <span>Menjaga sinergi harmonis dengan Pemerintah Daerah Mimika dan lembaga masyarakat adat Papua.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. FALSAFAH 3 PILAR & 5 ASAS ADAT (#falsafah) */}
        <section id="falsafah" className="scroll-mt-28 pt-8 border-t border-slate-100">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Nilai Kebijaksanaan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-3">
              Falsafah Tiga Pilar & Lima Asas Adat Karawi
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Warisan budi pekerti luhur dari Tanah Latemmamala yang senantiasa dibawa ke mana pun kaki melangkah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-canvas-soft border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Dongiri Temmatipa</h3>
              <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-2">Pilar Pengayoman</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pengurus dan sesepuh berdiri di garda terdepan untuk membimbing warga, memediasi perselisihan secara kekeluargaan, serta memberi nasehat hidup.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-canvas-soft border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Salipuri Temmadinging</h3>
              <p className="text-xs text-siri font-semibold uppercase tracking-wider mb-2">Pilar Kepedulian Sosial</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kesiapsiagaan penuh dalam duka cita (*lelayu*), bantuan warga sakit, serta meringankan beban perantau yang tertimpa musibah darurat.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-canvas-soft border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Wesse Temmakapa</h3>
              <p className="text-xs text-sky-dark font-semibold uppercase tracking-wider mb-2">Pilar Kerukunan & Damai</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Teguh menjaga kedamaian dan keharmonisan hidup bersama masyarakat Mimika dengan prinsip adat *&ldquo;Di mana bumi dipijak, di situ langit dijunjung&rdquo;*.
              </p>
            </div>
          </div>

          {/* 5 Asas Adat Karawi */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">5 Asas Adat Karawi Soppeng</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl bg-canvas-soft border border-slate-100">
                <span className="text-xs font-bold text-gold uppercase">1. Ade&rsquo;</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">Hukum & Tradisi</p>
                <p className="text-xs text-slate-500 mt-1">Tata krama, kesopanan, dan norma pergaulan.</p>
              </div>
              <div className="p-4 rounded-xl bg-canvas-soft border border-slate-100">
                <span className="text-xs font-bold text-gold uppercase">2. Rapang</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">Yurisprudensi</p>
                <p className="text-xs text-slate-500 mt-1">Keteladanan dari peristiwa dan putusan masa lalu.</p>
              </div>
              <div className="p-4 rounded-xl bg-canvas-soft border border-slate-100">
                <span className="text-xs font-bold text-gold uppercase">3. Bicara</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">Keadilan Dialog</p>
                <p className="text-xs text-slate-500 mt-1">Musyawarah mufakat demi mencari kebenaran hakiki.</p>
              </div>
              <div className="p-4 rounded-xl bg-canvas-soft border border-slate-100">
                <span className="text-xs font-bold text-gold uppercase">4. Wari&rsquo;</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">Tata Susunan</p>
                <p className="text-xs text-slate-500 mt-1">Penataan derajat, silsilah, dan hak-kewajiban.</p>
              </div>
              <div className="p-4 rounded-xl bg-canvas-soft border border-slate-100">
                <span className="text-xs font-bold text-gold uppercase">5. Sara&rsquo;</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">Syariat Agama</p>
                <p className="text-xs text-slate-500 mt-1">Kaidah keagamaan sebagai landasan spiritual.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BADAN PENGURUS MIMIKA (#pengurus) */}
        <section id="pengurus" className="scroll-mt-28 pt-8 border-t border-slate-100">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Struktur Organisasi</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-3">
              Badan Pengurus KKS Kabupaten Mimika
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Dewan Pembina, Pengurus Harian, serta Koordinator Sektor Wilayah di seluruh distrik Timika.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-5 bg-white rounded-xl border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 flex-shrink-0">
                BP
              </div>
              <div>
                <span className="text-xs font-bold text-gold uppercase">Dewan Pembina / Penasehat</span>
                <h4 className="font-bold text-slate-900 text-base mt-0.5">Sesepuh & Tokoh Warga</h4>
                <p className="text-xs text-slate-500 mt-1">Pengarah kebijakan strategis dan penjaga kehormatan paguyuban.</p>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-base flex-shrink-0">
                KU
              </div>
              <div>
                <span className="text-xs font-bold text-gold uppercase">Ketua Umum Paguyuban</span>
                <h4 className="font-bold text-slate-900 text-base mt-0.5">Badan Pengurus Harian</h4>
                <p className="text-xs text-slate-500 mt-1">Memimpin koordinasi dan pelaksanaan roda kegiatan warga di Mimika.</p>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-siri/10 text-siri flex items-center justify-center font-bold text-base flex-shrink-0">
                KS
              </div>
              <div>
                <span className="text-xs font-bold text-siri uppercase">Bidang Sosial & Duka</span>
                <h4 className="font-bold text-slate-900 text-base mt-0.5">Tim Siaga Lelayu</h4>
                <p className="text-xs text-slate-500 mt-1">Penanggung jawab ambulans, kas duka, dan pendampingan keluarga musibah.</p>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-sky/10 text-sky-dark flex items-center justify-center font-bold text-base flex-shrink-0">
                SW
              </div>
              <div>
                <span className="text-xs font-bold text-sky-dark uppercase">Sektor Mimika Baru</span>
                <h4 className="font-bold text-slate-900 text-base mt-0.5">Koordinator Wilayah Pusat</h4>
                <p className="text-xs text-slate-500 mt-1">Melayani pendataan warga di pusat Kota Timika dan sekitarnya.</p>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-sky/10 text-sky-dark flex items-center justify-center font-bold text-base flex-shrink-0">
                SW
              </div>
              <div>
                <span className="text-xs font-bold text-sky-dark uppercase">Sektor Kuala Kencana</span>
                <h4 className="font-bold text-slate-900 text-base mt-0.5">Koordinator Wilayah Utara</h4>
                <p className="text-xs text-slate-500 mt-1">Melayani silaturahmi perantau kawasan Kuala Kencana & sekitarnya.</p>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-sky/10 text-sky-dark flex items-center justify-center font-bold text-base flex-shrink-0">
                SW
              </div>
              <div>
                <span className="text-xs font-bold text-sky-dark uppercase">Sektor Wania & Pesisir</span>
                <h4 className="font-bold text-slate-900 text-base mt-0.5">Koordinator Wilayah Selatan</h4>
                <p className="text-xs text-slate-500 mt-1">Melayani pendataan warga perantau di SP1, SP4, dan area pesisir Pomako.</p>
              </div>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
