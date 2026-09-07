"use server";

import {
  db,
  heroSlides,
  type HeroSlide,
  type NewHeroSlide,
} from "@repo/database";
import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    return await db
      .select()
      .from(heroSlides)
      .orderBy(asc(heroSlides.orderIndex), desc(heroSlides.createdAt));
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return [];
  }
}

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  try {
    return await db
      .select()
      .from(heroSlides)
      .where(eq(heroSlides.isActive, true))
      .orderBy(asc(heroSlides.orderIndex), desc(heroSlides.createdAt));
  } catch (error) {
    console.error("Error fetching active hero slides:", error);
    return [];
  }
}

export async function createHeroSlide(data: NewHeroSlide) {
  try {
    const [inserted] = await db
      .insert(heroSlides)
      .values(data)
      .returning();

    revalidatePath("/");
    revalidatePath("/hero-banner");
    return { success: true, data: inserted };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error creating hero slide:", err);
    return { success: false, error: err.message || "Gagal membuat banner slide." };
  }
}

export async function updateHeroSlide(id: string, data: Partial<NewHeroSlide>) {
  try {
    const [updated] = await db
      .update(heroSlides)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(heroSlides.id, id))
      .returning();

    revalidatePath("/");
    revalidatePath("/hero-banner");
    return { success: true, data: updated };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error updating hero slide:", err);
    return { success: false, error: err.message || "Gagal memperbarui banner slide." };
  }
}

export async function toggleHeroSlideActive(id: string, currentState: boolean) {
  try {
    const [updated] = await db
      .update(heroSlides)
      .set({
        isActive: !currentState,
        updatedAt: new Date(),
      })
      .where(eq(heroSlides.id, id))
      .returning();

    revalidatePath("/");
    revalidatePath("/hero-banner");
    return { success: true, data: updated };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error toggling hero slide active:", err);
    return { success: false, error: err.message || "Gagal mengubah status slide." };
  }
}

export async function updateHeroSlideOrder(id: string, newOrder: number) {
  try {
    const [updated] = await db
      .update(heroSlides)
      .set({
        orderIndex: newOrder,
        updatedAt: new Date(),
      })
      .where(eq(heroSlides.id, id))
      .returning();

    revalidatePath("/");
    revalidatePath("/hero-banner");
    return { success: true, data: updated };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error updating slide order:", err);
    return { success: false, error: err.message || "Gagal mengubah urutan slide." };
  }
}

export async function deleteHeroSlide(id: string) {
  try {
    await db.delete(heroSlides).where(eq(heroSlides.id, id));
    revalidatePath("/");
    revalidatePath("/hero-banner");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error deleting hero slide:", err);
    return { success: false, error: err.message || "Gagal menghapus slide." };
  }
}
