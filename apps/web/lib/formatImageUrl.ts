/**
 * Helper utility untuk resolusi path gambar dinamis (Local Storage & Supabase Storage CDN)
 */
export function formatImageUrl(
  path: string | null | undefined,
  fallback: string = "/placeholder-kks.webp"
): string {
  if (!path || typeof path !== "string" || path.trim() === "") {
    return fallback;
  }

  const cleanPath = path.trim();

  // Jika URL absolut eksternal (Supabase Storage / Unsplash / CDN)
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  // Jika path lokal (/uploads/... atau relative)
  return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
}
