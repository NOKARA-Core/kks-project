import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  date,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// 1. Enums
export const kecamatanAsalEnum = pgEnum("kecamatan_asal_enum", [
  "Lalabata",
  "Lilirilau",
  "Liliriaja",
  "Marioriwawo",
  "Marioriawa",
  "Donri-Donri",
  "Citta",
]);

export const statusVerifikasiEnum = pgEnum("status_verifikasi_enum", [
  "pending",
  "verified",
  "rejected",
]);

export const kategoriWartaEnum = pgEnum("kategori_warta_enum", [
  "duka_cita",
  "suka_cita",
  "agenda_kegiatan",
]);

export const statusTayangEnum = pgEnum("status_tayang_enum", [
  "draft",
  "published",
  "archived",
]);

export const jenisTransaksiEnum = pgEnum("jenis_transaksi_enum", [
  "masuk",
  "keluar",
]);

export const peruntukanKasEnum = pgEnum("peruntukan_kas_enum", [
  "santunan_duka",
  "iuran_warga",
  "kegiatan_silaturahmi",
  "kas_siaga",
]);

export const adminRoleEnum = pgEnum("admin_role_enum", [
  "superadmin",
  "pengurus",
]);

// 2. Relational Tables

/**
 * Tabel Akun Pengurus & Pengguna Panel Admin KKS Mimika
 */
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  namaLengkap: varchar("nama_lengkap", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  noWa: varchar("no_wa", { length: 20 }),
  role: adminRoleEnum("role").default("pengurus").notNull(),
  jabatan: varchar("jabatan", { length: 100 }).default("Pengurus Paguyuban").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Tabel Data Induk Warga Paguyuban KKS di Mimika
 */
export const wargaRantau = pgTable("warga_rantau", {
  id: uuid("id").primaryKey().defaultRandom(),
  namaLengkap: text("nama_lengkap").notNull(),
  nik: varchar("nik", { length: 16 }).notNull().unique(),
  noKk: varchar("no_kk", { length: 16 }),
  noWa: varchar("no_wa", { length: 20 }).notNull(),
  kecamatanAsal: kecamatanAsalEnum("kecamatan_asal").notNull(),
  domisiliTimika: text("domisili_timika").notNull(),
  jumlahKeluarga: integer("jumlah_keluarga").default(1).notNull(),
  statusVerifikasi: statusVerifikasiEnum("status_verifikasi").default("pending").notNull(),
  catatanAdmin: text("catatan_admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Tabel Warta Suka, Duka (Lelayu), dan Agenda Kegiatan Paguyuban
 */
export const wartaPaguyuban = pgTable("warta_paguyuban", {
  id: uuid("id").primaryKey().defaultRandom(),
  kategori: kategoriWartaEnum("kategori").notNull(),
  judul: varchar("judul", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  ringkasan: text("ringkasan").notNull(),
  kontenUtama: text("konten_utama").notNull(),
  fotoUtamaUrl: text("foto_utama_url"),
  statusTayang: statusTayangEnum("status_tayang").default("published").notNull(),

  // Field Khusus Duka Cita (Lelayu)
  namaAlmarhum: varchar("nama_almarhum", { length: 255 }),
  waktuWafat: timestamp("waktu_wafat", { withTimezone: true }),
  alamatDukaTimika: text("alamat_duka_timika"),
  kontakKeluargaWa: varchar("kontak_keluarga_wa", { length: 20 }),

  // Field Khusus Agenda & Turnamen Olahraga / Kegiatan Kompleks
  subJenisAgenda: varchar("sub_jenis_agenda", { length: 50 }), // 'turnamen_olahraga' | 'rapat_musda' | 'pengajian_arisan' | 'berita_umum'
  namaKegiatan: varchar("nama_kegiatan", { length: 255 }),
  tanggalMulai: timestamp("tanggal_mulai", { withTimezone: true }),
  tanggalSelesai: timestamp("tanggal_selesai", { withTimezone: true }),
  lokasiNamaTempat: varchar("lokasi_nama_tempat", { length: 255 }),
  lokasiGedung: varchar("lokasi_gedung", { length: 255 }),
  lokasiMapsUrl: text("lokasi_maps_url"),
  linkLokasiMaps: text("link_lokasi_maps"),
  penyelenggaraSektor: varchar("penyelenggara_sektor", { length: 100 }),
  penanggungJawabNama: varchar("penanggung_jawab_nama", { length: 255 }),
  penanggungJawabWa: varchar("penanggung_jawab_wa", { length: 20 }),
  biayaPendaftaran: numeric("biaya_pendaftaran", { precision: 12, scale: 2 }).default("0").notNull(),
  biayaTiketMasuk: numeric("biaya_tiket_masuk", { precision: 12, scale: 2 }).default("0").notNull(),
  totalHadiahPembinaan: text("total_hadiah_pembinaan"),
  statusPendaftaran: varchar("status_pendaftaran", { length: 50 }).default("buka").notNull(), // 'buka' | 'tutup' | 'selesai'
  tautanPendaftaranLuar: text("tautan_pendaftaran_luar"),
  kuotaPeserta: integer("kuota_peserta"),
  linkPendaftaranExternal: text("link_pendaftaran_external"),
  kontakPanitiaWa: varchar("kontak_panitia_wa", { length: 20 }),
  lampiranDokumenUrl: text("lampiran_dokumen_url"),
  galeriFotoUrls: jsonb("galeri_foto_urls").$type<string[]>().default([]).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Tabel Aset Media & Lampiran Warta Paguyuban (Gambar, Bagan, PDF Juknis)
 */
export const wartaAssets = pgTable("warta_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  wartaId: uuid("warta_id")
    .references(() => wartaPaguyuban.id, { onDelete: "cascade" })
    .notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(), // 'image' | 'document_pdf' | 'bracket_image'
  keterangan: text("keterangan"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Tabel Kas Sosial & Santunan Kematian Terbuka KKS
 */
export const kasSosial = pgTable("kas_sosial", {
  id: uuid("id").primaryKey().defaultRandom(),
  jenisTransaksi: jenisTransaksiEnum("jenis_transaksi").notNull(),
  peruntukan: peruntukanKasEnum("peruntukan").notNull(),
  nominal: numeric("nominal", { precision: 15, scale: 2 }).notNull(),
  keterangan: text("keterangan"),
  namaPenyetorPenerima: text("nama_penyetor_penerima"),
  tanggalTransaksi: date("tanggal_transaksi").defaultNow().notNull(),
  buktiTransaksiUrl: text("bukti_transaksi_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Tabel Direktori Niaga & Jasa Warga Rantau di Timika
 */
export const direktoriNiaga = pgTable("direktori_niaga", {
  id: uuid("id").primaryKey().defaultRandom(),
  namaUsaha: varchar("nama_usaha", { length: 255 }).notNull(),
  namaPemilik: varchar("nama_pemilik", { length: 255 }).notNull(),
  kategoriUsaha: varchar("kategori_usaha", { length: 100 }).notNull(),
  alamatUsaha: text("alamat_usaha").notNull(),
  waBisnis: varchar("wa_bisnis", { length: 20 }).notNull(),
  fotoUsahaUrl: text("foto_usaha_url"),
  deskripsi: text("deskripsi"),
  isVerified: boolean("is_verified").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Tabel Hero Slides Banner Dinamis (Hero Media Carousel)
 */
export const heroSlides = pgTable("hero_slides", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageUrl: text("image_url").notNull(),
  title: varchar("title", { length: 255 }),
  subtitle: text("subtitle"),
  badgeTag: varchar("badge_tag", { length: 100 }),
  targetUrl: text("target_url"),
  orderIndex: integer("order_index").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. TypeScript Inferred Types

export type WargaRantau = InferSelectModel<typeof wargaRantau>;
export type NewWargaRantau = InferInsertModel<typeof wargaRantau>;

export type WartaPaguyuban = InferSelectModel<typeof wartaPaguyuban>;
export type NewWartaPaguyuban = InferInsertModel<typeof wartaPaguyuban>;

export type WartaAsset = InferSelectModel<typeof wartaAssets>;
export type NewWartaAsset = InferInsertModel<typeof wartaAssets>;

export type KasSosial = InferSelectModel<typeof kasSosial>;
export type NewKasSosial = InferInsertModel<typeof kasSosial>;

export type DirektoriNiaga = InferSelectModel<typeof direktoriNiaga>;
export type NewDirektoriNiaga = InferInsertModel<typeof direktoriNiaga>;

export type AdminUser = InferSelectModel<typeof adminUsers>;
export type NewAdminUser = InferInsertModel<typeof adminUsers>;

export type HeroSlide = InferSelectModel<typeof heroSlides>;
export type NewHeroSlide = InferInsertModel<typeof heroSlides>;

// Konstanta referensi daerah untuk filter & dropdown

export const KECAMATAN_SOPPENG = [
  "Lalabata",
  "Lilirilau",
  "Liliriaja",
  "Marioriwawo",
  "Marioriawa",
  "Donri-Donri",
  "Citta",
] as const;

export const SEKTOR_TIMIKA = [
  "Kuala Kencana",
  "Timika Kota",
  "SP 1 (Kamoro Jaya)",
  "SP 2 (Wanagon)",
  "SP 3 (Karang Senang)",
  "SP 4 (Wonorejo)",
  "SP 5",
  "Kwamki Narama",
  "Tembagapura",
  "Mapurujaya",
] as const;
