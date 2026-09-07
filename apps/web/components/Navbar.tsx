'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const navItems = [
  {
    name: 'Profil Paguyuban',
    subitems: [
      { name: 'Visi & Misi', href: '/profil#visi-misi' },
      { name: 'Falsafah 3 Pilar & 5 Asas', href: '/profil#falsafah' },
      { name: 'Badan Pengurus Mimika', href: '/profil#pengurus' },
      { name: 'Sejarah Perantau', href: '/profil#sejarah' },
    ],
  },
  {
    name: 'Warta Warga',
    subitems: [
      { name: 'Kabar Duka & Lelayu', href: '/warta#duka' },
      { name: 'Berita Sukacita & Syukuran', href: '/warta#sukacita' },
      { name: 'Agenda Silaturahmi', href: '/warta#agenda' },
    ],
  },
  {
    name: 'Niaga Rantau',
    subitems: [
      { name: 'Direktori Usaha Warga', href: '/niaga' },
      { name: 'Daftarkan Usaha', href: '/niaga#daftar-usaha' },
    ],
  },
  {
    name: 'Kas Sosial',
    href: '/sosial',
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/logo-kks.svg"
                  alt="Logo Kerukunan Keluarga Soppeng Kab. Mimika"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-gold transition-colors leading-tight">
                  KKS Timika
                </span>
                <span className="text-xs text-gold font-semibold uppercase tracking-widest leading-none mt-0.5">
                  Yassisoppengi
                </span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              item.subitems ? (
                <div 
                  key={item.name}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors py-4">
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-0 top-full pt-1 w-64"
                      >
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-3 flex flex-col gap-1 relative overflow-hidden">
                          {item.subitems.map((subitem) => (
                            <Link 
                              key={subitem.name} 
                              href={subitem.href}
                              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-canvas-soft rounded-xl transition-all"
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors py-4"
                >
                  {item.name}
                </Link>
              )
            ))}
            
            <Link 
              href="/pendataan"
              className="ml-4 px-6 py-2.5 bg-gold hover:bg-gold-dark text-white font-semibold rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              Daftar Warga Rantau
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-900 p-2 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 flex flex-col gap-5">
              {navItems.map((item) => (
                <div key={item.name} className="flex flex-col gap-2">
                  {item.subitems ? (
                    <>
                      <div className="font-semibold text-slate-900 px-2">{item.name}</div>
                      <div className="flex flex-col pl-4 gap-1 border-l-2 border-slate-100 ml-3">
                        {item.subitems.map((subitem) => (
                          <Link 
                            key={subitem.name} 
                            href={subitem.href}
                            className="text-slate-600 hover:text-gold font-medium text-sm py-2 px-3 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link 
                      href={item.href}
                      className="font-semibold text-slate-900 px-2 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <Link 
                href="/pendataan"
                onClick={() => setIsOpen(false)}
                className="mt-6 mx-2 px-6 py-3.5 text-center bg-gold hover:bg-gold-dark text-white font-semibold rounded-xl transition-all shadow-sm"
              >
                Daftar Warga Rantau
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
