import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message ? { message } : {}),
    },
    { status }
  );
}

export function errorResponse(message: string, status = 400, error?: any) {
  console.error(`[API Error] [Status ${status}]:`, message, error || "");
  return NextResponse.json(
    {
      success: false,
      message,
      error: error?.message || error || undefined,
    },
    { status }
  );
}
