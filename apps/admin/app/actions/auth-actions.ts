"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { db, adminUsers, verifyPassword } from "@repo/database";
import { eq, or } from "drizzle-orm";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export type LoginResult = {
  success: boolean;
  error?: string;
  redirectUrl?: string;
};

const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "Email atau nomor WhatsApp harus diisi")
    .max(255, "Panjang masukan melebihi batas"),
  password: z.string().min(1, "Kata sandi harus diisi"),
});

/**
 * Server Action untuk memproses login pengurus KKS Mimika.
 * Menggunakan generic error message untuk mencegah User Enumeration Attack.
 */
export async function loginAdminAction(
  rawData: z.infer<typeof loginSchema>
): Promise<LoginResult> {
  try {
    const parsed = loginSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Data masukan tidak valid",
      };
    }

    const { identifier, password } = parsed.data;
    const cleanIdentifier = identifier.toLowerCase();

    // Cari akun berdasarkan email ATAU nomor WhatsApp
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(
        or(
          eq(adminUsers.email, cleanIdentifier),
          eq(adminUsers.noWa, identifier)
        )
      )
      .limit(1);

    // Mencegah User Enumeration: pesan error sama persis jika user tidak ada, tidak aktif, atau sandi salah
    if (!user || !user.isActive) {
      return {
        success: false,
        error: "Kredensial tidak cocok atau akun dinonaktifkan",
      };
    }

    // Verifikasi kata sandi
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return {
        success: false,
        error: "Kredensial tidak cocok atau akun dinonaktifkan",
      };
    }

    // Catat waktu login terakhir
    await db
      .update(adminUsers)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, user.id));

    // Pasang session cookie yang aman (HttpOnly, SameSite Lax)
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return {
      success: true,
      redirectUrl: "/",
    };
  } catch (error) {
    console.error("Error in loginAdminAction:", error);
    return {
      success: false,
      error: "Terjadi gangguan sistem saat memproses login. Silakan coba kembali.",
    };
  }
}

/**
 * Server Action untuk keluar (logout) dari sesi admin.
 */
export async function logoutAdminAction(): Promise<{ success: boolean; redirectUrl: string }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("Error in logoutAdminAction:", error);
  }

  return {
    success: true,
    redirectUrl: "/login",
  };
}
