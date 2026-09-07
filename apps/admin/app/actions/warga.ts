"use server";

import { db, wargaRantau, type WargaRantau, type NewWargaRantau } from "@repo/database";
import { desc, eq, and, ilike, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type WargaFilters = {
  search?: string;
  kecamatanAsal?: string;
  domisiliTimika?: string;
  statusVerifikasi?: "pending" | "verified" | "rejected" | "all";
};

export async function getWargaList(filters?: WargaFilters): Promise<WargaRantau[]> {
  try {
    const conditions = [];

    if (filters?.search && filters.search.trim()) {
      const q = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          ilike(wargaRantau.namaLengkap, q),
          ilike(wargaRantau.nik, q),
          ilike(wargaRantau.noWa, q),
          ilike(wargaRantau.domisiliTimika, q)
        )
      );
    }

    if (filters?.kecamatanAsal && filters.kecamatanAsal !== "all") {
      conditions.push(
        eq(wargaRantau.kecamatanAsal, filters.kecamatanAsal as any)
      );
    }

    if (filters?.domisiliTimika && filters.domisiliTimika !== "all") {
      conditions.push(ilike(wargaRantau.domisiliTimika, `%${filters.domisiliTimika}%`));
    }

    if (filters?.statusVerifikasi && filters.statusVerifikasi !== "all") {
      conditions.push(
        eq(wargaRantau.statusVerifikasi, filters.statusVerifikasi as any)
      );
    }

    const query = db
      .select()
      .from(wargaRantau)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(wargaRantau.createdAt));

    return await query;
  } catch (error) {
    console.error("Error fetching warga list:", error);
    return [];
  }
}

export async function updateWargaStatus(
  id: string,
  status: "pending" | "verified" | "rejected",
  catatanAdmin?: string
) {
  try {
    await db
      .update(wargaRantau)
      .set({
        statusVerifikasi: status,
        ...(catatanAdmin !== undefined ? { catatanAdmin } : {}),
      })
      .where(eq(wargaRantau.id, id));

    revalidatePath("/warga");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating warga status:", error);
    return { success: false, error: error?.message || "Gagal mengubah status warga" };
  }
}

export async function createWarga(data: NewWargaRantau) {
  try {
    const [inserted] = await db
      .insert(wargaRantau)
      .values(data)
      .returning();

    revalidatePath("/warga");
    revalidatePath("/");
    return { success: true, data: inserted };
  } catch (error: any) {
    console.error("Error creating warga:", error);
    return { success: false, error: error?.message || "Gagal mendaftarkan warga" };
  }
}

export async function deleteWarga(id: string) {
  try {
    await db.delete(wargaRantau).where(eq(wargaRantau.id, id));
    revalidatePath("/warga");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting warga:", error);
    return { success: false, error: error?.message || "Gagal menghapus data warga" };
  }
}
