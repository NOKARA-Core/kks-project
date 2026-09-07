import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "")
  .replace(/\/rest\/v1\/?$/i, "")
  .replace(/\/+$/, "");
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "kks-media";

async function uploadFile(localPath: string, remotePath: string, mimeType: string) {
  const fileBuffer = fs.readFileSync(localPath);
  const endpoint = `${supabaseUrl}/storage/v1/object/${bucket}/${remotePath}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": mimeType,
      "x-upsert": "true",
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload error for ${remotePath}: ${errorText}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${remotePath}`;
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

async function syncUploads() {
  console.log(`🚀 Sinkronisasi file gambar lokal ke Supabase Storage [${bucket}]...`);
  const uploadsDir = path.resolve(__dirname, "../../../apps/web/public/uploads");

  if (!fs.existsSync(uploadsDir)) {
    console.log("Tidak ada folder uploads lokal.");
    return;
  }

  function getFiles(dir: string): string[] {
    const subdirs = fs.readdirSync(dir);
    const files: string[] = [];
    for (const subdir of subdirs) {
      const fullPath = path.join(dir, subdir);
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...getFiles(fullPath));
      } else if (!subdir.startsWith(".")) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const allFiles = getFiles(uploadsDir);
  console.log(`Ditemukan ${allFiles.length} berkas lokal untuk disinkronkan.\n`);

  for (const file of allFiles) {
    const relativePath = path.relative(uploadsDir, file).replace(/\\/g, "/");
    const mimeType = getMimeType(file);
    try {
      const publicUrl = await uploadFile(file, relativePath, mimeType);
      console.log(`✅ [Uploaded] ${relativePath}`);
      console.log(`   URL: ${publicUrl}`);
    } catch (err: any) {
      console.error(`❌ [Failed] ${relativePath}:`, err.message);
    }
  }

  console.log("\n🎉 Seluruh berkas gambar berhasil diunggah ke Supabase Storage!");
}

syncUploads().catch(console.error);
