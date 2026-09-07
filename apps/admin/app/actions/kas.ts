"use server";

import { db, kasSosial, type KasSosial, type NewKasSosial } from "@repo/database";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type KasSummary = {
  totalMasuk: number;
  totalKeluar: number;
  saldoKas: number;
  santunanDukaKeluar: number;
  iuranWargaMasuk: number;
};

export async function getKasList(): Promise<KasSosial[]> {
  try {
    return await db
      .select()
      .from(kasSosial)
      .orderBy(desc(kasSosial.tanggalTransaksi), desc(kasSosial.createdAt));
  } catch (error) {
    console.error("Error fetching kas list:", error);
    return [];
  }
}

export async function getKasSummary(): Promise<KasSummary> {
  try {
    const list = await getKasList();

    let totalMasuk = 0;
    let totalKeluar = 0;
    let santunanDukaKeluar = 0;
    let iuranWargaMasuk = 0;

    for (const item of list) {
      const nom = parseFloat(item.nominal) || 0;
      if (item.jenisTransaksi === "masuk") {
        totalMasuk += nom;
        if (item.peruntukan === "iuran_warga") {
          iuranWargaMasuk += nom;
        }
      } else {
        totalKeluar += nom;
        if (item.peruntukan === "santunan_duka") {
          santunanDukaKeluar += nom;
        }
      }
    }

    return {
      totalMasuk,
      totalKeluar,
      saldoKas: totalMasuk - totalKeluar,
      santunanDukaKeluar,
      iuranWargaMasuk,
    };
  } catch (error) {
    console.error("Error computing kas summary:", error);
    return {
      totalMasuk: 0,
      totalKeluar: 0,
      saldoKas: 0,
      santunanDukaKeluar: 0,
      iuranWargaMasuk: 0,
    };
  }
}

export async function createTransaksiKas(data: NewKasSosial) {
  try {
    const [inserted] = await db.insert(kasSosial).values(data).returning();

    revalidatePath("/kas");
    revalidatePath("/");
    return { success: true, data: inserted };
  } catch (error: any) {
    console.error("Error creating kas transaksi:", error);
    return {
      success: false,
      error: error?.message || "Gagal mencatat transaksi kas",
    };
  }
}

export async function deleteTransaksiKas(id: string) {
  try {
    await db.delete(kasSosial).where(eq(kasSosial.id, id));
    revalidatePath("/kas");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting kas transaksi:", error);
    return {
      success: false,
      error: error?.message || "Gagal menghapus transaksi kas",
    };
  }
}
