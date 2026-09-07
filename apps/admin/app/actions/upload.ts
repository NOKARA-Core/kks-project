"use server";

import {
  getStorageAdapter,
  validateUploadFile,
  type StorageUploadResult,
} from "@repo/database";

export interface UploadActionResult {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

/**
 * Server Action untuk mengunggah gambar tunggal (foto usaha, banner warta, dsb)
 */
export async function uploadImageAction(
  formData: FormData,
  folder = "general"
): Promise<UploadActionResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "Tidak ada berkas yang dipilih." };
    }

    // Validasi
    const validation = validateUploadFile(file.type, file.size, false);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const adapter = getStorageAdapter();
    const result: StorageUploadResult = await adapter.upload(
      buffer,
      file.name,
      folder,
      file.type
    );

    return {
      success: true,
      url: result.url,
      filename: result.filename,
    };
  } catch (error: any) {
    console.error("Error in uploadImageAction:", error);
    return {
      success: false,
      error: error?.message || "Gagal mengunggah berkas gambar.",
    };
  }
}

/**
 * Server Action untuk mengunggah dokumen PDF lampiran warta / kegiatan
 */
export async function uploadDocumentAction(
  formData: FormData,
  folder = "documents"
): Promise<UploadActionResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "Tidak ada dokumen yang dipilih." };
    }

    const validation = validateUploadFile(file.type, file.size, true);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const adapter = getStorageAdapter();
    const result: StorageUploadResult = await adapter.upload(
      buffer,
      file.name,
      folder,
      file.type
    );

    return {
      success: true,
      url: result.url,
      filename: result.filename,
    };
  } catch (error: any) {
    console.error("Error in uploadDocumentAction:", error);
    return {
      success: false,
      error: error?.message || "Gagal mengunggah berkas dokumen.",
    };
  }
}
