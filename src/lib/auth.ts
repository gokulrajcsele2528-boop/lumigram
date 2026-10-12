import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const BCRYPT_SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "30d";

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ||
  process.env.JWT_SECRET ||
  "lumigram_fallback_access_secret_super_secure_32_chars";

const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  "lumigram_fallback_refresh_secret_super_secure_32_chars";

export interface AccessTokenPayload {
  userId: string;
  username: string;
  email: string;
  type: "access";
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId?: string;
  type: "refresh";
  iat?: number;
  exp?: number;
}

/**
 * Hash password with bcrypt (12 salt rounds)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain password against bcrypt hash
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword?: string
): Promise<boolean> {
  if (!hashedPassword) {
    // Constant-time dummy comparison to prevent timing enumeration attacks
    await bcrypt.compare(
      plainPassword,
      "$2a$12$e80yq7KjE3gO7FqX5C0vOeY4M7z5h3z.9X9a1g0L9J7B8e8uD3Q9G"
    );
    return false;
  }
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * SHA-256 hash for verification tokens, reset tokens, and refresh tokens
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Generate cryptographically secure random token (e.g. For email verification / password reset)
 */
export function generateRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Generate cryptographically secure 6-digit numeric OTP
 */
export function generateOTP(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Issue 15-minute Access Token
 */
export function signAccessToken(payload: {
  userId: string;
  username: string;
  email: string;
}): string {
  return jwt.sign(
    {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      type: "access",
    },
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

/**
 * Issue 30-day Refresh Token
 */
export function signRefreshToken(payload: {
  userId: string;
  sessionId?: string;
}): string {
  return jwt.sign(
    {
      userId: payload.userId,
      sessionId: payload.sessionId,
      type: "refresh",
    },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

/**
 * Verify Access Token
 */
export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as AccessTokenPayload;
    if (decoded && decoded.type === "access") {
      return decoded;
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Verify Refresh Token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
    if (decoded && decoded.type === "refresh") {
      return decoded;
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Constant-time string equality check to prevent timing attacks
 */
export function safeStringCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
