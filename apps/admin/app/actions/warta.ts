"use server";

import {
  db,
  wartaPaguyuban,
  wartaAssets,
  type WartaPaguyuban,
  type NewWartaPaguyuban,
  type WartaAsset,
  type NewWartaAsset,
} from "@repo/database";
import { desc, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type WartaFilters = {
  kategori?: "duka_cita" | "suka_cita" | "agenda_kegiatan" | "all";
  statusTayang?: "draft" | "published" | "archived" | "all";
};

export async function getWartaList(
  filters?: WartaFilters
): Promise<WartaPaguyuban[]> {
  try {
    const conditions = [];

    if (filters?.kategori && filters.kategori !== "all") {
      conditions.push(
        eq(wartaPaguyuban.kategori, filters.kategori as any)
      );
    }

    if (filters?.statusTayang && filters.statusTayang !== "all") {
      conditions.push(
        eq(wartaPaguyuban.statusTayang, filters.statusTayang as any)
      );
    }

    const query = db
      .select()
      .from(wartaPaguyuban)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(wartaPaguyuban.createdAt));

    return await query;
  } catch (error) {
    console.error("Error fetching warta list:", error);
    return [];
  }
}

export async function createWarta(data: NewWartaPaguyuban) {
  try {
    let slug = data.slug;
    if (!slug) {
      slug = data.judul
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const [inserted] = await db
      .insert(wartaPaguyuban)
      .values({ ...data, slug })
      .returning();

    revalidatePath("/warta");
    revalidatePath("/");
    return { success: true, data: inserted };
  } catch (error: any) {
    console.error("Error creating warta:", error);
    return { success: false, error: error?.message || "Gagal membuat warta" };
  }
}

export async function updateWarta(id: string, data: Partial<NewWartaPaguyuban>) {
  try {
    const [updated] = await db
      .update(wartaPaguyuban)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(wartaPaguyuban.id, id))
      .returning();

    revalidatePath("/warta");
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating warta:", error);
    return { success: false, error: error?.message || "Gagal memperbarui warta" };
  }
}

export async function updateWartaStatus(
  id: string,
  statusTayang: "draft" | "published" | "archived"
) {
  try {
    await db
      .update(wartaPaguyuban)
      .set({ statusTayang, updatedAt: new Date() })
      .where(eq(wartaPaguyuban.id, id));

    revalidatePath("/warta");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating warta status:", error);
    return {
      success: false,
      error: error?.message || "Gagal mengubah status warta",
    };
  }
}

export async function deleteWarta(id: string) {
  try {
    await db.delete(wartaPaguyuban).where(eq(wartaPaguyuban.id, id));
    revalidatePath("/warta");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting warta:", error);
    return { success: false, error: error?.message || "Gagal menghapus warta" };
  }
}

// ----------------------------------------------------
// Aset Media Warta (warta_assets)
// ----------------------------------------------------

export async function getWartaAssets(wartaId: string): Promise<WartaAsset[]> {
  try {
    return await db
      .select()
      .from(wartaAssets)
      .where(eq(wartaAssets.wartaId, wartaId))
      .orderBy(desc(wartaAssets.createdAt));
  } catch (error) {
    console.error("Error fetching warta assets:", error);
    return [];
  }
}

export async function createWartaAsset(data: NewWartaAsset) {
  try {
    const [inserted] = await db.insert(wartaAssets).values(data).returning();
    revalidatePath("/warta");
    return { success: true, data: inserted };
  } catch (error: any) {
    console.error("Error creating warta asset:", error);
    return { success: false, error: error?.message || "Gagal menyimpan aset warta" };
  }
}

export async function deleteWartaAsset(assetId: string) {
  try {
    await db.delete(wartaAssets).where(eq(wartaAssets.id, assetId));
    revalidatePath("/warta");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting warta asset:", error);
    return { success: false, error: error?.message || "Gagal menghapus aset warta" };
  }
}

