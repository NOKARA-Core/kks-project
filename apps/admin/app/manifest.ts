import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Admin Kerukunan Keluarga Soppeng Kabupaten Mimika",
    short_name: "Admin KKS",
    description:
      "Dashboard Manajemen Resmi Pengurus Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#E11D48",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logo-kks.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
