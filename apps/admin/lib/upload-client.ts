import { uploadImageAction, uploadDocumentAction } from "@/app/actions/upload";

export interface ClientUploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

/**
 * Upload helper yang tangguh untuk browser:
 * Menggunakan /api/upload dengan streaming multipart fetch standar,
 * sehingga kebal terhadap bug Next.js 15+ Server Action stream finished.
 */
export async function uploadFileClient(
  file: File,
  folder = "general",
  allowDocuments = false
): Promise<ClientUploadResult> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    if (allowDocuments) {
      formData.append("allowDocuments", "true");
    }

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || `Gagal mengunggah berkas (${res.status})`,
      };
    }

    return {
      success: true,
      url: data.url,
      filename: data.filename,
    };
  } catch (err: any) {
    console.warn("API upload fallback to Server Action:", err);
    // Fallback ke Server Action jika fetch gagal
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (allowDocuments) {
        return await uploadDocumentAction(formData, folder);
      } else {
        return await uploadImageAction(formData, folder);
      }
    } catch (fallbackErr: any) {
      return {
        success: false,
        error: fallbackErr?.message || "Gagal mengunggah berkas.",
      };
    }
  }
}
