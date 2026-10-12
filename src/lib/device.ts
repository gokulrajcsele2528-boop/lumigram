import { NextRequest } from "next/server";

export interface DeviceInfo {
  device: string;
  browser: string;
  ip: string;
  userAgent: string;
}

/**
 * Extracts and classifies device, browser, and client IP address
 */
export function extractDeviceInfo(req: NextRequest | Request): DeviceInfo {
  let userAgent = "";
  let ip = "127.0.0.1";

  if ("headers" in req && req.headers) {
    userAgent = req.headers.get("user-agent") || "";
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
      ip = forwarded.split(",")[0].trim();
    } else {
      ip = req.headers.get("x-real-ip") || "127.0.0.1";
    }
  }

  // Detect Device
  let device = "Desktop";
  const uaLower = userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/i.test(userAgent)) {
    device = "Tablet";
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) {
    device = "Mobile";
  }

  // Detect Browser
  let browser = "Unknown Browser";
  if (uaLower.includes("edg/")) {
    browser = "Microsoft Edge";
  } else if (uaLower.includes("chrome") && !uaLower.includes("edg/")) {
    browser = "Google Chrome";
  } else if (uaLower.includes("safari") && !uaLower.includes("chrome")) {
    browser = "Safari";
  } else if (uaLower.includes("firefox")) {
    browser = "Mozilla Firefox";
  } else if (uaLower.includes("opr") || uaLower.includes("opera")) {
    browser = "Opera";
  } else if (uaLower.includes("curl") || uaLower.includes("postman")) {
    browser = "API Client";
  }

  return {
    device,
    browser,
    ip,
    userAgent,
  };
}
