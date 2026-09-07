import { db } from "./client";
import {
  wargaRantau,
  wartaPaguyuban,
  kasSosial,
  direktoriNiaga,
  adminUsers,
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
      judul: "Kabar Duka: Telah Berpulang ke Rahmatullah Bapak Ambo Dalle (62 Thn)",
      slug: "kabar-duka-bapak-ambo-dalle",
      kategori: "duka_cita" as const,
      ringkasan:
        "Innalillahi wa inna ilaihi raji'un. Telah berpulang ke rahmatullah salah seorang sesepuh warga Soppeng di Timika, Bapak Ambo Dalle pada usia 62 tahun di RSMM Caritas Timika.",
      kontenUtama:
        "Segenap keluarga besar Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika menyampaikan duka cita yang mendalam atas berpulangnya salah seorang sesepuh kita, Almarhum Bapak Ambo Dalle.\n\nJenazah disemayamkan di rumah duka Jl. Hasanuddin, Timika dan dimakamkan di TPU KM 11 Timika ba'da shalat Ashar. Pengurus KKS telah menyalurkan santunan duka Rp 5.000.000,- melalui kas siaga sosial paguyuban.\n\nMari kita doakan semoga almarhum husnul khatimah dan keluarga yang ditinggalkan senantiasa diberikan kesabaran dan ketabahan.",
      fotoUtamaUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
      statusTayang: "published" as const,
      namaAlmarhum: "Bapak Ambo Dalle",
      waktuWafat: new Date("2026-09-06T08:30:00Z"),
      alamatDukaTimika: "Jl. Hasanuddin No. 12, Timika (Samping Masjid Al-Hidayah)",
      kontakKeluargaWa: "6281248011234",
    },
    {
      judul: "Kabar Suka Cita: Syukuran Tasmiyah & Aqiqah Ananda M. Latemmamala Al-Farizi",
      slug: "syukuran-tasmiyah-ananda-m-latemmamala",
      kategori: "suka_cita" as const,
      ringkasan:
        "Keluarga Baharuddin Latif mengundang bapak/ibu warga rantau dalam acara syukuran tasmiyah putra kedua di SP 3 Karang Senang.",
      kontenUtama:
        "Keluarga besar KKS Kabupaten Mimika mengundang seluruh bapak/ibu warga rantau Soppeng dalam rangka tasmiyah dan aqiqah ananda Muhammad Latemmamala Al-Farizi yang insya Allah digelar di kediaman SP 3 Jalur Rajawali.\n\nKehadiran dan doa restu bapak/ibu sekalian merupakan kehormatan dan kebahagiaan bagi kami sekeluarga.",
      fotoUtamaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      statusTayang: "published" as const,
      lokasiNamaTempat: "Kediaman Bpk. Baharuddin Latif",
      penyelenggaraSektor: "Sektor SP 3 (Karang Senang)",
      kontakPanitiaWa: "6281355447711",
    },
    {
      judul: "Turnamen Domino Semi-Open KKS Cup 2026 & Silaturahmi Akbar Paguyuban",
      slug: "turnamen-domino-semi-open-kks-cup-2026",
      kategori: "agenda_kegiatan" as const,
      ringkasan:
        "Ajang olahraga asah taktik dan silaturahmi akbar warga Soppeng se-Mimika memperebutkan Piala Bergilir KKS dan Total Hadiah Rp 15 Juta.",
      kontenUtama:
        "Dalam rangka mempererat silaturahmi warga perantau asal Kabupaten Soppeng di Kabupaten Mimika, Pengurus BPH KKS Mimika menggelar Turnamen Lomba Domino Semi-Open KKS Cup 2026.\n\nTurnamen ini terbuka untuk umum dan warga paguyuban dengan sistem gugur ganda (double elimination). Disediakan doorprize menarik, kudapan tradisional coto & barongko, serta panggung malam keakraban.",
      fotoUtamaUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
      statusTayang: "published" as const,
      tanggalMulai: new Date("2026-10-15T09:00:00Z"),
      tanggalSelesai: new Date("2026-10-16T22:00:00Z"),
      lokasiNamaTempat: "Gedung Tongkonan / Balai Paguyuban KKS Timika",
      lokasiMapsUrl: "https://maps.google.com/?q=Gedung+Tongkonan+Timika",
      penyelenggaraSektor: "Pengurus Pusat BPH KKS Kabupaten Mimika",
      biayaPendaftaran: "100000.00",
      kuotaPeserta: 64,
      linkPendaftaranExternal: "https://forms.gle/kks-domino-2026",
      kontakPanitiaWa: "6281248011234",
      lampiranDokumenUrl: "/uploads/documents/rundown-turnamen-domino-2026.pdf",
      galeriFotoUrls: [
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80",
      ],
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
      kategoriUsaha: "Kuliner Khas",
      alamatUsaha: "Jl. Yos Sudarso No. 88 (Dekat Pasar Lama Timika)",
      waBisnis: "6281248011234",
      fotoUsahaUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      deskripsi: "Menyajikan Coto Makassar otentik daging sapi lokal, Sop Konro bakar/kuah, serta aneka kue tradisional Bugis Barongko & Katirisala.",
      isVerified: true,
      isActive: true,
    },
    {
      namaUsaha: "Bengkel Las & Bubut Bugis Jaya SP 2",
      namaPemilik: "Baharuddin Latif",
      kategoriUsaha: "Jasa & Bengkel",
      alamatUsaha: "Jl. Poros SP 2 Wanagon No. 45",
      waBisnis: "6281355447711",
      fotoUsahaUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      deskripsi: "Pengerjaan pagar minimalis, kanopi baja ringan, pintu harmonika, dan servis mesin industri perumahan.",
      isVerified: true,
      isActive: true,
    },
    {
      namaUsaha: "Toko Bangunan & Material Mario Timika",
      namaPemilik: "Hj. Siti Aminah Tenri",
      kategoriUsaha: "Toko Bangunan",
      alamatUsaha: "Jl. Cenderawasih SP 2 (Depan Polsek)",
      waBisnis: "6282198002345",
      fotoUsahaUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80",
      deskripsi: "Pasokan semen Tonasa, besi beton SNI, cat tahan cuaca, kayu olahan Merbau, dan perkakas tukang.",
      isVerified: true,
      isActive: true,
    },
    {
      namaUsaha: "Jahit Sutra & Busana Adat Bugis Soppeng",
      namaPemilik: "Tenri Angka Sulaeman",
      kategoriUsaha: "Jahit Sutra/Pakaian",
      alamatUsaha: "Jl. Poros SP 4 Wonorejo, Jalur 5",
      waBisnis: "6281149998811",
      fotoUsahaUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
      deskripsi: "Menerima pesanan baju Bodo modern, jas Tutu sutra Sabbe Soppeng, serta permak pakaian seragam kantor.",
      isVerified: false,
      isActive: true,
    },
    {
      namaUsaha: "Jasa Ekspedisi & Logistik Rantau Pomako",
      namaPemilik: "Muhammad Arsyad Patarai",
      kategoriUsaha: "Hasil Bumi & Logistik",
      alamatUsaha: "Jl. Pelabuhan Pomako, Timika",
      waBisnis: "6285244119988",
      fotoUsahaUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      deskripsi: "Melayani pengiriman barang kargo antar pulau rute Makassar - Timika dan distribusi hasil bumi ke pedalaman.",
      isVerified: true,
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
