import Link from 'next/link';
import Image from 'next/image';
import { HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { formatWhatsAppUrl } from '@repo/database';


export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          
          {/* Kolom 1 & 2: Identitas & Filosofi */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src="/logo-kks.svg"
                  alt="Logo KKS Timika"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-gold transition-colors leading-tight">
                  KKS Timika
                </span>
                <span className="text-xs text-gold font-medium uppercase tracking-widest mt-0.5">
                  Kerukunan Keluarga Soppeng Kab. Mimika
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mt-2">
              Wadah silaturahmi, pengayoman, dan gotong royong warga perantau asal Kabupaten Soppeng (Bumi Latemmamala) yang bermukim dan berkarya di Tanah Amungsa/Mimika, Papua Tengah.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide pt-2">
              <span>Dongiri Temmatipa</span>
              <span>&bull;</span>
              <span>Salipuri Temmadinging</span>
              <span>&bull;</span>
              <span>Wesse Temmakapa</span>
            </div>
          </div>

          {/* Kolom 3: Navigasi Profil & Warta */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Halaman Utama</span>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/profil" className="hover:text-gold transition-colors">
                  Profil & Falsafah
                </Link>
              </li>
              <li>
                <Link href="/profil#pengurus" className="hover:text-gold transition-colors">
                  Badan Pengurus Mimika
                </Link>
              </li>
              <li>
                <Link href="/warta" className="hover:text-gold transition-colors">
                  Warta & Berita Komunitas
                </Link>
              </li>
              <li>
                <Link href="/warta#duka" className="hover:text-siri transition-colors">
                  Kabar Duka & Lelayu
                </Link>
              </li>
              <li>
                <Link href="/warta#agenda" className="hover:text-gold transition-colors">
                  Agenda Silaturahmi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Niaga & Layanan Sosial */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Layanan Warga</span>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/pendataan" className="hover:text-gold transition-colors">
                  Pendataan Warga Rantau
                </Link>
              </li>
              <li>
                <Link href="/pendataan#cek-status" className="hover:text-gold transition-colors">
                  Cek Nomor Anggota
                </Link>
              </li>
              <li>
                <Link href="/niaga" className="hover:text-gold transition-colors">
                  Direktori UMKM Rantau
                </Link>
              </li>
              <li>
                <Link href="/niaga#daftar-usaha" className="hover:text-gold transition-colors">
                  Daftarkan Usaha Warga
                </Link>
              </li>
              <li>
                <Link href="/sosial" className="hover:text-gold transition-colors">
                  Transparansi Kas Sosial
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 5: Kontak & Sekretariat */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Sekretariat Mimika</span>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="leading-snug">{siteConfig.alamatSekretariat}</span>
              </div>
              <a
                href={formatWhatsAppUrl(
                  siteConfig.hotlineWa,
                  "Halo Sekretariat KKS Mimika, saya ingin menghubungi layanan warga."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Hotline: +{siteConfig.hotlineWa}</span>
              </a>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{siteConfig.emailSekretariat}</span>
              </div>

              <div className="mt-2 p-3 bg-canvas-soft rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                <HeartHandshake className="w-5 h-5 text-siri flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">Salipuri Temmadinging</span>
                  <span className="text-[11px] text-slate-500">Bantuan lelayu dan sosial 24 jam</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Baris Bawah */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika. Yassisoppengi.</p>
          <div className="flex items-center gap-6">
            <Link href="/profil#falsafah" className="hover:text-slate-900 transition-colors">Falsafah Adat</Link>
            <Link href="/sosial" className="hover:text-slate-900 transition-colors">Kas Terbuka</Link>
            <Link href="/pendataan" className="hover:text-slate-900 transition-colors">Buku Warga</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
