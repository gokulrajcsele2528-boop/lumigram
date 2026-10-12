import { NextResponse, NextRequest } from "next/server";

export const ACCESS_COOKIE_NAME = "lumigram_access_token";
export const REFRESH_COOKIE_NAME = "lumigram_refresh_token";
export const CSRF_COOKIE_NAME = "lumigram_csrf_token";

const IS_PROD = process.env.NODE_ENV === "production";

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
}

/**
 * Standard cookie configuration for production auth
 */
export const defaultCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "lax",
  path: "/",
};

/**
 * Attach authentication cookies (Access Token + Rotating Refresh Token) to response
 * @param res NextResponse
 * @param accessToken JWT access token
 * @param refreshToken JWT refresh token
 * @param rememberMe boolean (30 days vs session-only)
 */
export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string,
  rememberMe = true
): void {
  // Access Token: 15 minutes
  res.cookies.set(ACCESS_COOKIE_NAME, accessToken, {
    ...defaultCookieConfig,
    maxAge: 15 * 60, // 15 minutes in seconds
  });

  // Refresh Token: 30 days if rememberMe, else session cookie (omits maxAge)
  const refreshCookieOptions: CookieOptions = {
    ...defaultCookieConfig,
    ...(rememberMe ? { maxAge: 30 * 24 * 60 * 60 } : {}),
  };

  res.cookies.set(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
}

/**
 * Clear all authentication cookies upon logout or token revocation
 */
export function clearAuthCookies(res: NextResponse): void {
  res.cookies.set(ACCESS_COOKIE_NAME, "", {
    ...defaultCookieConfig,
    maxAge: 0,
  });

  res.cookies.set(REFRESH_COOKIE_NAME, "", {
    ...defaultCookieConfig,
    maxAge: 0,
  });
}

/**
 * Extract auth tokens from NextRequest
 */
export function getTokensFromRequest(req: NextRequest): {
  accessToken?: string;
  refreshToken?: string;
} {
  const accessToken =
    req.cookies.get(ACCESS_COOKIE_NAME)?.value ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;

  return { accessToken, refreshToken };
}
