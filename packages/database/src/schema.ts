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

// 2. Relational Tables

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
 * Tabel Warta Suka, Duka (Lelayu), dan Agenda Paguyuban
 */
export const wartaPaguyuban = pgTable("warta_paguyuban", {
  id: uuid("id").primaryKey().defaultRandom(),
  judul: text("judul").notNull(),
  kategori: kategoriWartaEnum("kategori").notNull(),
  ringkasan: text("ringkasan"),
  konten: text("konten"),
  kontakDaruratWa: varchar("kontak_darurat_wa", { length: 20 }),
  lokasiAcara: text("lokasi_acara").default("Timika"),
  tanggalPeristiwa: date("tanggal_peristiwa"),
  statusTayang: statusTayangEnum("status_tayang").default("published").notNull(),
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
  namaUsaha: text("nama_usaha").notNull(),
  namaPemilik: text("nama_pemilik").notNull(),
  kategoriUsaha: text("kategori_usaha").notNull(),
  alamatUsahaTimika: text("alamat_usaha_timika"),
  waBisnis: varchar("wa_bisnis", { length: 20 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. TypeScript Inferred Types
export type WargaRantau = InferSelectModel<typeof wargaRantau>;
export type NewWargaRantau = InferInsertModel<typeof wargaRantau>;

export type WartaPaguyuban = InferSelectModel<typeof wartaPaguyuban>;
export type NewWartaPaguyuban = InferInsertModel<typeof wartaPaguyuban>;

export type KasSosial = InferSelectModel<typeof kasSosial>;
export type NewKasSosial = InferInsertModel<typeof kasSosial>;

export type DirektoriNiaga = InferSelectModel<typeof direktoriNiaga>;
export type NewDirektoriNiaga = InferInsertModel<typeof direktoriNiaga>;

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
