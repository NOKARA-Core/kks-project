"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  db,
  adminUsers,
  type AdminUser,
  hashPassword,
  verifyPassword,
} from "@repo/database";
import { eq, desc, ne } from "drizzle-orm";
import { getCurrentAdminUser } from "@/lib/auth";

export type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};

// ==========================================
// 1. Zod Validation Schemas
// ==========================================

const profileSchema = z.object({
  namaLengkap: z.string().trim().min(3, "Nama lengkap minimal 3 karakter"),
  noWa: z
    .string()
    .trim()
    .min(10, "Nomor WhatsApp minimal 10 digit")
    .max(16, "Nomor WhatsApp maksimal 16 digit"),
  jabatan: z.string().trim().min(2, "Jabatan minimal 2 karakter"),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Kata sandi saat ini harus diisi"),
    newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter"),
    confirmPassword: z.string().min(8, "Konfirmasi kata sandi minimal 8 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi baru tidak cocok",
    path: ["confirmPassword"],
  });

const createAdminSchema = z.object({
  namaLengkap: z.string().trim().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().trim().email("Format email tidak valid").toLowerCase(),
  noWa: z.string().trim().min(10, "Nomor WA minimal 10 digit"),
  role: z.enum(["superadmin", "pengurus"]),
  jabatan: z.string().trim().min(2, "Jabatan minimal 2 karakter"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

const updateAdminSchema = z.object({
  id: z.string().uuid("ID pengguna tidak valid"),
  namaLengkap: z.string().trim().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().trim().email("Format email tidak valid").toLowerCase(),
  noWa: z.string().trim().min(10, "Nomor WA minimal 10 digit"),
  role: z.enum(["superadmin", "pengurus"]),
  jabatan: z.string().trim().min(2, "Jabatan minimal 2 karakter"),
});

// ==========================================
// 2. Self Profile & Password Actions
// ==========================================

/**
 * Memperbarui profil akun yang sedang login
 */
export async function updateSelfProfile(
  formData: FormData | { namaLengkap: string; noWa: string; jabatan: string }
): Promise<ActionResult<AdminUser>> {
  try {
    const currentUser = await getCurrentAdminUser();

    const rawData =
      formData instanceof FormData
        ? {
            namaLengkap: formData.get("namaLengkap") as string,
            noWa: formData.get("noWa") as string,
            jabatan: formData.get("jabatan") as string,
          }
        : formData;

    const parsed = profileSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validasi gagal",
      };
    }

    const [updated] = await db
      .update(adminUsers)
      .set({
        namaLengkap: parsed.data.namaLengkap,
        noWa: parsed.data.noWa,
        jabatan: parsed.data.jabatan,
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, currentUser.id))
      .returning();

    revalidatePath("/settings/profile");
    revalidatePath("/settings/users");
    revalidatePath("/");

    return {
      success: true,
      message: "Profil Anda berhasil diperbarui.",
      data: updated,
    };
  } catch (error) {
    console.error("Error in updateSelfProfile:", error);
    return {
      success: false,
      error: "Terjadi kesalahan internal saat memperbarui profil.",
    };
  }
}

/**
 * Mengubah kata sandi akun sendiri
 */
export async function changeSelfPassword(
  formData:
    | FormData
    | { oldPassword: string; newPassword: string; confirmPassword: string }
): Promise<ActionResult> {
  try {
    const currentUser = await getCurrentAdminUser();

    const rawData =
      formData instanceof FormData
        ? {
            oldPassword: formData.get("oldPassword") as string,
            newPassword: formData.get("newPassword") as string,
            confirmPassword: formData.get("confirmPassword") as string,
          }
        : formData;

    const parsed = passwordSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validasi data kata sandi gagal",
      };
    }

    // Ambil record lengkap terbaru dari DB
    const [userRecord] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, currentUser.id))
      .limit(1);

    if (!userRecord) {
      return {
        success: false,
        error: "Akun Anda tidak ditemukan di sistem.",
      };
    }

    // Verifikasi kata sandi lama
    const isOldValid = await verifyPassword(
      parsed.data.oldPassword,
      userRecord.passwordHash
    );

    if (!isOldValid) {
      return {
        success: false,
        error: "Kata sandi saat ini yang Anda masukkan salah.",
      };
    }

    // Hash kata sandi baru
    const newHash = await hashPassword(parsed.data.newPassword);

    await db
      .update(adminUsers)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, currentUser.id));

    return {
      success: true,
      message: "Kata sandi Anda berhasil diperbarui. Silakan gunakan sandi baru ini saat masuk berikutnya.",
    };
  } catch (error) {
    console.error("Error in changeSelfPassword:", error);
    return {
      success: false,
      error: "Gagal memperbarui kata sandi. Silakan coba kembali beberapa saat lagi.",
    };
  }
}

// ==========================================
// 3. User Management Actions (Superadmin Only)
// ==========================================

/**
 * Ambil seluruh daftar pengguna admin/pengurus (hanya superadmin)
 */
export async function getAdminUsersList(): Promise<AdminUser[]> {
  try {
    const currentUser = await getCurrentAdminUser();
    if (currentUser.role !== "superadmin") {
      return [];
    }

    return await db.select().from(adminUsers).orderBy(desc(adminUsers.createdAt));
  } catch (error) {
    console.error("Error in getAdminUsersList:", error);
    return [];
  }
}

/**
 * Membuat akun admin/pengurus baru
 */
export async function createAdminUser(
  data: z.infer<typeof createAdminSchema>
): Promise<ActionResult<AdminUser>> {
  try {
    const currentUser = await getCurrentAdminUser();
    if (currentUser.role !== "superadmin") {
      return {
        success: false,
        error: "Hak akses ditolak. Hanya Superadmin yang dapat mendaftarkan akun pengurus.",
      };
    }

    const parsed = createAdminSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Data formulir tidak valid",
      };
    }

    // Periksa duplikasi email
    const [existing] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, parsed.data.email))
      .limit(1);

    if (existing) {
      return {
        success: false,
        error: `Alamat email "${parsed.data.email}" sudah terdaftar pada sistem.`,
      };
    }

    const hashed = await hashPassword(parsed.data.password);

    const [newAdmin] = await db
      .insert(adminUsers)
      .values({
        namaLengkap: parsed.data.namaLengkap,
        email: parsed.data.email,
        passwordHash: hashed,
        noWa: parsed.data.noWa,
        role: parsed.data.role,
        jabatan: parsed.data.jabatan,
        isActive: true,
      })
      .returning();

    if (!newAdmin) {
      return {
        success: false,
        error: "Gagal menyimpan akun baru ke basis data.",
      };
    }

    revalidatePath("/settings/users");

    return {
      success: true,
      message: `Akun pengurus "${newAdmin.namaLengkap}" berhasil dibuat.`,
      data: newAdmin,
    };
  } catch (error) {
    console.error("Error in createAdminUser:", error);
    return {
      success: false,
      error: "Gagal menyimpan akun baru ke basis data.",
    };
  }
}

/**
 * Mengubah data pengurus lain (Nama, Email, WA, Jabatan, Role)
 */
export async function updateAdminUser(
  data: z.infer<typeof updateAdminSchema>
): Promise<ActionResult<AdminUser>> {
  try {
    const currentUser = await getCurrentAdminUser();
    if (currentUser.role !== "superadmin") {
      return {
        success: false,
        error: "Hak akses ditolak. Hanya Superadmin yang dapat mengubah data akun pengurus.",
      };
    }

    const parsed = updateAdminSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validasi gagal",
      };
    }

    // Cek konflik email pada user lain
    const [conflict] = await db
      .select()
      .from(adminUsers)
      .where(
        eq(adminUsers.email, parsed.data.email)
      )
      .limit(1);

    if (conflict && conflict.id !== parsed.data.id) {
      return {
        success: false,
        error: `Email "${parsed.data.email}" telah digunakan oleh akun lain.`,
      };
    }

    // Proteksi diri: Jangan turunkan role superadmin diri sendiri jika itu satu-satunya
    if (currentUser.id === parsed.data.id && parsed.data.role !== "superadmin") {
      return {
        success: false,
        error: "Demi keamanan sistem, Anda tidak dapat menurunkan role akun Anda sendiri dari Superadmin.",
      };
    }

    const [updated] = await db
      .update(adminUsers)
      .set({
        namaLengkap: parsed.data.namaLengkap,
        email: parsed.data.email,
        noWa: parsed.data.noWa,
        role: parsed.data.role,
        jabatan: parsed.data.jabatan,
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, parsed.data.id))
      .returning();

    if (!updated) {
      return {
        success: false,
        error: "Gagal memperbarui data pengurus.",
      };
    }

    revalidatePath("/settings/users");

    return {
      success: true,
      message: `Data pengurus "${updated.namaLengkap}" berhasil diperbarui.`,
      data: updated,
    };
  } catch (error) {
    console.error("Error in updateAdminUser:", error);
    return {
      success: false,
      error: "Gagal memperbarui data pengurus.",
    };
  }
}

/**
 * Toggle status aktif/nonaktif akun pengurus
 */
export async function toggleAdminUserStatus(
  targetUserId: string,
  isActive: boolean
): Promise<ActionResult> {
  try {
    const currentUser = await getCurrentAdminUser();
    if (currentUser.role !== "superadmin") {
      return {
        success: false,
        error: "Hak akses ditolak. Hanya Superadmin yang berwenang mengubah status akun.",
      };
    }

    // Proteksi diri: Cegah superadmin menonaktifkan akunnya sendiri
    if (currentUser.id === targetUserId) {
      return {
        success: false,
        error: "Anda tidak dapat menonaktifkan akun Anda sendiri.",
      };
    }

    await db
      .update(adminUsers)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, targetUserId));

    revalidatePath("/settings/users");

    return {
      success: true,
      message: `Status akun berhasil ${isActive ? "diaktifkan" : "dinonaktifkan"}.`,
    };
  } catch (error) {
    console.error("Error in toggleAdminUserStatus:", error);
    return {
      success: false,
      error: "Gagal mengubah status akun pengurus.",
    };
  }
}

/**
 * Reset kata sandi akun pengurus oleh superadmin
 */
export async function resetAdminUserPassword(
  targetUserId: string,
  newPlainPassword: string
): Promise<ActionResult> {
  try {
    const currentUser = await getCurrentAdminUser();
    if (currentUser.role !== "superadmin") {
      return {
        success: false,
        error: "Hak akses ditolak. Hanya Superadmin yang berwenang mereset kata sandi.",
      };
    }

    if (!newPlainPassword || newPlainPassword.length < 8) {
      return {
        success: false,
        error: "Kata sandi baru sementara minimal 8 karakter.",
      };
    }

    const hashed = await hashPassword(newPlainPassword);

    await db
      .update(adminUsers)
      .set({
        passwordHash: hashed,
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, targetUserId));

    revalidatePath("/settings/users");

    return {
      success: true,
      message: "Kata sandi akun pengurus berhasil direset.",
    };
  } catch (error) {
    console.error("Error in resetAdminUserPassword:", error);
    return {
      success: false,
      error: "Gagal mereset kata sandi pengguna.",
    };
  }
}
