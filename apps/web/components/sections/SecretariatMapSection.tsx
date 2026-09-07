import { MapPin, Phone, Mail, Clock, ExternalLink, MessageCircle, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { formatWhatsAppUrl } from "@/lib/utils";
import { ScrollReveal } from "../motion/ScrollReveal";

interface SecretariatMapSectionProps {
  className?: string;
}

export function SecretariatMapSection({ className = "" }: SecretariatMapSectionProps) {
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Sekretariat KKS Timika, ${siteConfig.alamatSekretariat}`
  )}`;

  const waSekretariatUrl = formatWhatsAppUrl(
    siteConfig.hotlineWa,
    "Halo Sekretariat KKS Kabupaten Mimika, saya ingin menanyakan informasi layanan warga / sekretariat."
  );

  return (
    <section className={`py-10 sm:py-14 bg-white border-b border-slate-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Header - Law of Proximity */}
        <ScrollReveal>
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Pusat Informasi & Pelayanan Warga
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Sekretariat Paguyuban KKS Mimika
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Pintu terbuka bagi seluruh sanak warga perantau Soppeng yang baru tiba di Timika, memerlukan pendampingan sosial, konsultasi kependudukan paguyuban, maupun silaturahmi berkala.
            </p>
          </div>
        </ScrollReveal>

        {/* Konten Grid 2 Kolom: Kartu Informasi & Peta Lokasi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Sisi Kiri: Rincian Alamat, Kontak & Jam Operasional (5 Kolom) */}
          <ScrollReveal delay={0.1} className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-canvas-soft rounded-2xl border border-slate-200/80 p-5 sm:p-7 space-y-5 h-full flex flex-col justify-between shadow-2xs">
              
              <div className="space-y-4">
                {/* Alamat Fisik */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-primary flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Alamat Sekretariat:
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {siteConfig.alamatSekretariat}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kabupaten Mimika, Papua Tengah &bull; Kode Pos 99910
                    </p>
                  </div>
                </div>

                {/* Jam Operasional */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Jam Layanan Tatap Muka:
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      Senin – Sabtu: 09.00 – 17.00 WIT
                    </p>
                    <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Layanan Tanggap Duka: Siaga 24 Jam</span>
                    </div>
                  </div>
                </div>

                {/* Kontak Resmi */}
                <div className="pt-2 border-t border-slate-200/70 space-y-2 text-xs sm:text-sm">
                  <a
                    href={waSekretariatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-slate-700 hover:text-primary transition-colors py-1"
                  >
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Hotline / WhatsApp: <strong>+{siteConfig.hotlineWa}</strong></span>
                  </a>
                  <div className="flex items-center gap-2.5 text-slate-700 py-1">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Email: <strong>{siteConfig.emailSekretariat}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200/70 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition shadow-xs flex-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Google Maps</span>
                </a>
                <a
                  href={waSekretariatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition shadow-xs flex-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat Pengurus</span>
                </a>
              </div>

            </div>
          </ScrollReveal>

          {/* Sisi Kanan: Bingkai Peta Interaktif Tersemat (7 Kolom) */}
          <ScrollReveal delay={0.2} className="lg:col-span-7">
            <div className="relative w-full h-[320px] sm:h-[400px] lg:h-full min-h-[320px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-slate-100 group">
              {/* Google Maps Embed iframe */}
              <iframe
                title="Peta Lokasi Sekretariat KKS Kabupaten Mimika"
                src="https://maps.google.com/maps?q=Timika+Papua+Tengah&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter saturate-90 contrast-95 hover:filter-none transition-all duration-300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Information Chip di Sudut Kiri Bawah Peta */}
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-3 shadow-sm flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">
                      Sekretariat KKS Mimika
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Timika, Kabupaten Mimika, Papua Tengah
                    </p>
                  </div>
                </div>
                <a
                  href={gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline shrink-0"
                >
                  <span>Petunjuk Arah</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
}
