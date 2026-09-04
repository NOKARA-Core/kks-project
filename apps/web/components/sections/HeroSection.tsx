import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, HeartHandshake, Users } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-canvas-soft overflow-hidden min-h-[calc(100vh-6rem)] flex items-center pt-8 pb-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Mobile Image Top - Desktop Right */}
          <div className="lg:order-last order-first relative w-full h-[260px] sm:h-[350px] lg:h-full lg:min-h-[520px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-sky/5 rounded-3xl -rotate-3 scale-[1.02] -z-10 transition-transform duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953eb1b5b6?q=80&w=2070&auto=format&fit=crop" 
              alt="Silaturahmi Paguyuban KKS Timika" 
              className="w-full h-full object-cover rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/50"
            />
            
            {/* Urgent Alert Floating Card */}
            <div className="absolute -bottom-6 -left-4 lg:bottom-10 lg:-left-12 bg-white rounded-xl shadow-xl shadow-slate-200/50 border-l-4 border-l-siri p-4 pr-6 flex items-start gap-4 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-siri/10 p-2 rounded-full mt-0.5">
                <HeartHandshake className="w-5 h-5 text-siri" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">Siaga Duka Aktif</span>
                <span className="text-xs text-slate-600 mt-1 leading-relaxed">Kas sosial dan ambulans paguyuban tersedia 24/7 untuk warga.</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center order-last lg:order-first">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-sky-light shadow-sm w-fit mb-8 gap-2">
              <span className="w-2 h-2 rounded-full bg-sky animate-pulse"></span>
              <span className="text-xs font-bold tracking-wide text-sky-dark uppercase">Yassisoppengi &bull; Wesse Temmakapa</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-6 tracking-tight">
              Rumah Silaturahmi <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-dark">
                Perantau Soppeng
              </span> <br className="hidden lg:block" />
              di Mimika
            </h1>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
              Wadah persaudaraan warga Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika. Menjaga kerukunan, saling menopang dalam duka, dan merawat nilai leluhur di Tanah Papua.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Link 
                href="/pendataan"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gold hover:bg-gold-dark text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <span>Daftar Warga Rantau</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/pendataan"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 hover:border-gold hover:text-gold text-slate-700 font-semibold rounded-xl transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Cek Status Warga</span>
              </Link>
            </div>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/70">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-3xl font-extrabold text-slate-900">450+</span>
                </div>
                <span className="text-sm font-medium text-slate-500">KK Terdata</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span className="text-3xl font-extrabold text-slate-900">12</span>
                </div>
                <span className="text-sm font-medium text-slate-500">Sektor Wilayah</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <HeartHandshake className="w-4 h-4 text-sky" />
                  <span className="text-3xl font-extrabold text-slate-900 text-sky-dark">Siaga</span>
                </div>
                <span className="text-sm font-medium text-slate-500">Kas Sosial & Duka</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
