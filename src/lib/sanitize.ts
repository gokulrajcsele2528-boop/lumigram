/**
 * Recursively sanitizes object payload to prevent MongoDB operator injection ($gt, $ne, $where)
 */
export function sanitizeInput<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === "string") {
    // Trim leading/trailing whitespace
    return input.trim() as unknown as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item)) as unknown as T;
  }

  if (typeof input === "object") {
    const sanitizedObj: Record<string, any> = {};

    for (const [key, value] of Object.entries(input)) {
      // Reject or strip keys starting with $ or containing . (Mongo operator injection)
      if (key.startsWith("$") || key.includes(".")) {
        continue;
      }

      // Check if value is an operator object (e.g. { $gt: "" })
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const valueKeys = Object.keys(value);
        const hasOperator = valueKeys.some((k) => k.startsWith("$") || k.includes("."));
        if (hasOperator) {
          // Dangerous operator object - omit key
          continue;
        }
      }

      sanitizedObj[key] = sanitizeInput(value);
    }

    return sanitizedObj as T;
  }

  return input;
}

export default sanitizeInput;
