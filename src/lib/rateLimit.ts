interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory cache for IP and action rate limiting
const ipLimiterStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    ipLimiterStore.forEach((value, key) => {
      if (value.resetAt < now) {
        ipLimiterStore.delete(key);
      }
    });
  }, 5 * 60 * 1000).unref?.();
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetSeconds: number;
  message?: string;
}

/**
 * Check and record a rate limit attempt for a given key (e.g. IP + endpoint)
 * @param key Unique identifier (e.g. `login:192.168.1.1`)
 * @param maxAttempts Maximum allowed attempts
 * @param windowMs Time window in milliseconds (e.g. 15 * 60 * 1000 for 15 mins)
 */
export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const record = ipLimiterStore.get(key);

  if (!record || record.resetAt <= now) {
    ipLimiterStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: maxAttempts - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= maxAttempts) {
    const resetSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetSeconds,
      message: `Too many attempts. Please try again in ${Math.ceil(resetSeconds / 60)} minute(s).`,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: maxAttempts - record.count,
    resetSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

/**
 * Reset rate limit counter for a key upon successful action
 */
export function resetRateLimit(key: string): void {
  ipLimiterStore.delete(key);
}
