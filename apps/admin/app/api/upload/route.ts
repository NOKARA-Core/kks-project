import { NextRequest, NextResponse } from "next/server";
import { getStorageAdapter, validateUploadFile } from "@repo/database";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";
    const allowDocuments = formData.get("allowDocuments") === "true";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada berkas yang dipilih." },
        { status: 400 }
      );
    }

    const validation = validateUploadFile(file.type, file.size, allowDocuments);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const adapter = getStorageAdapter();
    const result = await adapter.upload(buffer, file.name, folder, file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename,
      size: result.size,
    });
  } catch (error: any) {
    console.error("Error in /api/upload:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal mengunggah berkas." },
      { status: 500 }
    );
  }
}
