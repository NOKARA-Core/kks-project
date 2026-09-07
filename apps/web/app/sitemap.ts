import type { MetadataRoute } from "next";
import { db, wartaPaguyuban } from "@repo/database";
import { eq, desc } from "drizzle-orm";
import { siteConfig } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.appUrl || "http://localhost:3009";

  // Rute halaman statis utama portal publik
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/profil`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/warta`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/niaga`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sosial`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pendataan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Rute dinamis untuk warta yang sudah terbit (published)
  let wartaRoutes: MetadataRoute.Sitemap = [];
  try {
    const publishedWarta = await db
      .select({
        slug: wartaPaguyuban.slug,
        id: wartaPaguyuban.id,
        updatedAt: wartaPaguyuban.createdAt,
      })
      .from(wartaPaguyuban)
      .where(eq(wartaPaguyuban.statusTayang, "published"))
      .orderBy(desc(wartaPaguyuban.createdAt))
      .limit(50);

    wartaRoutes = publishedWarta.map((item) => ({
      url: `${baseUrl}/warta/${item.slug || item.id}`,
      lastModified: item.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error generating dynamic warta sitemap:", error);
  }

  return [...staticRoutes, ...wartaRoutes];
}
