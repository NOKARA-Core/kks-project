# Product Requirement Document (PRD) — KKS(Kerukunan Keluarga Soppeng) Kabupaten Mimika

## 1. Hakikat & Visi Komunitas
Portal resmi paguyuban Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika (Timika), Papua Tengah. Menjadi simpul silaturahmi digital warga perantau asal Kabupaten Soppeng (Bumi Latemmamala) yang bermukim, berdagang, berkarya, dan berkeluarga di Tanah Amungsa/Mimika.

## 2. Penyelarasan Falsafah Soppeng di Tanah Rantau Mimika
- Dongiri Temmatipa: Pengurus dan sesepuh aktif memberi bimbingan, arahan usaha, dan pengayoman moril bagi perantau.
- Salipuri Temmadinging: Saling menopang kebutuhan sosial dasar—tanggap lelayu/kematian, kas duka, dan bantuan warga sakit.
- Wesse Temmakapa: Menjaga kerukunan internal paguyuban serta hidup berdampingan secara damai dan menghormati adat istiadat masyarakat Papua di Mimika.
- 5 Asas Karawi (Ade, Rapang, Bicara, Wari, Sara): Pegangan musyawarah mufakat, tata krama, hukum adat, dan syariat agama.
- Lambang Duta Kakatua & Karawi: Membawa kabar baik dan menjaga keluhuran budi pekerti perantau.

## 3. Ruang Lingkup Sistem (Multi-Page Portal Komunitas)
### apps/web (Sisi Publik):
1. Navigasi Terapung (Sticky Floating Navbar):
   - Menu berjarak renggang dengan hover dropdown mulus (smooth ease-out transition).
   - Pengelompokan sub-kategori komunitas.
2. Halaman Beranda (`/`):
   - Hero Section split 50/50 responsif (Mobile: foto landscape di atas).
   - Pilar Nilai Luhur Rantau (Dongiri Temmatipa, Salipuri Temmadinging, Wesse Temmakapa).
   - Kabar Duka & Lelayu Warga (High Priority Alert: info rumah duka Timika & tombol takziah WA).
   - Cuplikan Usaha & Jasa Warga Rantau (UMKM).
   - Widget Transparansi Dana Sosial / Kas Duka.
3. Halaman Profil Paguyuban (`/profil`):
   - Sejarah perantau Bugis-Soppeng di Timika.
   - Bagan Pengurus KKS Kabupaten Mimika & kontak perwakilan sektor/distrik.
   - Penjelasan falsafah 3 pilar dan 5 asas adat.
4. Halaman Warta Warga (`/warta`):
   - Tab Berita Duka (Lelayu) vs Tab Berita Syukuran (Pernikahan/Kelahiran).
   - Agenda Silaturahmi (Halal Bihalal, pengajian rutin, pertemuan bulanan).
5. Halaman Direktori Warga (`/niaga`):
   - Etalase usaha/jasa warga Soppeng di Timika (kuliner, bengkel, toko, kontraktor).
   - Tautan langsung ke nomor WhatsApp pemilik usaha.
6. Halaman Pendataan Warga (`/pendataan` atau `/warga`):
   - Formulir pendaftaran warga paguyuban yang hangat dan mudah (bukan formulir kaku birokrasi).
   - Pengecekan status data warga terdaftar.

### apps/admin (Sisi Pengurus Paguyuban):
- Verifikasi pengajuan data warga rantau baru per sektor domisili di Timika.
- Input dan publikasi berita suka/duka dengan template notifikasi cepat.
- Pembukuan kas sosial dan santunan lelayu terbuka.
