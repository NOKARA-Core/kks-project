# Spesifikasi Navigasi & Halaman Multi-Page — apps/web

## 1. Arsitektur Navbar (Hover Dropdown & Sub-Kategori)
- Logo: KKS Timika & semboyan Yassisoppengi.
- Menu Navigasi:
  1. Menu "Profil Paguyuban" (Hover Dropdown Smooth):
     - Visi & Misi Komunitas (`/profil#visi-misi`)
     - Falsafah Luhur di Tanah Rantau (`/profil#falsafah`)
     - Pengurus KKS Kab. Mimika (`/profil#pengurus`)
     - Sejarah Perantau di Mimika (`/profil#sejarah`)
  2. Menu "Warta Warga" (Hover Dropdown Smooth):
     - Kabar Duka & Lelayu (`/warta#duka`)
     - Berita Suka Cita & Syukuran (`/warta#sukacita`)
     - Agenda Pertemuan & Silaturahmi (`/warta#agenda`)
  3. Menu "Niaga Rantau" (Hover Dropdown Smooth):
     - Direktori Usaha Warga (`/niaga`)
     - Daftarkan Usaha Warga (`/niaga#daftar-usaha`)
  4. Menu "Kas Sosial" (Direct Link):
     - Transparansi Iuran & Santunan (`/sosial`)
  5. Tombol Aksi Kanan (CTA Gold Button):
     - "Daftar Warga Rantau" (`/pendataan`)

## 2. Rincian 5 Rute Halaman
- `/` (Beranda):
  - Responsive Split Hero (Desktop: 50/50; Mobile: Foto di atas).
  - Teaser 3 Pilar: Pengayoman, Kepedulian Sosial, Kerukunan di Mimika.
  - Kartu Darurat Lelayu Terkini (Border Merah + tombol Takziah WA).
  - Sorotan 3 UMKM warga di Timika.
  - Widget Kas Transparan & Rekening Paguyuban.
- `/profil`: Narasi ikatan emosional perantau Soppeng di Timika, uraian 3 pilar dan 5 asas adat, susunan badan pengurus paguyuban KKS Mimika per sektor wilayah.
- `/warta`: Tab pemisah Berita Duka & Takziah vs Berita Suka Cita, disertai kalender kegiatan halal bihalal atau arisan paguyuban.
- `/niaga`: Katalog direktori usaha sesama warga Soppeng di Timika lengkap dengan tautan pesan langsung WhatsApp pemilik.
- `/pendataan`: Formulir pendaftaran anggota paguyuban mandiri (Nama, Asal Kecamatan di Soppeng, Domisili Distrik/Jalan di Timika, No. WA) dan cek status nomor anggota.
