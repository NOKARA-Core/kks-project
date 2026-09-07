import { cookies } from "next/headers";
import { db, adminUsers, type AdminUser } from "@repo/database";
import { eq } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "kks_admin_session_email";

/**
 * Mendapatkan akun admin yang sedang login berdasarkan cookie session.
 * Jika belum login / cookie kosong, fallback ke akun Superadmin utama untuk menjamin ketersediaan.
 */
export async function getCurrentAdminUser(): Promise<AdminUser> {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get(SESSION_COOKIE_NAME)?.value || "admin@kks-mimika.id";

  const user = await db.query.adminUsers?.findFirst({
    where: eq(adminUsers.email, sessionEmail),
  }) || (
    await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, sessionEmail))
      .limit(1)
  )[0];

  if (user) {
    return user;
  }

  // Fallback: ambil superadmin pertama atau admin pertama di database
  const firstAdmin = (
    await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.isActive, true))
      .limit(1)
  )[0];

  if (firstAdmin) {
    return firstAdmin;
  }

  // Jika tabel kosong sama sekali (safety fallback)
  return {
    id: "00000000-0000-0000-0000-000000000000",
    namaLengkap: "Administrator Pusat KKS",
    email: "admin@kks-mimika.id",
    passwordHash: "",
    noWa: "6281248011234",
    role: "superadmin",
    jabatan: "Ketua Paguyuban KKS Mimika",
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
