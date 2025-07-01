import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch("http://127.0.0.1:8000/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status}`);
    }

    const healthStatus = await response.json();
    return NextResponse.json(healthStatus);
  } catch (error: any) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
        backend_available: false,
        timestamp: new Date().toISOString(),
        
      },
      { status: 503 }
    );
  }
}

export const runtime = "nodejs";