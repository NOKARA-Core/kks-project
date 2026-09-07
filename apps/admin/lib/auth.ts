import { cookies } from "next/headers";
import { db, adminUsers, type AdminUser, verifyPassword } from "@repo/database";
import { eq, or } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "kks_admin_session_email";

/**
 * Mendapatkan akun admin yang sedang login berdasarkan cookie session.
 * Mengembalikan null jika belum terautentikasi atau akun dinonaktifkan.
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionEmail) {
      return null;
    }

    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, sessionEmail))
      .limit(1);

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error in getCurrentAdminUser:", error);
    return null;
  }
}

/**
 * Helper untuk halaman/action yang mewajibkan autentikasi.
 * Mengembalikan AdminUser jika valid, atau melempar error jika belum login.
 */
export async function requireAuthAdminUser(): Promise<AdminUser> {
  const user = await getCurrentAdminUser();
  if (!user) {
    throw new Error("Sesi Anda telah berakhir atau belum login. Silakan masuk kembali.");
  }
  return user;
}
