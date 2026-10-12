import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";

const CLIENT_URL = process.env.CLIENT_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Ensures timing-safe API responses to mitigate side-channel timing analysis.
 * Pads request execution so it takes at least `minDurationMs`.
 */
export async function padExecutionTime(startTime: number, minDurationMs = 300): Promise<void> {
  const elapsed = Date.now() - startTime;
  if (elapsed < minDurationMs) {
    await new Promise((resolve) => setTimeout(resolve, minDurationMs - elapsed));
  }
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

/**
 * Verify Origin or Referer header against allowed client URL
 */
export function verifyOrigin(req: NextRequest | Request): boolean {
  const origin = req.headers.get("origin") || req.headers.get("referer");
  if (!origin) return true; // Non-browser / same-origin requests

  try {
    const originUrl = new URL(origin);
    const clientUrl = new URL(CLIENT_URL);
    return originUrl.origin === clientUrl.origin;
  } catch {
    return false;
  }
}

/**
 * Apply hardened security response headers
 */
export function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}
