CREATE TYPE "public"."admin_role_enum" AS ENUM('superadmin', 'pengurus');--> statement-breakpoint
CREATE TYPE "public"."jenis_transaksi_enum" AS ENUM('masuk', 'keluar');--> statement-breakpoint
CREATE TYPE "public"."kategori_warta_enum" AS ENUM('duka_cita', 'suka_cita', 'agenda_kegiatan');--> statement-breakpoint
CREATE TYPE "public"."kecamatan_asal_enum" AS ENUM('Lalabata', 'Lilirilau', 'Liliriaja', 'Marioriwawo', 'Marioriawa', 'Donri-Donri', 'Citta');--> statement-breakpoint
CREATE TYPE "public"."peruntukan_kas_enum" AS ENUM('santunan_duka', 'iuran_warga', 'kegiatan_silaturahmi', 'kas_siaga');--> statement-breakpoint
CREATE TYPE "public"."status_tayang_enum" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."status_verifikasi_enum" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama_lengkap" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"no_wa" varchar(20),
	"role" "admin_role_enum" DEFAULT 'pengurus' NOT NULL,
	"jabatan" varchar(100) DEFAULT 'Pengurus Paguyuban' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "direktori_niaga" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama_usaha" varchar(255) NOT NULL,
	"nama_pemilik" varchar(255) NOT NULL,
	"kategori_usaha" varchar(100) NOT NULL,
	"alamat_usaha" text NOT NULL,
	"wa_bisnis" varchar(20) NOT NULL,
	"foto_usaha_url" text,
	"deskripsi" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kas_sosial" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jenis_transaksi" "jenis_transaksi_enum" NOT NULL,
	"peruntukan" "peruntukan_kas_enum" NOT NULL,
	"nominal" numeric(15, 2) NOT NULL,
	"keterangan" text,
	"nama_penyetor_penerima" text,
	"tanggal_transaksi" date DEFAULT now() NOT NULL,
	"bukti_transaksi_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warga_rantau" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama_lengkap" text NOT NULL,
	"nik" varchar(16) NOT NULL,
	"no_kk" varchar(16),
	"no_wa" varchar(20) NOT NULL,
	"kecamatan_asal" "kecamatan_asal_enum" NOT NULL,
	"domisili_timika" text NOT NULL,
	"jumlah_keluarga" integer DEFAULT 1 NOT NULL,
	"status_verifikasi" "status_verifikasi_enum" DEFAULT 'pending' NOT NULL,
	"catatan_admin" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "warga_rantau_nik_unique" UNIQUE("nik")
);
--> statement-breakpoint
CREATE TABLE "warta_paguyuban" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kategori" "kategori_warta_enum" NOT NULL,
	"judul" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"ringkasan" text NOT NULL,
	"konten_utama" text NOT NULL,
	"foto_utama_url" text,
	"status_tayang" "status_tayang_enum" DEFAULT 'published' NOT NULL,
	"nama_almarhum" varchar(255),
	"waktu_wafat" timestamp with time zone,
	"alamat_duka_timika" text,
	"kontak_keluarga_wa" varchar(20),
	"tanggal_mulai" timestamp with time zone,
	"tanggal_selesai" timestamp with time zone,
	"lokasi_nama_tempat" varchar(255),
	"lokasi_maps_url" text,
	"penyelenggara_sektor" varchar(100),
	"biaya_pendaftaran" numeric(12, 2) DEFAULT '0' NOT NULL,
	"kuota_peserta" integer,
	"link_pendaftaran_external" text,
	"kontak_panitia_wa" varchar(20),
	"lampiran_dokumen_url" text,
	"galeri_foto_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "warta_paguyuban_slug_unique" UNIQUE("slug")
);
