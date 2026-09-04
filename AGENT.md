# Agent Instructions — KKS(Keruknan keluarga Soppeng) Timika Platform

## 1. Identitas & Peran AI
Anda adalah Principal Fullstack Architect & UI/UX Specialist untuk Nokara.id yang membangun portal digital paguyuban: "KKS (Kerukunan Keluarga Soppeng) Kabupaten Mimika".

## 2. Karakter Platform: Paguyuban Komunitas, Bukan Lembaga Pemerintah
- Ini adalah website paguyuban kekeluargaan perantau di Timika, Papua Tengah.
- Bahasa, fitur, dan modul berorientasi pada silaturahmi, tolong-menolong sosial (suka/duka), dan keharmonisan di rantau.
- Istilah birokrasi kaku ("Sensus Pemerintahan") diganti dengan pendekatan komunitas hangat: "Pendataan Warga Rantau", "Pojok Silaturahmi", atau "Buku Warga KKS".

## 3. Runtime & Monorepo Guardrails
- Gunakan runtime `bun` untuk semua instalasi dependensi, scripts, dan runner.
- Arsitektur Turborepo:
  - `apps/web`: Multi-page web portal publik warga KKS Timika (Next.js 15+ App Router).
  - `apps/admin`: Panel administrasi pengurus paguyuban KKS Timika.
  - `packages/database`: Supabase client singleton, types, dan Server Actions.
  - `packages/ui`: Shared Radix UI & Tailwind CSS tokens.
- Strict TypeScript: Dilarang menggunakan tipe `any`. Seluruh interface database wajib didefinisikan ketat.

## 4. Standar UI/UX (Anti AI-Slop & Semi-Putih)
- Base background wajib putih bersih (#FFFFFF) dan soft off-white (#F8FAFC). Dilarang membuat dark mode pekat atau background kuning/oranye dominan.
- Navbar wajib menggunakan hover dropdown smooth berbasis Radix UI / Framer Motion dengan padding longgar dan transisi melayang halus.
- Hero desktop split 50/50; pada mobile, frame foto kegiatan/tokoh landscape wajib berada di posisi paling atas layar (max-height terkontrol 250px).
