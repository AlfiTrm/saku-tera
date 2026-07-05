import { NextResponse } from "next/server";
import { normalizeOcrPayload } from "@/src/features/dashboard/lib/ocrResponse";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const endpoint = process.env.NEXT_OCR?.trim();

  if (!endpoint) {
    return NextResponse.json(
      { message: "NEXT_OCR belum diatur." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "File OCR tidak ditemukan." },
      { status: 400 },
    );
  }

  const upstreamFormData = new FormData();
  upstreamFormData.append("file", file, file.name);

  const upstreamResponse = await fetch(endpoint, {
    body: upstreamFormData,
    method: "POST",
  });

  const contentType = upstreamResponse.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await upstreamResponse.json().catch(() => null)
    : await upstreamResponse.text().catch(() => "");

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      {
        message:
          typeof payload === "string" && payload
            ? payload
            : "OCR service belum bisa memproses file ini.",
      },
      { status: upstreamResponse.status || 502 },
    );
  }

  return NextResponse.json(normalizeOcrPayload(payload, file.name));
}
