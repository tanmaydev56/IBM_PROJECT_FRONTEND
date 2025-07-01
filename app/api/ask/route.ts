import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const question = formData.get("question") as string | null;
    const top_k = formData.get("top_k") as string | null;

  
    if (!file || !question) {
      return NextResponse.json(
        { error: "Both file and question are required" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

   
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 413 }
      );
    }

    // Prepare form data for backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);
    backendFormData.append("question", question);
    if (top_k) backendFormData.append("top_k", top_k);

   
    const response = await fetch("http://127.0.0.1:8000/ask", {
      method: "POST",
      body: backendFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || "Backend request failed" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in /api/ask:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";