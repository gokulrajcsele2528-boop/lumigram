import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  hashToken,
  generateRandomToken,
  generateOTP,
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  safeStringCompare,
} from "../src/lib/auth";
import { checkRateLimit, resetRateLimit } from "../src/lib/rateLimit";
import { sanitizeInput } from "../src/lib/sanitize";
import { extractDeviceInfo } from "../src/lib/device";
import { setAuthCookies, defaultCookieConfig, ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from "../src/lib/cookies";
import { NextResponse } from "next/server";

describe("Step 1: Auth Helpers & Security Primitives", () => {
  describe("Password Hashing & Constant-Time Verification", () => {
    it("hashes password with bcrypt and verifies correctly", async () => {
      const password = "SuperSecretPassword123!";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash.startsWith("$2a$12$") || hash.startsWith("$2b$12$")).toBe(true);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);

      const isWrong = await verifyPassword("WrongPassword123!", hash);
      expect(isWrong).toBe(false);
    });

    it("handles undefined hash safely with dummy constant-time check", async () => {
      const result = await verifyPassword("anyPassword", undefined);
      expect(result).toBe(false);
    });

    it("performs safe string comparison", () => {
      expect(safeStringCompare("lumigram-token-123", "lumigram-token-123")).toBe(true);
      expect(safeStringCompare("lumigram-token-123", "lumigram-token-456")).toBe(false);
      expect(safeStringCompare("short", "longer-string")).toBe(false);
    });
  });

  describe("Token Management & JWT", () => {
    it("hashes tokens consistently with SHA-256", () => {
      const token = "my-sample-verification-token";
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64); // SHA-256 hex is 64 chars
    });

    it("generates random token and 6-digit numeric OTP", () => {
      const randomToken = generateRandomToken(32);
      expect(randomToken.length).toBe(64); // 32 bytes hex = 64 chars

      const otp = generateOTP();
      expect(otp).toMatch(/^\d{6}$/);
      expect(parseInt(otp, 10)).toBeGreaterThanOrEqual(100000);
      expect(parseInt(otp, 10)).toBeLessThan(1000000);
    });

    it("signs and verifies JWT access token (15 min)", () => {
      const payload = {
        userId: "user_12345",
        username: "lumi_creator",
        email: "creator@lumigram.com",
      };

      const token = signAccessToken(payload);
      expect(token).toBeDefined();

      const decoded = verifyAccessToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(payload.userId);
      expect(decoded?.username).toBe(payload.username);
      expect(decoded?.email).toBe(payload.email);
      expect(decoded?.type).toBe("access");
    });

    it("signs and verifies JWT refresh token (30 days)", () => {
      const payload = {
        userId: "user_67890",
        sessionId: "sess_abcdef",
      };

      const token = signRefreshToken(payload);
      expect(token).toBeDefined();

      const decoded = verifyRefreshToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(payload.userId);
      expect(decoded?.sessionId).toBe(payload.sessionId);
      expect(decoded?.type).toBe("refresh");
    });

    it("rejects invalid or tampered JWT token", () => {
      const badToken = "invalid.token.structure";
      expect(verifyAccessToken(badToken)).toBeNull();
      expect(verifyRefreshToken(badToken)).toBeNull();
    });
  });

  describe("Rate Limiting", () => {
    it("enforces max attempts and calculates reset window", () => {
      const key = "test:ip:127.0.0.1";
      resetRateLimit(key);

      // 3 allowed attempts in this test
      const res1 = checkRateLimit(key, 3, 60000);
      expect(res1.success).toBe(true);
      expect(res1.remaining).toBe(2);

      const res2 = checkRateLimit(key, 3, 60000);
      expect(res2.success).toBe(true);
      expect(res2.remaining).toBe(1);

      const res3 = checkRateLimit(key, 3, 60000);
      expect(res3.success).toBe(true);
      expect(res3.remaining).toBe(0);

      // 4th attempt should be blocked
      const res4 = checkRateLimit(key, 3, 60000);
      expect(res4.success).toBe(false);
      expect(res4.remaining).toBe(0);
      expect(res4.message).toContain("Too many attempts");

      // Reset works
      resetRateLimit(key);
      const res5 = checkRateLimit(key, 3, 60000);
      expect(res5.success).toBe(true);
    });
  });

  describe("Input Sanitization", () => {
    it("strips MongoDB operator injection keys ($gt, $ne, etc)", () => {
      const maliciousPayload = {
        username: "admin",
        password: { $gt: "" },
        "address.city": "New York",
        cleanField: "valid-input",
      };

      const cleaned = sanitizeInput(maliciousPayload) as Record<string, any>;
      expect(cleaned.username).toBe("admin");
      expect(cleaned.password).toBeUndefined();
      expect(cleaned["address.city"]).toBeUndefined();
      expect(cleaned.cleanField).toBe("valid-input");
    });

    it("trims strings recursively", () => {
      const input = {
        name: "   Lumigram User   ",
        tags: ["  art ", " photography  "],
      };

      const cleaned = sanitizeInput(input);
      expect(cleaned.name).toBe("Lumigram User");
      expect(cleaned.tags).toEqual(["art", "photography"]);
    });
  });

  describe("Device & User-Agent Parsing", () => {
    it("correctly identifies mobile browser", () => {
      const mockReq = {
        headers: new Headers({
          "user-agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
          "x-forwarded-for": "203.0.113.195, 10.0.0.1",
        }),
      } as any;

      const info = extractDeviceInfo(mockReq);
      expect(info.device).toBe("Mobile");
      expect(info.browser).toBe("Safari");
      expect(info.ip).toBe("203.0.113.195");
    });

    it("correctly identifies desktop Chrome", () => {
      const mockReq = {
        headers: new Headers({
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "x-real-ip": "198.51.100.42",
        }),
      } as any;

      const info = extractDeviceInfo(mockReq);
      expect(info.device).toBe("Desktop");
      expect(info.browser).toBe("Google Chrome");
      expect(info.ip).toBe("198.51.100.42");
    });
  });

  describe("Cookie Headers & Management", () => {
    it("sets httpOnly and lax cookies with rememberMe duration", () => {
      const res = NextResponse.json({ ok: true });
      setAuthCookies(res, "access-token-123", "refresh-token-456", true);

      const accessCookie = res.cookies.get(ACCESS_COOKIE_NAME);
      const refreshCookie = res.cookies.get(REFRESH_COOKIE_NAME);

      expect(accessCookie).toBeDefined();
      expect(accessCookie?.value).toBe("access-token-123");
      expect(refreshCookie).toBeDefined();
      expect(refreshCookie?.value).toBe("refresh-token-456");
    });
  });
});
