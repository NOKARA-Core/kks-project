import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";

export interface StorageUploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface StorageAdapter {
  upload(
    buffer: Buffer | Uint8Array,
    filename: string,
    folder: string,
    mimeType: string
  ): Promise<StorageUploadResult>;
  delete?(filePath: string): Promise<void>;
}

/**
 * Validasi berkas upload
 */
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
];

export const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateUploadFile(
  mimeType: string,
  sizeBytes: number,
  allowDocuments = false
): { valid: boolean; error?: string } {
  const allowedTypes = allowDocuments
    ? [...ALLOWED_IMAGE_MIME_TYPES, ...ALLOWED_DOCUMENT_MIME_TYPES]
    : ALLOWED_IMAGE_MIME_TYPES;

  if (!allowedTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `Tipe berkas tidak didukung (${mimeType}). Hanya diperbolehkan format ${
        allowDocuments ? "JPEG, PNG, WebP, SVG, atau PDF" : "JPEG, PNG, WebP, SVG"
      }.`,
    };
  }

  const maxSize = mimeType === "application/pdf" ? MAX_DOCUMENT_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  if (sizeBytes > maxSize) {
    const maxMb = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `Ukuran berkas melebihi batas maksimal ${maxMb}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Helper untuk men-generate nama file unik & aman
 */
export function sanitizeFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${timestamp}-${base || "file"}-${randomStr}${ext}`;
}

/**
 * Local Disk Storage Adapter
 * Menyimpan file ke public folder (apps/admin/public/uploads & apps/web/public/uploads)
 */
export class LocalDiskStorageAdapter implements StorageAdapter {
  private baseDirs: string[];

  constructor(baseDirs?: string[]) {
    if (baseDirs && baseDirs.length > 0) {
      this.baseDirs = baseDirs;
    } else {
      // Default auto-detect repo apps root if running inside monorepo
      const cwd = process.cwd();
      const targets = new Set<string>();

      // Cari root monorepo berdasarkan keberadaan turbo.json atau pnpm-workspace / package.json
      let repoRoot = cwd;
      let curr = cwd;
      for (let i = 0; i < 4; i++) {
        if (fsSync.existsSync(path.join(curr, "turbo.json")) || fsSync.existsSync(path.join(curr, "pnpm-workspace.yaml"))) {
          repoRoot = curr;
          break;
        }
        const parent = path.dirname(curr);
        if (parent === curr) break;
        curr = parent;
      }

      const adminUploads = path.join(repoRoot, "apps/admin/public/uploads");
      const webUploads = path.join(repoRoot, "apps/web/public/uploads");

      if (fsSync.existsSync(path.dirname(adminUploads))) {
        targets.add(adminUploads);
      }
      if (fsSync.existsSync(path.dirname(webUploads))) {
        targets.add(webUploads);
      }

      // Fallback jika standalone atau tidak terdeteksi
      if (targets.size === 0) {
        targets.add(path.resolve(cwd, "public/uploads"));
      }

      this.baseDirs = Array.from(targets);
    }
  }

  async upload(
    buffer: Buffer | Uint8Array,
    filename: string,
    folder: string,
    mimeType: string
  ): Promise<StorageUploadResult> {
    const cleanFilename = sanitizeFilename(filename);
    const relativeUrl = `/uploads/${folder}/${cleanFilename}`;

    // Tulis ke semua target folder publik yang terdeteksi
    let wroteAtLeastOne = false;
    for (const baseDir of this.baseDirs) {
      try {
        const fullDir = path.join(baseDir, folder);
        await fs.mkdir(fullDir, { recursive: true });
        const filePath = path.join(fullDir, cleanFilename);
        await fs.writeFile(filePath, buffer);
        wroteAtLeastOne = true;
      } catch {
        // Abaikan jika direktori tidak eksis di path tersebut
      }
    }

    // Jika belum berhasil menulis ke satupun (misal cwd unik), fallback buat di cwd/public/uploads
    if (!wroteAtLeastOne) {
      const fallbackDir = path.join(process.cwd(), "public/uploads", folder);
      await fs.mkdir(fallbackDir, { recursive: true });
      await fs.writeFile(path.join(fallbackDir, cleanFilename), buffer);
    }

    return {
      url: relativeUrl,
      filename: cleanFilename,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(filePath: string): Promise<void> {
    const relativePart = filePath.replace(/^\/?uploads\//, "");
    for (const baseDir of this.baseDirs) {
      try {
        const fullPath = path.join(baseDir, relativePart);
        await fs.unlink(fullPath);
      } catch {
        // Ignored
      }
    }
  }
}

/**
 * Supabase Storage Adapter (Siap Pakai untuk Cloud Storage)
 */
export class SupabaseStorageAdapter implements StorageAdapter {
  private supabaseUrl: string;
  private supabaseKey: string;
  private bucket: string;

  constructor(bucket = "kks-media") {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    this.supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";
    this.bucket = bucket;
  }

  async upload(
    buffer: Buffer | Uint8Array,
    filename: string,
    folder: string,
    mimeType: string
  ): Promise<StorageUploadResult> {
    const cleanFilename = sanitizeFilename(filename);
    const objectPath = `${folder}/${cleanFilename}`;

    // Upload via REST API Supabase Storage
    const endpoint = `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${objectPath}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.supabaseKey}`,
        "Content-Type": mimeType,
      },
      body: buffer as any,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gagal upload ke Supabase Storage: ${errText}`);
    }

    const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${objectPath}`;
    return {
      url: publicUrl,
      filename: cleanFilename,
      size: buffer.length,
      mimeType,
    };
  }
}

/**
 * Factory / Active Storage Manager
 * Otomatis menggunakan Supabase jika kredensial terisi, atau default Local Disk
 */
export function getStorageAdapter(): StorageAdapter {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabase =
    Boolean(supabaseUrl) &&
    typeof supabaseUrl === "string" &&
    !supabaseUrl.includes("xxxxxxxx") &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasSupabase) {
    return new SupabaseStorageAdapter();
  }

  return new LocalDiskStorageAdapter();
}
