import { db } from "./client";
import {
  wargaRantau,
  wartaPaguyuban,
  kasSosial,
  direktoriNiaga,
} from "./schema";

async function seed() {
  console.log("🌱 Memulai seeding database KKS Mimika...");

  // 1. Seed Warga Rantau
  const dummyWarga = [
    {
      namaLengkap: "H. Andi Baso Mappatunru",
      nik: "7312011504780001",
      noKk: "7312012005080002",
      noWa: "6281248011234",
      kecamatanAsal: "Lalabata" as const,
      domisiliTimika: "Kuala Kencana, Blok C No. 14",
      jumlahKeluarga: 4,
      statusVerifikasi: "verified" as const,
      catatanAdmin: "Sesepuh paguyuban distrik Kuala Kencana",
    },
    {
      namaLengkap: "Hj. Siti Aminah Tenri",
      nik: "7312024508820003",
      noKk: "7312021109050001",
      noWa: "6282198002345",
      kecamatanAsal: "Liliriaja" as const,
      domisiliTimika: "Timika Kota, Jl. Yos Sudarso",
      jumlahKeluarga: 5,
      statusVerifikasi: "verified" as const,
      catatanAdmin: "Koordinator warta konsumsi",
    },
    {
      namaLengkap: "Muhammad Arsyad Patarai",
      nik: "7312032203900002",
      noKk: "7312030101150004",
      noWa: "6285244119988",
      kecamatanAsal: "Marioriwawo" as const,
      domisiliTimika: "SP 2 (Wanagon), Jalur 3",
      jumlahKeluarga: 3,
      statusVerifikasi: "pending" as const,
      catatanAdmin: "Pendaftar baru via portal mandiri",
    },
    {
      namaLengkap: "Baharuddin Latif, S.T.",
      nik: "7312041211850005",
      noKk: "7312040908120001",
      noWa: "6281355447711",
      kecamatanAsal: "Marioriawa" as const,
      domisiliTimika: "SP 3 (Karang Senang), Jl. Rajawali",
      jumlahKeluarga: 4,
      statusVerifikasi: "verified" as const,
      catatanAdmin: "Teknisi kelistrikan Kuala Kencana",
    },
    {
      namaLengkap: "Tenri Angka Sulaeman",
      nik: "7312051906950004",
      noKk: "7312050204180003",
      noWa: "6281149998811",
      kecamatanAsal: "Donri-Donri" as const,
      domisiliTimika: "SP 4 (Wonorejo), Jalur 5",
      jumlahKeluarga: 2,
      statusVerifikasi: "pending" as const,
      catatanAdmin: "Perlu konfirmasi nomor KK terbaru",
    },
    {
      namaLengkap: "Andi Syamsul Rijal",
      nik: "7312061010880007",
      noKk: "7312062002140002",
      noWa: "6282291005544",
      kecamatanAsal: "Citta" as const,
      domisiliTimika: "Timika Kota, Jl. Budi Utomo",
      jumlahKeluarga: 3,
      statusVerifikasi: "pending" as const,
      catatanAdmin: "Menunggu verifikasi ketua sektor Timika Kota",
    },
    {
      namaLengkap: "Drs. H. Mulyadi Parenrengi",
      nik: "7312010101700009",
      noKk: "7312011212950001",
      noWa: "6281248003344",
      kecamatanAsal: "Lilirilau" as const,
      domisiliTimika: "Timika Kota, Jl. Cenderawasih",
      jumlahKeluarga: 6,
      statusVerifikasi: "verified" as const,
      catatanAdmin: "Pengurus Bidang Kerohanian & Fardhu Kifayah",
    },
    {
      namaLengkap: "Rustam Rusdi",
      nik: "7312011807920008",
      noKk: "7312010808160002",
      noWa: "6285399887766",
      kecamatanAsal: "Lalabata" as const,
      domisiliTimika: "SP 1 (Kamoro Jaya), Jalur 2",
      jumlahKeluarga: 1,
      statusVerifikasi: "rejected" as const,
      catatanAdmin: "NIK tidak terdata di Disdukcapil Soppeng/Mimika",
    },
  ];

  console.log("Inserting Warga Rantau...");
  for (const w of dummyWarga) {
    await db
      .insert(wargaRantau)
      .values(w)
      .onConflictDoUpdate({
        target: wargaRantau.nik,
        set: {
          namaLengkap: w.namaLengkap,
          domisiliTimika: w.domisiliTimika,
          statusVerifikasi: w.statusVerifikasi,
          catatanAdmin: w.catatanAdmin,
        },
      });
  }

  // 2. Seed Warta Paguyuban
  const dummyWarta = [
    {
      judul: "Berita Duka: Berpulangnya Almarhum Ambo Dalle (62 Thn)",
      kategori: "duka_cita" as const,
      ringkasan:
        "Innalillahi wa inna ilaihi raji'un. Telah berpulang warga kerukunan asal Marioriwawo di RSMM Timika.",
      konten:
        "Telah berpulang ke Rahmatullah, saudara kita Bapak Ambo Dalle bin Pettasiri (62 tahun) pada hari Minggu pagi di RSMM Caritas Timika. Jenazah saat ini disemayamkan di rumah duka Jl. Hasanuddin Jalur 2, Timika. Fardhu kifayah dan pemakaman akan dilaksanakan bakda Ashar di TPU SP 1 Timika.",
      kontakDaruratWa: "6281248011234",
      lokasiAcara: "Rumah Duka: Jl. Hasanuddin Jalur 2, Timika Kota",
      tanggalPeristiwa: "2026-09-06",
      statusTayang: "published" as const,
    },
    {
      judul: "Kabar Suka Cita: Aqiqah & Syukuran Putra Pertama Keluarga Baharuddin",
      kategori: "suka_cita" as const,
      ringkasan:
        "Alhamdulillah telah lahir putra pertama dari ananda Baharuddin Latif & Nur Halimah.",
      konten:
        "Keluarga besar KKS Kabupaten Mimika mengundang seluruh bapak/ibu warga rantau Soppeng dalam rangka tasmiyah dan aqiqah ananda Muhammad Latemmamala Al-Farizi yang insya Allah digelar di kediaman SP 3 Jalur Rajawali.",
      kontakDaruratWa: "6281355447711",
      lokasiAcara: "Kediaman SP 3 (Karang Senang), Jl. Rajawali",
      tanggalPeristiwa: "2026-09-12",
      statusTayang: "published" as const,
    },
    {
      judul: "Agenda Silaturahmi: Halal Bihalal & Pengajian Rutin Triwulan KKS Mimika",
      kategori: "agenda_kegiatan" as const,
      ringkasan:
        "Pertemuan silaturahmi akbar warga Soppeng se-Kabupaten Mimika di Aula Gedung Tongkonan Timika.",
      konten:
        "Mari pererat tali persaudaraan Salipuri Temmadinging dan Dongiri Temmatipa. Diharapkan kehadiran seluruh sesepuh, pengurus sektor distrik, serta pemuda/i paguyuban. Dilengkapi taushiyah dan santap siang bersama coto & songkolo khas Soppeng.",
      kontakDaruratWa: "6282198002345",
      lokasiAcara: "Aula Pertemuan KKS Timika, Jl. Cenderawasih SP 2",
      tanggalPeristiwa: "2026-09-20",
      statusTayang: "published" as const,
    },
  ];

  console.log("Inserting Warta Paguyuban...");
  for (const wt of dummyWarta) {
    await db.insert(wartaPaguyuban).values(wt);
  }

  // 3. Seed Kas Sosial
  const dummyKas = [
    {
      jenisTransaksi: "masuk" as const,
      peruntukan: "kas_siaga" as const,
      nominal: "15000000.00",
      keterangan: "Saldo awal kas paguyuban tahun berjalan 2026",
      namaPenyetorPenerima: "Kas Asli Bendahara KKS",
      tanggalTransaksi: "2026-08-01",
    },
    {
      jenisTransaksi: "masuk" as const,
      peruntukan: "iuran_warga" as const,
      nominal: "3500000.00",
      keterangan: "Iuran bulanan kolektif warga distrik Kuala Kencana",
      namaPenyetorPenerima: "H. Andi Baso Mappatunru",
      tanggalTransaksi: "2026-08-25",
    },
    {
      jenisTransaksi: "masuk" as const,
      peruntukan: "iuran_warga" as const,
      nominal: "2750000.00",
      keterangan: "Iuran bulanan warga sektor Timika Kota & SP 2",
      namaPenyetorPenerima: "Andi Syamsul Rijal",
      tanggalTransaksi: "2026-08-28",
    },
    {
      jenisTransaksi: "keluar" as const,
      peruntukan: "santunan_duka" as const,
      nominal: "5000000.00",
      keterangan: "Santunan duka lelayu & fardhu kifayah Almarhum Ambo Dalle",
      namaPenyetorPenerima: "Keluarga Duka Ambo Dalle",
      tanggalTransaksi: "2026-09-06",
    },
    {
      jenisTransaksi: "keluar" as const,
      peruntukan: "kegiatan_silaturahmi" as const,
      nominal: "1250000.00",
      keterangan: "Uang muka sewa tenda & konsumsi pengajian triwulan KKS",
      namaPenyetorPenerima: "Panitia Pertemuan Triwulan",
      tanggalTransaksi: "2026-09-05",
    },
  ];

  console.log("Inserting Kas Sosial...");
  for (const k of dummyKas) {
    await db.insert(kasSosial).values(k);
  }

  // 4. Seed Direktori Niaga
  const dummyNiaga = [
    {
      namaUsaha: "Coto Makassar & Konro Latemmamala Timika",
      namaPemilik: "Andi Baso Mappatunru",
      kategoriUsaha: "Kuliner",
      alamatUsahaTimika: "Jl. Yos Sudarso No. 88 (Dekat Pasar Lama Timika)",
      waBisnis: "6281248011234",
      isActive: true,
    },
    {
      namaUsaha: "Bengkel Las & Bubut Bugis Jaya SP 2",
      namaPemilik: "Baharuddin Latif",
      kategoriUsaha: "Jasa Teknik & Konstruksi",
      alamatUsahaTimika: "Jl. Poros SP 2 Wanagon No. 45",
      waBisnis: "6281355447711",
      isActive: true,
    },
    {
      namaUsaha: "Toko Kelontong & Beras Siri' Na Pacce",
      namaPemilik: "Hj. Siti Aminah Tenri",
      kategoriUsaha: "Toko Sembako & Retail",
      alamatUsahaTimika: "Jl. Cenderawasih SP 2 (Depan Polsek)",
      waBisnis: "6282198002345",
      isActive: true,
    },
    {
      namaUsaha: "Jasa Angkutan & Logistik Rantau Pomako",
      namaPemilik: "Muhammad Arsyad Patarai",
      kategoriUsaha: "Transportasi & Ekspedisi",
      alamatUsahaTimika: "Jl. Pelabuhan Pomako, Timika",
      waBisnis: "6285244119988",
      isActive: true,
    },
  ];

  console.log("Inserting Direktori Niaga...");
  for (const n of dummyNiaga) {
    await db.insert(direktoriNiaga).values(n);
  }

  // 5. Seed Akun Admin Pengurus
  const { hashPassword } = await import("./auth/password");
  const defaultPassword = await hashPassword("AdminKKS2026!");

  const dummyAdmins = [
    {
      namaLengkap: "Administrator Pusat KKS",
      email: "admin@kks-mimika.id",
      passwordHash: defaultPassword,
      noWa: "6281248011234",
      role: "superadmin" as const,
      jabatan: "Ketua Paguyuban KKS Mimika",
      isActive: true,
    },
    {
      namaLengkap: "H. Baso Tenriangka",
      email: "sekretaris@kks-mimika.id",
      passwordHash: defaultPassword,
      noWa: "6282198002345",
      role: "pengurus" as const,
      jabatan: "Sekretaris Jenderal",
      isActive: true,
    },
    {
      namaLengkap: "Hj. Ratna Indasari",
      email: "bendahara@kks-mimika.id",
      passwordHash: defaultPassword,
      noWa: "6281355447711",
      role: "pengurus" as const,
      jabatan: "Bendahara Sosial",
      isActive: true,
    },
  ];

  console.log("Inserting Admin Users...");
  for (const admin of dummyAdmins) {
    await db.insert(adminUsers).values(admin).onConflictDoNothing();
  }

  console.log("✅ Seeding database KKS Mimika selesai dengan sukses!");
}

seed()
  .catch((err) => {
    console.error("❌ Gagal melakukan seeding:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
