import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash plain text password menggunakan bcrypt.
 * Kompatibel lintas runtime Bun dan Node.js.
 */
export async function hashPassword(plain: string): Promise<string> {
  if (!plain || plain.length < 6) {
    throw new Error("Password minimal harus 6 karakter");
  }
  return await bcrypt.hash(plain, SALT_ROUNDS);
}

/**
 * Verifikasi plain password terhadap hash bcrypt di database.
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!plain || !hash) {
    return false;
  }
  try {
    return await bcrypt.compare(plain, hash);
  } catch (err) {
    console.error("Error verifying password:", err);
    return false;
  }
}
