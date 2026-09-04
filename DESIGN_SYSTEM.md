# Design System & Token Panduan — KKS(Kerukunan Keluarga Soppeng) Timika

## 1. Suasana Visual (Clean Light Canvas)
- Prinsip: Bersih, lapang, lega (*breathable space*), ramah keluarga, dan berwibawa.
- Kanvas Utama: Putih Murni (`#FFFFFF`) dan Soft Pearl Gray (`#F8FAFC`).
- Tipografi: Plus Jakarta Sans / Inter.
  - Headings: Slate 900 (`#0F172A`)
  - Body Text: Slate 600 (`#475569`)
  - Borders: Slate 200 (`#E2E8F0`)

## 2. Aksen Warna Simbolis
- Secondary (Kuning Emas Soppeng): `#D97706` / `#B45309` (Aksen tombol utama pendataan warga, lencana kehormatan, highlight).
- Tertiary (Biru Muda Damai): `#38BDF8` / `#E0F2FE` (Garis kartu lembut, tag status kerukunan warga di rantau).
- Alert Duka (Merah Siri'): `#DC2626` (Aksen border kiri kartu lelayu/duka cita dan informasi darurat).

## 3. Komponen Khusus
### Navbar Hover Dropdown Smooth:
- Kontainer sticky floating `bg-white/85 backdrop-blur-md border-b border-slate-100`.
- Jarak antar item menu lapang (`gap-8`), tidak berdesakan.
- Sub-kategori muncul dengan animasi melayang lembut (opacity 0 -> 1, translate-y -4px -> 0px, transisi 200ms ease-out).

### Responsive Hero Section:
- Desktop: Grid 50/50. Kolom kiri memuat teks penyambut kekeluargaan, tombol ganda, dan kartu metrik ringkas. Kolom kanan memuat frame foto landscape foto kegiatan/pejabat KKS (rasio 16:9/3:2) berbingkai rapi (`rounded-2xl border border-slate-200 object-cover`).
- Mobile: Foto landscape tampil di bagian paling atas (max-height 240px-260px), disusul teks dan tombol aksi di bawahnya.
