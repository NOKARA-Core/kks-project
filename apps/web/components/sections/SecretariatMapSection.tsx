import { ScrollReveal } from "../motion/ScrollReveal";

interface SecretariatMapSectionProps {
  className?: string;
}

export function SecretariatMapSection({ className = "" }: SecretariatMapSectionProps) {
  return (
    <section className={`w-full overflow-hidden bg-slate-100 border-b border-slate-200/80 ${className}`}>
      <ScrollReveal>
        <div className="w-full h-[280px] sm:h-[380px] md:h-[440px] lg:h-[480px] relative">
          <iframe
            title="Peta Lokasi Sekretariat KKS Kabupaten Mimika"
            src="https://maps.google.com/maps?q=Timika+Papua+Tengah&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0 block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
