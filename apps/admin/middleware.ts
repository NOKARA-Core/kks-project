import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory rate limiting map untuk Edge Runtime Vercel
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
  maxAttempts = 5,
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
    pathname.startsWith("/api/upload") ||
    pathname.includes(".") ||
    pathname.startsWith("/uploads")
  ) {
    return NextResponse.next();
  }

  // 2. Deteksi perayap ramah (SEO crawler bypass)
  const isBot = isFriendlyBot(userAgent);

  // 3. Normalisasi rute /admin/login dan /admin
  if (pathname === "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url, 307);
  }
  if (pathname === "/admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url, 307);
  }

  // 4. Proteksi rute login & Rate Limiting
  if (pathname === "/login") {
    // Terapkan rate-limiting untuk percobaan login (maks 5 per 5 menit per IP)
    if (!isBot) {
      const { allowed, resetInSec } = checkRateLimit(`login_${ip}`, 5, 5 * 60 * 1000);
      if (!allowed) {
        return new NextResponse(
          "Terlalu banyak percobaan masuk. Demi keamanan sistem, silakan tunggu 5 menit.",
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

    // Jika sudah memiliki cookie sesi aktif, arahkan langsung ke dashboard
    const sessionCookie = request.cookies.get("kks_admin_session_email")?.value;
    if (sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url, 307);
    }

    return NextResponse.next();
  }

  // 5. Auth Guard: Rute Dasbor dilindungi (Wajib cookie session)
  const sessionCookie = request.cookies.get("kks_admin_session_email")?.value;
  if (!sessionCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
