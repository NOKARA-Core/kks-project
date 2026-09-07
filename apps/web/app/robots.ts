import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.appUrl || "http://localhost:3009";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/warta",
          "/warta/*",
          "/niaga",
          "/profil",
          "/sosial",
          "/pendataan",
          "/icon.svg",
          "/favicon.ico",
          "/logo-kks.svg",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/login",
          "/_next/*",
        ],
      },
      // Perayap SEO Ramah diizinkan secara eksplisit untuk membaca konten publik
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Google-InspectionTool",
          "ClaudeBot",
          "PerplexityBot",
          "Applebot",
        ],
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
