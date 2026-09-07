# Folder Aset Gambar Manual KKS Platform

Folder ini (`apps/web/public/images/`) disiapkan khusus sebagai tempat penyimpanan gambar lokal yang dapat Anda masukkan secara manual:

## Struktur Gambar yang Disarankan:

1. **`hero-banner.jpg`** (atau `.png`, `.webp`):
   - Gambar banner utama yang tampil di bagian paling atas **Hero Section Beranda**.
   - Rasio rekomendasi: **16:9** atau **21:9** (landscape lebar), resolusi optimal: 1920x800 px atau 1200x600 px.

2. **Sub-folder `warta/`** (`apps/web/public/images/warta/`):
   - Simpan foto-foto liputan berita, syukuran warga, atau dokumentasi kegiatan silaturahmi.
   - Contoh: `warta-duka-1.jpg`, `silaturahmi-sektor.jpg`.

3. **Sub-folder `umkm/`** (`apps/web/public/images/umkm/`):
   - Simpan foto-foto etalase usaha warga, produk makanan, atau logo tempat usaha direktori niaga.

> **Catatan Penggunaan di Komponen**:
> File di dalam folder ini otomatis dapat diakses langsung dari root URL Next.js:
> `src="/images/hero-banner.jpg"` atau `src="/images/warta/nama-file.jpg"`.
