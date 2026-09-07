import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const ipRateLimitMap = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 10 * 60 * 1000;
let lastCleanup = Date.now();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

function checkRateLimit(
  key: string,
  maxAttempts = 10,
  windowMs = 5 * 60 * 1000
): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    lastCleanup = now;
    for (const [k, entry] of ipRateLimitMap.entries()) {
      if (entry.resetAt <= now) {
        ipRateLimitMap.delete(k);
      }
    }
  }

  const entry = ipRateLimitMap.get(key);
  if (!entry || entry.resetAt <= now) {
    ipRateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, resetInSec: Math.ceil(windowMs / 1000) };
  }

  if (entry.count >= maxAttempts) {
    const resetInSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { allowed: false, remaining: 0, resetInSec };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxAttempts - entry.count, resetInSec: Math.ceil((entry.resetAt - now) / 1000) };
}

const FRIENDLY_BOTS = [
  "googlebot",
  "bingbot",
  "google-inspectiontool",
  "claudebot",
  "perplexitybot",
  "applebot",
  "facebookexternalhit",
  "twitterbot",
  "yandexbot",
  "duckduckbot",
];

function isFriendlyBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return FRIENDLY_BOTS.some((bot) => ua.includes(bot));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";
  const ip = getClientIp(request);

  // 1. Lewati aset statis, manifest, dan berkas berekstensi
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/uploads")
  ) {
    return NextResponse.next();
  }

  // 2. Akses Admin Tersembunyi: Arahkan akses /admin atau /admin/login langsung ke URL Dasbor Admin
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3008";
  if (pathname === "/admin" || pathname === "/admin/login" || pathname.startsWith("/admin/")) {
    const subpath = pathname.replace(/^\/admin/, "") || "/";
    return NextResponse.redirect(`${adminUrl}${subpath}`, 307);
  }

  // 3. Deteksi perayap ramah (SEO crawler bypass)
  const isBot = isFriendlyBot(userAgent);

  // 4. Rate Limiting untuk formulir publik (misal: /pendataan, /api/kontak)
  if (!isBot && request.method === "POST" && pathname.startsWith("/pendataan")) {
    const { allowed, resetInSec } = checkRateLimit(`pub_post_${ip}`, 10, 5 * 60 * 1000);
    if (!allowed) {
      return new NextResponse(
        "Terlalu banyak permintaan formulir. Silakan coba kembali dalam beberapa menit.",
        {
          status: 429,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Retry-After": String(resetInSec),
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
