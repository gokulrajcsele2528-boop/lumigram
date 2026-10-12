const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || "";

export interface TurnstileVerificationResult {
  success: boolean;
  errorCodes?: string[];
}

/**
 * Validates Cloudflare Turnstile token with Cloudflare API
 */
export async function verifyTurnstileToken(
  token?: string,
  ip?: string
): Promise<TurnstileVerificationResult> {
  // If no Turnstile key is configured, pass validation gracefully in dev/test
  if (!TURNSTILE_SECRET_KEY || !token) {
    return { success: !TURNSTILE_SECRET_KEY };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    if (ip) {
      formData.append("remoteip", ip);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await res.json();
    return {
      success: !!data.success,
      errorCodes: data["error-codes"],
    };
  } catch (error: any) {
    console.warn("⚠️ Turnstile verification error:", error.message);
    return { success: false, errorCodes: ["network-error"] };
  }
}
