"use server";

import {
  db,
  wartaPaguyuban,
  type WartaPaguyuban,
  type NewWartaPaguyuban,
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
    const [inserted] = await db
      .insert(wartaPaguyuban)
      .values(data)
      .returning();

    revalidatePath("/warta");
    revalidatePath("/");
    return { success: true, data: inserted };
  } catch (error: any) {
    console.error("Error creating warta:", error);
    return { success: false, error: error?.message || "Gagal membuat warta" };
  }
}

export async function updateWartaStatus(
  id: string,
  statusTayang: "draft" | "published" | "archived"
) {
  try {
    await db
      .update(wartaPaguyuban)
      .set({ statusTayang })
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
