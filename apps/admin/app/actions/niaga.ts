"use server";

import {
  db,
  direktoriNiaga,
  type DirektoriNiaga,
  type NewDirektoriNiaga,
} from "@repo/database";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNiagaList(): Promise<DirektoriNiaga[]> {
  try {
    return await db
      .select()
      .from(direktoriNiaga)
      .orderBy(desc(direktoriNiaga.createdAt));
  } catch (error) {
    console.error("Error fetching niaga list:", error);
    return [];
  }
}

export async function toggleNiagaStatus(id: string, isActive: boolean) {
  try {
    await db
      .update(direktoriNiaga)
      .set({ isActive })
      .where(eq(direktoriNiaga.id, id));

    revalidatePath("/niaga");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling niaga status:", error);
    return {
      success: false,
      error: error?.message || "Gagal mengubah status direktori niaga",
    };
  }
}

export async function toggleNiagaVerification(id: string, isVerified: boolean) {
  try {
    await db
      .update(direktoriNiaga)
      .set({ isVerified })
      .where(eq(direktoriNiaga.id, id));

    revalidatePath("/niaga");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling niaga verification:", error);
    return {
      success: false,
      error: error?.message || "Gagal mengubah status verifikasi usaha",
    };
  }
}

export async function createNiaga(data: NewDirektoriNiaga) {
  try {
    const [inserted] = await db
      .insert(direktoriNiaga)
      .values(data)
      .returning();

    revalidatePath("/niaga");
    revalidatePath("/");
    return { success: true, data: inserted };
  } catch (error: any) {
    console.error("Error creating niaga:", error);
    return {
      success: false,
      error: error?.message || "Gagal menambahkan usaha warga",
    };
  }
}

export async function updateNiaga(id: string, data: Partial<NewDirektoriNiaga>) {
  try {
    const [updated] = await db
      .update(direktoriNiaga)
      .set(data)
      .where(eq(direktoriNiaga.id, id))
      .returning();

    revalidatePath("/niaga");
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating niaga:", error);
    return {
      success: false,
      error: error?.message || "Gagal memperbarui usaha warga",
    };
  }
}

export async function deleteNiaga(id: string) {
  try {
    await db.delete(direktoriNiaga).where(eq(direktoriNiaga.id, id));
    revalidatePath("/niaga");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting niaga:", error);
    return {
      success: false,
      error: error?.message || "Gagal menghapus data usaha warga",
    };
  }
}
